import React, { useState } from 'react'
import { Autocomplete, Box, Button, Container, Slider, Stack, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { orange } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import Copyright from "../../components/Copyright";
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Tooltip from '@mui/material/Tooltip';

// API
import { getAllProject } from '../../apis/project.api';
import { getAllStatus } from '../../apis/status.api';
import { getTaskType } from '../../apis/taskType.api';
import { getAllPriority } from '../../apis/priority.api';
import { createTask } from '../../apis/task.api';

// Thư viện Yup giúp mình validate Hook Form
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getUser } from '../../apis/user.api';
import { useNavigate } from 'react-router-dom'
import { PATH } from '../../utils/paths'


// thư viện SweetAlert
const MySwal = withReactContent(Swal);


// CSS
const typographySettings = {
    style: {
        fontSize: 16,
        fontWeight: 500,
    }
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: "auto",
    bgcolor: 'background.paper',
    border: `1px ${blue[500]} solid`,
    boxShadow: 24,
    p: 4,
};


const Task = () => {
    const navigate = useNavigate();
    let { projectList } = useSelector((state) => state.project);
    const [searchprojectInput, setSearchProjectInput] = useState("");
    const [searchProjectResult, setSearchProjectResult] = useState("");
    const [searchStatusInput, setSearchStatusInput] = useState("");
    const [searchStatusResult, setSearchStatusResult] = useState("");
    const [searchPriorityInput, setSearchPriorityInput] = useState("");
    const [searchPriorityResult, setSearchPriorityResult] = useState("");
    const [searchTaskTypeInput, setSearchTaskTypeInput] = useState("");
    const [searchTaskTypeResult, setSearchTaskTypeResult] = useState("");
    const [searchMemberInput, setSearchMemberInput] = useState("");
    const [searchMemberResult, setSearchMemberResult] = useState("");
    const [timeTracking, setTimeTracking] = useState("");


    // Xử lý formValue (raw data lấy từ form)
    const [formValue, setFormValue] = useState({
        listUserAsign: [],
        taskName: "",
        description: "",
        statusId: "",
        originalEstimate: 0,
        timeTrackingSpent: 0,
        timeTrackingRemaining: 0,
        projectId: 0,
        typeId: 0,
        priorityId: 0,
    });


    // Thư viện Yup resolver
    const schemaCreateProject = yup.object({
        taskName: yup.string().required("Vui lòng nhập thông tin"),
        statusId: yup.string().required("Vui lòng chọn"),
        description: yup.string().required("Vui lòng nhập thông tin"),
    });


    // Validation
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            listUserAsign: [],
            taskName: "",
            description: "",
            statusId: "",
            originalEstimate: 0,
            timeTrackingSpent: 0,
            timeTrackingRemaining: 0,
            projectId: 0,
            typeId: 0,
            priorityId: 0,
        },
        resolver: yupResolver(schemaCreateProject),
        // sự kiện này có onChange, onBlue, onSubmit
        mode: "all",
    });


    // thư viện Slider từ MUI
    function ValueLabelComponent(props) {
        const { children, value } = props;
        setTimeTracking(value);
        return (
            <Tooltip enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }


    // nếu user ko chạy trang home trước mà vô trang management trước thì ko dùng dữ liệu từ store Redux đc mà phải tự gọi API
    let projectListData = [];
    const { data = [], isLoadingAllProject, refetch: refetchAllProject } = useQuery({
        queryKey: ["allProject"],
        queryFn: getAllProject,
        // chỉ kích hoạt khi chưa có dữ liệu trong projectList (lấy từ store của Redux về do Home đưa lên)
        enabled: !!projectList,
    });
    // tạo hàm handleChangeData để push dữ liệu lấy đc từ API vào projectListData
    const handleChangeData = () => {
        for (let i in data) {
            projectListData.push(data[i]);
            projectList = projectListData;
        }
    }
    if (data.length > 0) {
        handleChangeData();
    }


    // hàm GET allStatus
    const { data: allStatus, isLoadingAllStatus, refetch: refetchAllStatus } = useQuery({
        queryKey: ["allStatus"],
        queryFn: getAllStatus,
    });

    // hàm GET allPriority
    const { data: allPriority, isLoadingAllPriority, refetch: refetchAllPriority } = useQuery({
        queryKey: ["allPriority"],
        queryFn: getAllPriority,
    });

    // hàm GET taskType
    const { data: taskType, isLoadingTaskType, refetch: refetchTaskType } = useQuery({
        queryKey: ["taskType"],
        queryFn: getTaskType,
    });

    // Hàm getUser
    const { data: allUser, isLoading: isLoadingAllUser } = useQuery({
        queryKey: ["getUser"],
        queryFn: getUser,
    });


    // 
    const { mutate: handleCreateTask, isPending: isAdding } = useMutation({
        mutationFn: (payload) => createTask(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã tạo dự án thành công",
                // text: "Quay lại trang quản lý dự án",
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: ["createTask"] });
                    setFormValue({
                        listUserAsign: [],
                        taskName: "",
                        description: "",
                        statusId: "",
                        originalEstimate: 0,
                        timeTrackingSpent: 0,
                        timeTrackingRemaining: 0,
                        projectId: 0,
                        typeId: 0,
                        priorityId: 0,
                    });
                }
            })
        },
        onError: (error) => {
            alert(error);
        }
    });


    const handleSetFormValue = (value) => event => {
        setFormValue({
            ...formValue,
            [value]: event.target.value,
        })
    }


    const handleSubmitButton = () => {
        // Hàm xử lý các giá trị của phần tử trong formValue
        if (searchStatusResult.trim() && allStatus.length > 0) {
            allStatus.filter((item) => {
                if (item.statusName
                    .toLowerCase().trim().includes(searchStatusResult.toLowerCase().trim())) {
                    formValue.statusId = item.statusId;
                }
            })
        }
        if (searchPriorityResult.trim() && allPriority.length > 0) {
            allPriority.filter((item) => {
                if (item.priority
                    .toLowerCase().trim().includes(searchPriorityResult.toLowerCase().trim())) {
                    formValue.priorityId = item.priorityId;
                }
            })
        }
        if (searchTaskTypeResult.trim() && taskType.length > 0) {
            taskType.filter((item) => {
                if (item.taskType.toLowerCase().trim().includes(searchTaskTypeResult.toLowerCase().trim())) {
                    formValue.typeId = item.id;
                }
            })
        }
        if (searchProjectResult.trim() && projectList.length > 0) {
            projectList.filter((item) => {
                if (item.projectName.toLowerCase().trim().includes(searchProjectResult.toLowerCase().trim())) {
                    formValue.projectId = item.id;
                }
            })
        }
        if (projectList.length > 0) {
            formValue.listUserAsign = [];
            for (let i in allUser) {
                for (let j in searchMemberResult) {
                    if (allUser[i].name.toLowerCase().trim().includes(searchMemberResult[j]
                        .toLowerCase().trim())) {
                        formValue.listUserAsign.push(allUser[i]);
                    }
                }
            }
        }
        if (formValue.originalEstimate) {
            formValue.originalEstimate = parseInt(formValue.originalEstimate);
        }
        if (formValue.timeTrackingSpent) {
            formValue.timeTrackingSpent = parseInt(formValue.timeTrackingSpent);
        }
        if (formValue.timeTrackingRemaining) {
            formValue.timeTrackingRemaining = parseInt(formValue.timeTrackingRemaining);
        }

        if (
            formValue.description !== "" &&
            formValue.statusId !== "" &&
            formValue.originalEstimate !== 0 &&
            formValue.projectId !== 0 &&
            formValue.typeId !== 0 &&
            formValue.priorityId !== 0
        ) {
            MySwal.fire({
                icon: "question",
                title: "Bạn có chắc muốn thêm công việc này không?",
                text: "Thêm một phát sửa mệt lắm nha, ko giỡn!",
                showCancelButton: true,
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    handleCreateTask(formValue);
                }
                else {
                    // do nothing
                }
            })
        }
    }


    // Hàm xử lý form
    const onSubmit = () => {
        console.log("Submit thành công");
    };


    const onError = (error) => {
        alert("Lỗi Form");
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
                        Bảng tạo công việc
                    </Typography>
                </Box>
                <div style={{ height: "90%", width: '100%' }}>
                    <Box
                        component="form"
                        sx={{ mt: 1 }}
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                Chọn dự án
                            </Typography>
                            <Typography>
                                {
                                    projectList ? (
                                        <Stack spacing={2}>
                                            <Autocomplete
                                                id="free-solo-2-demo"
                                                disableClearable
                                                options={projectList.map((project) => project.projectName)}
                                                onChange={(event, newValue) => {
                                                    setSearchProjectResult(newValue);
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    setSearchProjectInput(newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Tìm kiếm dự án"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            type: 'search',
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    ) : (
                                        <Typography {...typographySettings} color={"error"}>
                                            Không tải được dự án
                                        </Typography>
                                    )
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                Tên công việc
                            </Typography>
                            <Typography>
                                <TextField
                                    required
                                    fullWidth
                                    id="taskName"
                                    label={"Tên công việc"}
                                    name="taskName"
                                    type="text"
                                    placeholder="Fix Bug"
                                    {...register("taskName")}
                                    error={Boolean(errors.taskName)}
                                    helperText={Boolean(errors.taskName) && errors.taskName.message}
                                    value={formValue.taskName}
                                    onChange={handleSetFormValue("taskName")}
                                />
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                Trạng thái
                            </Typography>
                            <Typography>
                                {
                                    allStatus ? (
                                        <Stack spacing={2}>
                                            <Autocomplete
                                                id="free-solo-2-demo"
                                                disableClearable
                                                options={allStatus.map((status) => status.statusName)}
                                                onChange={(event, newValue) => {
                                                    setSearchStatusResult(newValue);
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    setSearchStatusInput(newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Trạng thái"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            type: 'search',
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    ) : (
                                        <Typography {...typographySettings} color={"error"}>
                                            Không tải được trạng thái
                                        </Typography>
                                    )
                                }
                            </Typography>
                        </Box>
                        <Stack
                            spacing={3}
                            justifyContent={"center"}
                            alignItems={"center"}
                            direction={"row"}
                            sx={{ margin: "0 0 15px" }}
                        >
                            <Box sx={{ width: "100%" }}>
                                <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                    Ưu tiên
                                </Typography>
                                <Typography>
                                    {
                                        allPriority ? (
                                            <Stack spacing={2}>
                                                <Autocomplete
                                                    id="free-solo-2-demo"
                                                    disableClearable
                                                    options={allPriority.map((priority) => priority.priority)}
                                                    value={allPriority.priorityId}
                                                    onChange={(event, newValue) => {
                                                        setSearchPriorityResult(newValue);
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        setSearchPriorityInput(newInputValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Ưu tiên"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                type: 'search',
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        ) : (
                                            <Typography {...typographySettings} color={"error"}>
                                                Không tải được trạng thái
                                            </Typography>
                                        )
                                    }
                                </Typography>
                            </Box>
                            <Box sx={{ width: "100%" }}>
                                <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                    Loại công việc
                                </Typography>
                                <Typography>
                                    {
                                        taskType ? (
                                            <Stack spacing={2}>
                                                <Autocomplete
                                                    id="free-solo-2-demo"
                                                    disableClearable
                                                    options={taskType.map((taskType) => taskType.taskType)}
                                                    value={taskType.id}
                                                    onChange={(event, newValue) => {
                                                        setSearchTaskTypeResult(newValue);
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        setSearchTaskTypeInput(newInputValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Loại công việc"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                type: 'search',
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        ) : (
                                            <Typography {...typographySettings} color={"error"}>
                                                Không tải được trạng thái
                                            </Typography>
                                        )
                                    }
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack
                            spacing={3}
                            justifyContent={"center"}
                            alignItems={"center"}
                            direction={"row"}
                            sx={{ margin: "0 0 15px" }}
                        >
                            <Box sx={{ width: "100%" }}>
                                <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                    Gán thành viên
                                </Typography>
                                <Typography>
                                    {
                                        allUser ? (
                                            <Stack spacing={2}>
                                                <Autocomplete
                                                    multiple
                                                    id="free-solo-2-demo"
                                                    disableClearable
                                                    options={allUser.map((user) => user.name)}
                                                    onChange={(event, newValue) => {
                                                        setSearchMemberResult(newValue);
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        setSearchMemberInput(newInputValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Thành viên"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                type: 'search',
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Stack>
                                        ) : (
                                            <Typography {...typographySettings} color={"error"}>
                                                Không tải được thành viên
                                            </Typography>
                                        )
                                    }
                                </Typography>
                            </Box>
                            <Box sx={{ width: "100%", textAlign: "center" }}>
                                <Typography gutterBottom
                                    sx={{
                                        textAlign: "left"
                                    }}
                                >Thời gian cần (ngày)</Typography>
                                <Slider
                                    valueLabelDisplay="auto"
                                    slots={{
                                        valueLabel: ValueLabelComponent,
                                    }}
                                    aria-label="custom thumb label"
                                    defaultValue={14}
                                    sx={{
                                        width: "95%",
                                        color: 'success.main',
                                        textAlign: "center"
                                    }}
                                ></Slider>
                            </Box>
                        </Stack>
                        <Stack
                            spacing={3}
                            justifyContent={"center"}
                            alignItems={"center"}
                            direction={"row"}
                            sx={{ margin: "0 0 15px" }}
                        >
                            <Box sx={{ width: "50%" }}>
                                <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                    Thời gian dự định (ngày)
                                </Typography>
                                <Typography>
                                    <TextField
                                        required
                                        fullWidth
                                        id="estimatedTime"
                                        label={"Thời gian dự định"}
                                        name="estimatedTime"
                                        type="number"
                                        placeholder="5"
                                        value={formValue.originalEstimate}
                                        onChange={handleSetFormValue("originalEstimate")}
                                    />
                                </Typography>
                            </Box>
                            <Box sx={{ width: "25%" }}>
                                <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                    Thời gian đã qua
                                </Typography>
                                <Typography>
                                    <TextField
                                        required
                                        fullWidth
                                        id="passedTime"
                                        label={"Thời gian đã qua"}
                                        name="passedTime"
                                        type="number"
                                        placeholder="3"
                                        value={formValue.timeTrackingSpent}
                                        onChange={handleSetFormValue("timeTrackingSpent")}
                                    />
                                </Typography>
                            </Box>
                            <Box sx={{ width: "25%", textAlign: "center" }}>
                                <Typography gutterBottom
                                    sx={{
                                        textAlign: "left"
                                    }}
                                >
                                    Thời gian còn lại
                                </Typography>
                                <Typography>
                                    <TextField
                                        required
                                        fullWidth
                                        id="remainedTime"
                                        label={"Thời gian còn lại"}
                                        name="remainedTime"
                                        type="number"
                                        placeholder="2"
                                        value={formValue.timeTrackingRemaining}
                                        onChange={handleSetFormValue("timeTrackingRemaining")}
                                    />
                                </Typography>
                            </Box>
                        </Stack>
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                Nội dung công việc
                            </Typography>
                            <TextField
                                required
                                fullWidth
                                label="Nội dung"
                                variant="outlined"
                                placeholder="Find bug and fix..."
                                multiline
                                rows={6}
                                defaultValue=""
                                {...register("description")}
                                error={Boolean(errors.description)}
                                helperText={Boolean(errors.description) && errors.description.message}
                                value={formValue.description}
                                onChange={handleSetFormValue("description")}
                            />
                        </Box>
                        <Box sx={{ width: "100%", margin: "0 0 15px", textAlign: "right" }}>
                            <Button
                                variant="outlined"
                                size="large"
                                color='error'
                                sx={{ fontSize: "14px", border: `1px ${red[500]} solid` }}
                            // loading={}
                            // onClick={navigate(PATH.PROJECTMANAGEMENT)}
                            >
                                Huỷ
                            </Button>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ fontSize: "14px", border: `1px ${blue[500]} solid`, marginLeft: 3 }}
                                // type="submit"
                                onClick={handleSubmitButton}
                                loading={isAdding}
                            >
                                Tạo
                            </LoadingButton>
                        </Box>
                    </Box>
                </div>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </div>
    )
}

export default Task