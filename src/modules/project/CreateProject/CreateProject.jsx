import { Box, Button, Container, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import Copyright from "../../../components/Copyright";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@mui/joy';

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Thư viện Yup giúp mình validate Hook Form
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { creatProject } from '../../../apis/project.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PATH } from '../../../utils/paths'

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
    const [categoryId, setCategoryId] = useState("0");
    const queryClient = useQueryClient();


    // thư viện SweetAlert
    const MySwal = withReactContent(Swal);


    // CSS
    const typographySettings = {
        style: {
            fontSize: 16,
            fontWeight: 500,
        }
    }


    // định nghĩa hàm
    const handleChangeCategoryName = (event) => {
        setCategoryId(event.target.value);
    };


    // Validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            projectName: "",
            description: "",
            categoryId: 0,
            alias: ""
        },
        resolver: yupResolver(schemaCreateProject),
        // sự kiện này có onChange, onBlue, onSubmit
        mode: "all",
    });


    // dùng useMutation, khi có 1 thao tác thì mới thực hiện POST lên API
    const { mutate: handlecreateProject, isPending } = useMutation({
        mutationFn: (payload) => creatProject(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã đặt vé thành công",
                text: "Quay lại trang phim",
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: [""] });
                    navigate(PATH.PROJECTMANAGEMENT);
                }
            })
        },
        onError: (error) => {
            Alert(errors);
        }

    });

    const onSubmit = (formValues) => {
        handlecreateProject(formValues);
    };

    const onError = (errors) => {
        Alert(errors);
    };




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
                        <TextField
                            required
                            fullWidth
                            id="projectName"
                            label="Tên dự án"
                            name="projectName"
                            type="text"
                            placeholder="Dự án JIRA"
                            autoFocus
                            style={{ marginBottom: 10 }}
                            {...register("projectName")}
                            error={Boolean(errors.projectName)}
                            helperText={Boolean(errors.projectName) && errors.projectName.message}
                        />
                        <FormControl fullWidth

                            error={!categoryId}
                            style={{ marginBottom: 10 }}
                        >
                            <InputLabel id="demo-simple-select-label" >Chọn dự án</InputLabel>
                            <Select
                                // helperText={Boolean(errors.categoryId) && errors.categoryId.message}
                                {...register("categoryId")}
                                required
                                id="categoryId"
                                label="Chọn dự án"
                                autoFocus
                                value={categoryId}
                                onChange={handleChangeCategoryName}
                            >
                                <MenuItem value={0}>...</MenuItem>
                                <MenuItem value={1}>Dự án web</MenuItem>
                                <MenuItem value={2}>Dự án phần mềm</MenuItem>
                                <MenuItem value={3}>Dự án di động</MenuItem>
                            </Select>
                            <FormHelperText>{Boolean(!categoryId) && "Xin vui lòng chọng dự án phù hợp"}</FormHelperText>
                        </FormControl>
                        <TextField
                            required
                            fullWidth
                            name="description"
                            placeholder="Nội dung …"
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
                        />
                        <TextField
                            required
                            fullWidth
                            name="alias"
                            placeholder="Nội dung"
                            label="Bí danh"
                            variant="outlined"
                            style={{ height: "50px", marginBottom: 40 }}
                            multiline
                            maxRows={6}
                            {...register("alias")}
                            error={Boolean(errors.alias)}
                            helperText={Boolean(errors.alias) && errors.alias.message}
                        />
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ fontSize: "14px", border: `1px ${blue[500]} solid` }}
                            type="submit"
                            loading={isPending}
                        >
                            Tạo dự án
                        </LoadingButton>
                    </Box>
                </div>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </div>
    )
}

export default CreateProject