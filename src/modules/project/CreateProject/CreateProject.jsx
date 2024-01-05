import { Box, Button, Container, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import Copyright from "../../../components/Copyright";
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Thư viện Yup giúp mình validate Hook Form
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { getAllProject, getProjectDetail } from '../../../apis/project.api';
import { creatProjectAuthorize } from '../../../apis/project.api';
import { editProject } from '../../../apis/project.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PATH } from '../../../utils/paths'
import { useDispatch, useSelector } from 'react-redux';
import { projectListAction } from '../../../redux/slices/project.slice';

// Thư viện Yup resolver
const schemaCreateProject = yup.object({
    projectName: yup
        .string()
        .required("Vui lòng nhập thông tin"),
    description: yup.string().required("Vui lòng nhập thông tin"),
    categoryId: yup.string().required("Vui lòng chọn"),
    alias: yup.string().required("Vui lòng nhập thông tin"),

});


const CreateProject = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { projectIdToEdit } = useSelector(state => state.project);


    // thư viện SweetAlert
    const MySwal = withReactContent(Swal);


    // CSS
    const typographySettings = {
        style: {
            fontSize: 16,
            fontWeight: 500,
        }
    }


    // Validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            id: 0,
            projectName: "",
            description: "",
            categoryId: 0,
            alias: ""
        },
        resolver: yupResolver(schemaCreateProject),
        // sự kiện này có onChange, onBlue, onSubmit
        mode: "all",
    });


    // Xử lý formValue (raw data lấy từ form)
    const [formValue, setFormValue] = useState({
        id: 0,
        projectName: "",
        creator: 0,
        categoryId: "",
        description: "",
        alias: "",
    });


    // Xử lý formProjectToEdit
    const [formProjectToEdit, setFormProjectToEdit] = useState({
        id: 0,
        projectName: "",
        creator: 0,
        categoryId: "",
        description: "",
    });


    // lấy projectToEdit về bằng getProjectDetail API
    const { data: projectToEdit, isLoading, isError, error } = useQuery({
        queryKey: ["projectIdToEdit", projectIdToEdit],
        queryFn: () => getProjectDetail(projectIdToEdit),
        // chỉ kích hoạt nếu có dữ liệu trong projectIdToEdit (lấy từ store của Redux về do Home đưa lên)
        enabled: !!projectIdToEdit,
    });


    // dùng useMutation để POST lên API (dùng creatProject thì sau đó ko xoá đc nên ko dùng)
    const { mutate: handleCreateProject, isPending: isAdding } = useMutation({
        mutationFn: (payload) => creatProjectAuthorize(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã tạo dự án thành công",
                text: "Quay lại trang quản lý dự án",
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: ["creatProjectAuthorize"] });
                    
                    getAllProject();
                    navigate(PATH.PROJECTMANAGEMENT);
                }
            })
        },
        onError: (error) => {
            alert(error);
        }
    });


    // dùng useMutation để PUT lên API
    const { mutate: handleEditProject, isPending: isEditting } = useMutation({
        mutationFn: (payload) => editProject(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã sửa dự án thành công",
                text: "Quay lại trang quản lý dự án",
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: ["editProject"] });
                    // sửa xong re-render lại
                    getAllProject();
                    navigate(PATH.PROJECTMANAGEMENT);
                }
            })
        },
        onError: (error) => {
            alert(error);
        }
    });


    const handleSetProjectToEdit = () => {
        setFormProjectToEdit({
            ...formProjectToEdit,
            id: projectToEdit.id,
            projectName: formValue.projectName,
            creator: 0,
            categoryId: formValue.categoryId,
            description: formValue.description,
        })
    }
    
    
    const onSubmit = (formValues) => {
        // hàm set giá trị cho cái project mà mình muốn update
        if (projectToEdit) {
            handleSetProjectToEdit();
        }
        // có projectToEdit thì sửa
        // cái formValue này đc định nghĩa theo cấu trúc để bài yêu cầu bài bằng useState phía trên, các thành phần trong đó đc đưa vào bằng hàm handleSetFormValue ( bên trong có hàm setFormValue )
        if (projectToEdit) {
            handleEditProject(formProjectToEdit);
        }
        // ko có projectToEdit thì thêm
        // tham số formValues này là do xài useForm, nó tự lấy từ trong form mình ra, nên chỉ cần làm cái form đúng theo yêu cầu đề bài là đc
        else {
            handleCreateProject(formValues);
        }

        // clear form sau khi addProduct
        setFormValue({
            id: "",
            projectName: "",
            creator: "",
            categoryId: 0,
            description: "",
            alias: "",
        });
    };

    const onError = (error) => {
        alert(error);
    };


    // Hàm xử lý formValue
    const handleSetFormValue = (value) => event => {
        setFormValue({
            // clone lại vì những cái setFormValue sau dòng này sẽ làm mất giá trị id
            ...formValue,
            // có dấu ngoặc vuông là dynamic, thì nó sẽ hiểu đây là thuộc tính để truyền vào
            [value]: event.target.value,
        })
    }


    // khi ấn sửa thì projectToEdit đc hình thành, hàm setFormValue hạy và formValue có giá trị. Giá trị này đc gán vào value={} trong TextField hoặc Select bên dưới
    useEffect(() => {
        if (projectToEdit) {
            setFormValue(projectToEdit);
            handleSetProjectToEdit();
        }
    }, [projectToEdit])



    return (
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
            <Container style={{ maxWidth: "80vw" }} sx={{ margin: "60px 60px", padding: "24px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
                <Box
                    style={{
                        padding: "10px",
                        boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)",
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <Typography variant="h5" style={{ color: `${blue[500]}` }}>
                        Bảng dự án
                    </Typography>
                </Box>
                <div style={{ height: "90%", width: '100%' }}>
                    <Box
                        component="form"
                        sx={{ mt: 1 }}
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        {
                            projectToEdit === undefined ? (
                                <>
                                </>
                            ) : (
                                <TextField
                                    required
                                    fullWidth
                                    id="projectId"
                                    label={Boolean(!formValue.id) && "Id dự án"}
                                    name="projectId"
                                    type="number"
                                    style={{ marginBottom: 10 }}
                                    disabled
                                    value={formValue.id}
                                />
                            )
                        }
                        <TextField
                            required
                            fullWidth
                            id="projectName"
                            label={"Tên dự án"}
                            name="projectName"
                            type="text"
                            placeholder="Dự án JIRA"
                            autoFocus
                            style={{ marginBottom: 10 }}
                            {...register("projectName")}
                            error={Boolean(errors.projectName)}
                            helperText={Boolean(errors.projectName) && errors.projectName.message}
                            value={formValue.projectName}
                            onChange={handleSetFormValue("projectName")}
                        />
                        <FormControl fullWidth
                            error={Boolean((!formValue.categoryId) && (!projectToEdit?.projectCategory.id)) || 0}
                            style={{ marginBottom: 10 }}
                        >
                            <InputLabel id="demo-simple-select-label" >Chọn dự án</InputLabel>
                            <Select
                                // helperText={Boolean(errors.categoryId) && errors.categoryId.message}
                                {...register("categoryId")}
                                required
                                id="categoryId"
                                label={"Chọn dự án"}
                                value={(formValue.categoryId ? formValue.categoryId : projectToEdit?.projectCategory.id) || 0}
                                onChange={handleSetFormValue("categoryId")}
                            >
                                <MenuItem value={0}>...</MenuItem>
                                <MenuItem value={1}>Dự án web</MenuItem>
                                <MenuItem value={2}>Dự án phần mềm</MenuItem>
                                <MenuItem value={3}>Dự án di động</MenuItem>
                            </Select>
                            <FormHelperText>{Boolean((!formValue.categoryId) && (!projectToEdit?.projectCategory.id) || 0) && "Xin vui lòng chọng dự án phù hợp"}</FormHelperText>
                        </FormControl>
                        <TextField
                            required
                            fullWidth
                            name="description"
                            placeholder="Nội dung..."
                            label="Miêu tả"
                            variant="outlined"
                            style={{ height: "300", marginBottom: 10 }}
                            inputProps={{
                                style: {
                                    height: "100px",
                                },
                            }}
                            {...register("description")}
                            error={Boolean(errors.description)}
                            helperText={Boolean(errors.description) && errors.description.message}
                            value={formValue.description}
                            onChange={handleSetFormValue("description")}
                        />
                        <TextField
                            required
                            fullWidth
                            name="alias"
                            placeholder="Nội dung..."
                            label="Bí danh"
                            variant="outlined"
                            style={{ height: "50px", marginBottom: 40 }}
                            multiline
                            maxRows={6}
                            {...register("alias")}
                            error={Boolean(errors.alias)}
                            helperText={Boolean(errors.alias) && errors.alias.message}
                            value={formValue.alias}
                            onChange={handleSetFormValue("alias")}
                        />
                        {
                            projectToEdit === undefined ? (
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ fontSize: "14px", border: `1px ${blue[500]} solid` }}
                                    type="submit"
                                    loading={isAdding}
                                >
                                    Tạo dự án
                                </LoadingButton>
                            ) : (
                                <LoadingButton
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    sx={{ fontSize: "14px", border: `1px ${green[500]} solid` }}
                                    type="submit"
                                    loading={isEditting}
                                >
                                    Sửa dự án
                                </LoadingButton>
                            )
                        }
                    </Box>
                </div>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </div>
    )
}

export default CreateProject