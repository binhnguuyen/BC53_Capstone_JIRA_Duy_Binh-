import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Container, Slider, Stack, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { orange } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Tooltip from '@mui/material/Tooltip';

// API
import { getAllProject } from '../../apis/project.api';
import { getAllStatus } from '../../apis/status.api';
import { getTaskType } from '../../apis/taskType.api';
import { getAllPriority } from '../../apis/priority.api';
import { createTask, getTaskDetail, updateTask } from '../../apis/task.api';

// Thư viện Yup giúp mình validate Hook Form
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getUser, getUserByProjectId } from '../../apis/user.api';
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
    const queryClient = useQueryClient();
    let { taskIdToEdit, projectList, projectIdToEdit } = useSelector(state => state.project);
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

    // Xử lý formValueToEdit (raw data lấy từ form)
    const [formValueToEdit, setFormValueToEdit] = useState({
        taskId: "",
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


    // hàm getProjectDetail bằng projectId
    const { data: taskDetailToEdit, isLoadingTaskDetail, refetch: refetchTaskDetail } = useQuery({
        queryKey: ["taskIdToShow", taskIdToEdit],
        queryFn: () => getTaskDetail(taskIdToEdit),
    });

    // hàm getUserById để lấy dữ liệu user theo Project về
    const { data: memberById, isLoading: searchingMember } = useQuery({
        queryKey: ["userByProjectId", projectIdToEdit],
        queryFn: () => getUserByProjectId(projectIdToEdit),
        enabled: !!projectIdToEdit,
    });



    // hàm handleCreateTask để tạo task mới
    const { mutate: handleCreateTask, isPending: isAdding } = useMutation({
        mutationFn: (payload) => createTask(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã tạo công việc thành công",
                text: "Bạn có muốn tiếp tục?",
                showCancelButton: true,
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: ["createTask"] });
                    setFormValue({
                        ...formValue,
                        listUserAsign: [],
                        taskName: "",
                        description: "",
                        statusId: "",
                        originalEstimate: 0,
                        timeTrackingSpent: 0,
                        timeTrackingRemaining: 0,
                        // projectId: 0,
                        typeId: 0,
                        priorityId: 0,
                    });
                }
                else {
                    navigate(`${PATH.PROJECT}/${projectId}`);
                }
            })
        },
        onError: (error) => {
            MySwal.fire({
                icon: "error",
                title: error.content,
                text: "Bạn đã gặp lỗi",
                // showCancelButton: true,
                confirmButtonText: "Đồng ý",
                // denyButtonText: "Không chấp nhận"
            })
        }
    });


    // hàm handleCreateTask để tạo task mới
    const { mutate: handleEditTask, isPending: isEditing } = useMutation({
        mutationFn: (payload) => updateTask(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã tạo sửa án thành công",
                text: "Quay lại trang quản lý dự án",
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    queryClient.invalidateQueries({ queryKey: ["editTask"] });
                    navigate(`${PATH.PROJECT}/${projectId}`);
                    setFormValue({
                        taskId: 0,
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
            MySwal.fire({
                icon: "error",
                title: error.content,
                text: "Bạn đã gặp lỗi",
                // showCancelButton: true,
                confirmButtonText: "Đồng ý",
                // denyButtonText: "Không chấp nhận"
            })
        }
    });


    // Hảm xửa lý nút form
    const handleSetFormValue = (value) => event => {
        // set Form để createTask
        setFormValue({
            ...formValue,
            [value]: event.target.value,
        })
        setFormValueToEdit({
            ...formValueToEdit,
            [value]: event.target.value,
            taskId: taskDetailToEdit.taskId,
            projectId: taskDetailToEdit.projectId,
        })
    }


    // Hảm xửa lý nút SubmitButton
    const handleSubmitButton = () => {
        // Hàm xử lý các giá trị của phần tử trong formValue
        if (searchStatusResult.trim() && allStatus.length > 0) {
            allStatus.filter((item) => {
                if (item.statusName
                    .toLowerCase().trim().includes(searchStatusResult.toLowerCase().trim())) {
                    formValue.statusId = item.statusId;
                    formValueToEdit.statusId = item.statusId;
                }
            })
        }
        if (searchPriorityResult.trim() && allPriority.length > 0) {
            allPriority.filter((item) => {
                if (item.priority
                    .toLowerCase().trim().includes(searchPriorityResult.toLowerCase().trim())) {
                    formValue.priorityId = item.priorityId;
                    formValueToEdit.priorityId = item.priorityId;
                }
            })
        }
        if (searchTaskTypeResult.trim() && taskType.length > 0) {
            taskType.filter((item) => {
                if (item.taskType.toLowerCase().trim().includes(searchTaskTypeResult.toLowerCase().trim())) {
                    formValue.typeId = item.id;
                    formValueToEdit.typeId = item.id;
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
            for (let i in memberById) {
                for (let j in searchMemberResult) {
                    if (memberById[i].name.toLowerCase().trim().includes(searchMemberResult[j]
                        .toLowerCase().trim())) {
                        formValue.listUserAsign.push(memberById[i].userId);
                        formValueToEdit.listUserAsign.push(memberById[i].userId);
                    }
                }
            }
        }
        if (formValue.originalEstimate) {
            formValue.originalEstimate = parseInt(formValue.originalEstimate);
            formValueToEdit.originalEstimate = parseInt(formValue.originalEstimate);
        }
        if (formValue.timeTrackingSpent) {
            formValue.timeTrackingSpent = parseInt(formValue.timeTrackingSpent);
            formValueToEdit.timeTrackingSpent = parseInt(formValue.timeTrackingSpent);
        }
        if (formValue.timeTrackingRemaining) {
            formValue.timeTrackingRemaining = parseInt(formValue.timeTrackingRemaining);
            formValueToEdit.timeTrackingRemaining = parseInt(formValue.timeTrackingRemaining);
        }


        if (taskDetailToEdit === undefined) {
            // Xử lý thêm Task
            if (
                formValue.projectId !== 0 &&
                formValue.statusId !== "" &&
                formValue.priorityId !== 0 &&
                formValue.typeId !== 0 &&
                formValue.description !== ""
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
            else {
                alert("Lỗi Form");
            }
        }
        else {
            // Xử lý sửa Task
            if (
                formValueToEdit.taskId !== 0 &&
                formValueToEdit.projectId !== 0 &&
                formValueToEdit.statusId !== "" &&
                formValueToEdit.typeId !== 0 &&
                formValueToEdit.priorityId !== 0 &&
                formValueToEdit.taskName !== "" &&
                formValueToEdit.description !== ""
            ) {
                MySwal.fire({
                    icon: "question",
                    title: "Bạn có chắc muốn sửa công việc này không?",
                    text: "Sửa một phát sửa mệt lắm nha, ko giỡn!",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý"
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleEditTask(formValueToEdit);
                    }
                    else {
                        // do nothing
                    }
                })
            }
            else {
                alert("Lỗi Form");
            }
        }
    }


    const onSubmit = () => {
        console.log("Submit thành công");
    };


    const onError = (error) => {
        alert(error);
    };


    // khi ấn sửa thì taskDetailToEdit đc hình thành, hàm setFormValue chạy và formValue có giá trị. Giá trị này đc gán vào value={} trong TextField hoặc Select bên dưới
    useEffect(() => {
        if (taskDetailToEdit) {
            setFormValueToEdit({
                ...formValueToEdit,
                taskId: taskDetailToEdit.taskId,
                projectId: taskDetailToEdit.projectId,
                listUserAsign: taskDetailToEdit.assigness,
                taskName: taskDetailToEdit.taskName,
                description: taskDetailToEdit.description,
                statusId: taskDetailToEdit.statusId,
                originalEstimate: taskDetailToEdit.originalEstimate,
                timeTrackingSpent: taskDetailToEdit.timeTrackingSpent,
                timeTrackingRemaining: taskDetailToEdit.timeTrackingRemaining,
                typeId: taskDetailToEdit.typeId,
                priorityId: taskDetailToEdit.priorityId,
            });
        }
    }, [taskDetailToEdit])


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
                        {
                            taskDetailToEdit === undefined ? (
                                <></>
                            ) : (
                                <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                                    <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="taskId"
                                            label={"Task ID"}
                                            name="taskId"
                                            type="text"
                                            placeholder="Fix Bug"
                                            // {...register("taskId")}
                                            // error={Boolean(errors.taskId)}
                                            // helperText={Boolean(errors.taskId) && errors.taskId.message}
                                            disabled
                                            value={taskDetailToEdit.taskId}
                                        >
                                            {taskDetailToEdit.taskId}
                                        </TextField>
                                    </Typography>
                                </Box>
                            )
                        }
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            {
                                taskDetailToEdit === undefined ? (
                                    <Box  {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                        <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                            Chọn dự án
                                        </Typography>
                                        <Typography >
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
                                ) : (
                                    <Typography {...typographySettings} sx={{ margin: "0 0 5px" }}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="projectId"
                                            label={"Project ID"}
                                            name="projectId"
                                            type="text"
                                            placeholder="Fix Bug"
                                            // {...register("taskId")}
                                            // error={Boolean(errors.taskId)}
                                            // helperText={Boolean(errors.taskId) && errors.taskId.message}
                                            disabled
                                            value={taskDetailToEdit.projectId
                                            }
                                        >
                                            {taskDetailToEdit.projectId}
                                        </TextField>
                                    </Typography>

                                )
                            }
                        </Box>
                        <Box sx={{ width: "100%", margin: "0 0 15px" }}>
                            {
                                taskDetailToEdit === undefined ? (
                                    <Box {...typographySettings} sx={{ margin: "0 0 5px" }}>
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
                                ) : (
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
                                        value={formValueToEdit?.taskName}
                                        onChange={handleSetFormValue("taskName")}
                                    />
                                )
                            }
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
                                        memberById ? (
                                            <Stack spacing={2}>
                                                <Autocomplete
                                                    multiple
                                                    id="free-solo-2-demo"
                                                    disableClearable
                                                    options={memberById.map((user) => user.name)}
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
                            {
                                taskDetailToEdit === undefined ? (
                                    <Box {...typographySettings} sx={{ margin: "0 0 5px" }}>
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
                                ) : (
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
                                        value={formValueToEdit?.description}
                                        onChange={handleSetFormValue("description")}
                                    />
                                )
                            }
                        </Box>
                        <Box sx={{ width: "100%", margin: "0 0 15px", textAlign: "right" }}>
                            {
                                taskDetailToEdit === undefined ? (
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            color='error'
                                            sx={{ fontSize: "14px", border: `1px ${red[500]} solid` }}
                                            // loading={}
                                            onClick={() => {
                                                navigate(`${PATH.PROJECT}/${projectId}`)
                                            }}
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
                                ) : (
                                    <LoadingButton
                                        variant="contained"
                                        color="success"
                                        size="large"
                                        sx={{ fontSize: "14px", border: `1px ${green[500]} solid`, marginLeft: 3 }}
                                        // type="submit"
                                        onClick={handleSubmitButton}
                                        loading={isEditing}
                                    >
                                        Sửa
                                    </LoadingButton>
                                )
                            }
                        </Box>
                    </Box>
                </div>
            </Container >
        </div >
    )
}

export default Task