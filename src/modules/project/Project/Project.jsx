import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Card, CardContent, CardHeader, CardMedia, Collapse, Container, Divider, FormControl, MenuItem, Modal, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, InputLabel, Slider, Tooltip } from '@mui/material'
import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectDetail } from '../../../apis/project.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllStatus } from '../../../apis/status.api';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';
import { assignUserTask, getTaskDetail, removeTask, removeUserFromTask, updateDescription, updateEstimate, updatePriority, updateStatus, updateTimeTracking } from '../../../apis/task.api';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { projectListAction } from "../../../redux/slices/project.slice"
import { PATH } from '../../../utils/paths';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskType } from '../../../apis/taskType.api';
import { getAllPriority } from '../../../apis/priority.api';
import MemberList from '../../../components/MemberList'


// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



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
  width: "80vw",
  height: "auto",
  maxHeight: "80vh",
  bgcolor: 'background.paper',
  border: `1px ${blue[500]} solid`,
  boxShadow: 24,
  p: 4,
};


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const Project = () => {
  // dùng useParams lấy id sau dầu : trong URL của details về
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [taskId, setTaskId] = useState("");
  const [memberByProjectId, setMemberByProjectId] = useState("");
  const [searchMemberInput, setSearchMemberInput] = useState("");
  const [searchMemberResult, setSearchMemberResult] = useState("");
  const [memberToAssign, setMemberToAssign] = useState({
    taskId: "",
    userId: "",
  });
  const { currentUser } = useSelector(state => state.user);

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [formUpdatePriority, setFormUpdatePriority] = useState("");
  const [formUpdateStatus, setFormUpdateStatus] = useState("");
  const [formUpdateDescription, setFormUpdateDescription] = useState("");
  const [formUpdateTimeTracking, setFormUpdateTimeTracking] = useState("");
  const [formUpdateEstimate, setFormUpdateEstimate] = useState("");
  const [timeEstimate, setTimeEstimate] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");


  // thư viện Slider từ MUI
  function handleSetTimeEstimate(props) {
    const { children, value } = props;
    setTimeEstimate(value);
    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  function handleSetTimeSpent(props) {
    const { children, value } = props;
    setTimeSpent(value);
    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  function handleSetTimeRemaining(props) {
    const { children, value } = props;
    setTimeRemaining(value);
    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }


  // Hàm để handle modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const handleOpenModalAddUser = () => setOpenModalAddUser(true);
  const handleCloseModalAddUser = () => setOpenModalAddUser(false);
  const [openModalUpdateTask, setOpenModalUpdateTask] = useState(false);
  const handleOpenModalUpdateTask = () => setOpenModalUpdateTask(true);
  const handleCloseModalUpdateTask = () => setOpenModalUpdateTask(false);


  // thư viện SweetAlert
  const MySwal = withReactContent(Swal);


  // hàm getProjectDetail bằng projectId
  const { data: projectDetail, isLoadingProjectDetail, refetch: refetchProjectDetail } = useQuery({
    queryKey: ["projectIdToShow", projectId],
    queryFn: () => getProjectDetail(projectId),
  });


  // Hàm getTaskDetail để lấy dữ liệu task về theo id
  const { data: taskDetail, isLoadingTaskDetail, refetch: refetchTaskDetail } = useQuery({
    queryKey: ["taskId", taskId],
    queryFn: () => getTaskDetail(taskId),
    enabled: !!taskId,
  });


  // Hàm GET taskType
  const { data: taskType, isLoadingTaskType, refetch: refetchTaskType } = useQuery({
    queryKey: ["taskType"],
    queryFn: getTaskType,
  });

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


  // Hàm tìm kiếm searchMemberResult trong foundMember
  let foundMember = [];
  if (projectDetail?.members.length > 0) {
    for (let i in projectDetail.members) {
      foundMember.push(projectDetail.members[i]);
    }
  }
  const handleSetMemberToAssign = () => {
    let memberToAssignId = "";
    let searchName = searchMemberResult.trim()?.toLowerCase();
    for (let i in foundMember) {
      if (foundMember[i].name.toLowerCase().includes(searchName)) {
        memberToAssignId = foundMember[i].userId;
        break;
      }
    }
    setSearchMemberResult("");
    setMemberToAssign({
      ...memberToAssign,
      taskId: taskId,
      userId: memberToAssignId,
    })
  }

  if (searchMemberInput && searchMemberResult) {
    handleSetMemberToAssign();
  }


  // Hàm assignUserTask để thêm vào project
  const { mutate: handleAssignUserTask, isPending: isAssigningUserTask } = useMutation({
    mutationFn: (payload) => assignUserTask(payload),
    onSuccess: () => {
      handleCloseModalAddUser();
      MySwal.fire({
        icon: "success",
        title: "Bạn đã gán thành viên và dự án thành công",
        text: "Bạn muốn thêm thành viên khác?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          handleOpenModalAddUser();
          setSearchMemberResult("");
          refetchProjectDetail();
          queryClient.invalidateQueries({ queryKey: ["projectIdToShow"] });
        }
        else {
          handleCloseModalAddUser();
          setSearchMemberResult("");
          refetchProjectDetail();
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





  // Hàm removeTask xoá task ra khỏi project
  const { mutate: handleRemoveTask, isPending: isRemovingTask } = useMutation({
    mutationFn: (payload) => removeTask(payload),
    onSuccess: () => {
      MySwal.fire({
        icon: "success",
        title: "Bạn đã xoá thành viên ra khỏi công việc thành công",
        text: "Bạn muốn xoá thêm thành viên khác?",
        // showCancelButton: true,
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          refetchTaskDetail();
          queryClient.invalidateQueries({ queryKey: ["projectIdToShow"] });
        }
        else {
          refetchTaskDetail();
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



  // Hàm handleUpdatePriority để update priority
  const { mutate: handleUpdatePriority, isPending: isUpdatingPriority, error: errorUpdatingPriority } = useMutation({
    mutationFn: (payload) => updatePriority(payload),
    onSuccess: () => {
      // refetchProjectDetail();
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: error.content,
        text: "Bạn đã gặp lỗi khi lưu Priority",
        confirmButtonText: "Đồng ý",
      })
    }
  });


  // Hàm handleUpdatePriority để update status
  const { mutate: handleUpdateStatus, isPending: isUpdatingStatus, error: errorUpdatingStatus } = useMutation({
    mutationFn: (payload) => updateStatus(payload),
    onSuccess: () => {
      // refetchProjectDetail();
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: error.content,
        text: "Bạn đã gặp lỗi khi lưu Status",
        confirmButtonText: "Đồng ý",
      })
    }
  });


  // Hàm updateDescription để update description
  const { mutate: handleUpdateDescription, isPending: isUpdatingDescription, error: errorUpdatingDescription } = useMutation({
    mutationFn: (payload) => updateDescription(payload),
    onSuccess: () => {
      // refetchProjectDetail();
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: error.content,
        text: "Bạn đã gặp lỗi khi lưu Description",
        confirmButtonText: "Đồng ý",
      })
    }
  });


  // Hàm updateTimeTracking để update TimeTracking
  const { mutate: handleUpdateTimeTracking, isPending: isUpdatingTimeTracking, error: errorUpdatingTimeTracking } = useMutation({
    mutationFn: (payload) => updateTimeTracking(payload),
    onSuccess: () => {
      // refetchProjectDetail();
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: error.content,
        text: "Bạn đã gặp lỗi khi lưu TimeTracking",
        confirmButtonText: "Đồng ý",
      })
    }
  });


  // Hàm updateTimeTracking để update Estimate
  const { mutate: handleUpdateEstimate, isPending: isUpdatingEstimate, error: errorUpdatingEstimate } = useMutation({
    mutationFn: (payload) => updateEstimate(payload),
    onSuccess: () => {
      // refetchProjectDetail();
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: error.content,
        text: "Bạn đã gặp lỗi khi lưu Estimate",
        confirmButtonText: "Đồng ý",
      })
    }
  });


  // Hàm để truyền dữ liệu Project muống edit lên store Redux và chuyển hướng qua trang CreateProject
  const handleTaskIdToEdit = (value) => {
    if (value) {
      dispatch(projectListAction.setProjectIdToEdit(projectId));
      dispatch(projectListAction.setTaskIdToEdit(value));
    }
    navigate(PATH.CREATETASK);
  }




  // Hàm set taskID để remove ra khỏi project
  const handleTaskIdToRemove = (value) => {
    MySwal.fire({
      icon: "question",
      title: "Bạn có chắc muốn xoá công việc này?",
      text: "Xoá xong tạo lại thì cũng đơn giản lắm nha, xoá thoải mái!",
      showCancelButton: true,
      confirmButtonText: "Đồng ý"
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveTask(value);
      }
      else {
        // do nothing
      }
    })
  }


  // Hàm set handleSetPriorityId để set formUpdatePriority
  const handleSetPriorityId = (value) => {
    setFormUpdatePriority({
      ...formUpdatePriority,
      taskId: taskId,
      priorityId: value,
    })
  }


  // Hàm set handleSetPriorityId để set formUpdatePriority
  const handleSetStatusId = (value) => {
    setFormUpdateStatus({
      ...formUpdateStatus,
      taskId: taskId,
      statusId: value,
    })
  }


  // Hàm set handleSetDescription để set formUpdateDescription
  const handleSetDescription = (value) => event => {
    setFormUpdateDescription({
      ...formUpdateDescription,
      taskId: taskId,
      description: event.target.value,
    })
  }



  // Hàm set handleUpdateTask để set Update tất cả những thứ đã thay đổi
  const handleUpdateTask = () => {
    handleCloseModalUpdateTask();
    MySwal.fire({
      icon: "question",
      title: "Bạn có chắc muốn sửa công việc này?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý"
    }).then((result) => {
      if (result.isConfirmed) {
        if (formUpdatePriority !== "") {
          handleUpdatePriority(formUpdatePriority);
        }
        if (formUpdateStatus !== "") {
          handleUpdateStatus(formUpdateStatus);
        }
        if (formUpdateDescription !== "" && (formUpdateDescription !== taskDetail.description)) {
          handleUpdateDescription(formUpdateDescription);
        }
        if (timeEstimate && (timeEstimate !== taskDetail.originalEstimate)) {
          handleUpdateEstimate({
            ...formUpdateEstimate,
            taskId: taskId,
            originalEstimate: timeEstimate,
          });
        }
        if ((timeRemaining && (timeRemaining !== taskDetail.timeTrackingRemaining)) || (timeSpent && (timeSpent !== taskDetail.timeTrackingSpent))) {
          handleUpdateTimeTracking({
            ...formUpdateTimeTracking,
            taskId: taskId,
            timeTrackingSpent: timeSpent,
            timeTrackingRemaining: timeRemaining,
          });
        }

        if (!errorUpdatingPriority && !errorUpdatingStatus && !errorUpdatingTimeTracking && !errorUpdatingDescription && !errorUpdatingEstimate) {
          MySwal.fire({
            icon: "success",
            title: "Bạn đã lưu công việc thành công",
            confirmButtonText: "Đồng ý"
          }).then((result) => {
            if (result.isConfirmed) {
              refetchProjectDetail();
            }
          })
        }
        else {
          console.log("Lỗi rồi");
        }
      }
      else {
        // do nothing
      }
    })
  }


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
            {projectDetail?.projectName}
          </Typography>
          <Button
            variant="contained"
            size="small"
            title="Thêm công việc"
            sx={{
              height: 40,
            }}
            onClick={() => {
              dispatch(projectListAction.setProjectIdToEdit(projectId));
              navigate(PATH.CREATETASK);
            }}
          >
            Thêm công việc
          </Button>
        </Box>
        <div style={{ height: "90%", width: '100%' }}>
          <Stack
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"row"}
            sx={{ margin: "0 0 15px" }}
          >
            {
              projectDetail ? (
                projectDetail.lstTask?.map((task, index) => (
                  <Box sx={{ width: "25%", height: "85vh" }} key={index}>
                    <Card sx={{ height: "85vh", border: `1px ${blue[200]} solid`, margin: "5px 5px", p: "5px" }}>
                      <CardHeader
                        sx={{ p: "2px", height: "10%" }}
                        avatar={
                          <Avatar sx={{ bgcolor: blue[500], height: 30, width: 30, fontSize: "24px" }} aria-label="recipe">
                            {task.statusId}
                          </Avatar>
                        }
                        action={
                          <>
                            <IconButton aria-label="settings" title="More Options">
                              <MoreVertIcon />
                            </IconButton>
                          </>
                        }
                        subheader={task.statusName}
                      >
                      </CardHeader>

                      <CardContent
                        sx={{ p: "0px", height: "90%" }}
                      >
                        {
                          task.lstTaskDeTail ? (
                            task.lstTaskDeTail.map((taskDetail, index) => (
                              <Card sx={{ height: "auto", fontSize: "12px", mb: "10px" }}>
                                <Stack direction={"column"}>
                                  <Stack direction={"row"}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: "space-between",
                                      alignItems: 'center',
                                      border: '1px solid',
                                      borderBottom: "none",
                                      borderColor: 'divider',
                                      borderRadius: 0,
                                      bgcolor: 'background.paper',
                                      color: 'text.secondary',
                                      '& svg': {
                                        m: 1,
                                      },
                                      padding: "5px",
                                    }}>
                                    <Typography sx={{ width: '65%', flexShrink: 0, fontSize: 12, width: "50%", cursor: "pointer" }}
                                      onClick={() => {
                                        setTaskId(taskDetail.taskId);
                                        handleOpenModalUpdateTask();
                                      }}
                                    >
                                      {taskDetail.taskName}
                                    </Typography>
                                    <Box sx={{ width: '35%' }}>
                                      <IconButton
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        title="Sửa công việc"
                                        margin={4}
                                        style={{ width: "30px", height: "30px", border: `1px ${green[500]} solid`, borderRadius: "30px", marginRight: "5px" }}
                                        onClick={() => {
                                          handleTaskIdToEdit(taskDetail.taskId);
                                        }}
                                      >
                                        <EditIcon sx={{ fontSize: 18 }} />
                                      </IconButton>
                                      <IconButton
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        title="Xoá công việc"
                                        style={{ width: "30px", height: "30px", border: `1px ${red[500]} solid`, borderRadius: "30px" }}
                                        onClick={() => {
                                          handleTaskIdToRemove(taskDetail.taskId);
                                        }}
                                      >
                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Box>
                                  </Stack>
                                  <Accordion expanded={expanded === taskDetail.taskId}
                                    onChange={
                                      handleChange(taskDetail.taskId)
                                    }
                                    sx={{
                                      alignItems: 'center',
                                      border: '1px solid',
                                      borderBottom: "none",
                                      borderColor: 'divider',
                                      borderRadius: 0,
                                      bgcolor: 'background.paper',
                                    }}
                                  >
                                    <AccordionSummary
                                      aria-controls="panel1bh-content"
                                      id="panel1bh-header"
                                      sx={{
                                        padding: "0px",
                                        margin: "0px",
                                        border: "0px",
                                      }}
                                    >
                                      <IconButton
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        title="Sửa công việc"
                                        onClick={() => {
                                          // handleChange(taskDetail.taskId);
                                        }}
                                      >
                                        <ExpandMoreIcon />
                                      </IconButton>
                                    </AccordionSummary>
                                    {/* <Divider width="100%" /> */}
                                    <AccordionDetails>
                                      {/* <CardContent sx={{ height: "65%", p: "10px" }}> */}
                                      <Typography sx={{ fontSize: 14, mb: "2px" }} >
                                        <CategoryIcon sx={{ fontSize: 14 }} />
                                        Chủ đề: {taskDetail.taskName}
                                      </Typography>
                                      <Typography sx={{ fontSize: 14, mb: "2px" }} >
                                        <CategoryIcon sx={{ fontSize: 14 }} />
                                        Phân loại: {taskDetail.taskTypeDetail.taskType}
                                      </Typography>
                                      <Typography sx={{ fontSize: 14, mb: "2px" }} >
                                        <LibraryBooksIcon sx={{ fontSize: 14 }} />
                                        Nội dung: {taskDetail.description}
                                      </Typography>
                                      <Typography sx={{ fontSize: 14, mb: "2px" }} >
                                        <PriorityHighIcon sx={{ fontSize: 14 }} />
                                        Độ ưu tiên: {taskDetail.priorityTask.priority}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: 14, mb: "2px" }}
                                      >
                                        <EmojiPeopleIcon sx={{ fontSize: 14 }} />
                                        Thành viên:
                                      </Typography>
                                      {
                                        taskDetail.assigness.length > 0 ? (
                                          taskDetail.assigness.map((member, index) => {
                                            return (
                                              <IconButton
                                                key={index}
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                title={member.name}
                                                onClick={() => {
                                                  handleOpen();
                                                  setTaskId(taskDetail.taskId);
                                                  // handleSetRemoveUserTask(taskDetail.taskId);
                                                }}
                                              >
                                                <img src={member.avatar} alt={member.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                                              </IconButton>
                                            )
                                          })
                                        ) : (
                                          <Typography color={"red"} sx={{ fontSize: 14, mb: "2px" }}>
                                            Chưa có
                                          </Typography>
                                        )
                                      }
                                      <IconButton
                                        size="small"
                                        title="Thêm thành viên"
                                        style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }}
                                        onClick={() => {
                                          setTaskId(taskDetail.taskId);
                                          handleOpenModalAddUser();
                                        }}
                                      >
                                        <AddBoxIcon />
                                      </IconButton>
                                    </AccordionDetails>
                                  </Accordion>
                                </Stack>
                              </Card>
                            ))
                          ) : (
                            <Typography {...typographySettings} color={"error"}>
                              Chưa có
                            </Typography>
                          )
                        }
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography {...typographySettings} color={"error"}>
                  Đang load...
                </Typography>
              )
            }
          </Stack>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-list-member"
            aria-describedby="modal-list-member-description"
          >
            <MemberList data={taskDetail} />
          </Modal>
          <Modal
            open={openModalAddUser}
            onClose={handleCloseModalAddUser}
            aria-labelledby="modal-add-member"
            aria-describedby="modal-add-member-description"
          >
            <Box sx={style}>
              <Typography id="modal-add-member" variant="h5" color={`${blue[500]}`} gutterBottom>
                Tìm kiếm và thêm thành viên
              </Typography>
              <Typography id="modal-add-member-description" gutterBottom>
                {
                  foundMember ? (
                    <Stack spacing={2} sx={{ width: "100%", margin: "20px 0" }}>
                      <Autocomplete
                        freeSolo
                        id="free-solo-2-demo"
                        disableClearable
                        options={foundMember.map((member) => member.name)}
                        onChange={(event, newValue) => {
                          setSearchMemberResult(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setSearchMemberInput(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tìm kiếm thành viên"
                            InputProps={{
                              ...params.InputProps,
                              type: 'search',
                            }}
                          />
                        )}
                      />
                    </Stack>
                  ) : (
                    <Typography {...typographySettings} color={"error"} sx={{ margin: "20px 0" }}>
                      Không tìm được thành viên
                    </Typography>
                  )
                }
                {
                  memberToAssign ? (
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      size="large"
                      title="Thêm thành viên"
                      sx={{ fontSize: "14px", border: `1px ${blue[500]} solid` }}
                      type="submit"
                      loading={isAssigningUserTask}
                      onClick={() => {
                        handleAssignUserTask(memberToAssign);
                      }}
                    >
                      Thêm
                    </LoadingButton>
                  ) : (
                    <></>
                  )
                }
              </Typography>
            </Box>
          </Modal>
          <Modal
            open={openModalUpdateTask}
            onClose={handleCloseModalUpdateTask}
            aria-labelledby="modal-add-member"
            aria-describedby="modal-add-member-description"
          >
            <Box sx={style}>
              <Stack
                direction={"row"}
                sx={{
                  display: 'flex',
                  justifyContent: "space-around",
                  alignItems: 'center',
                  border: '1px solid',
                  borderBottom: "none",
                  borderColor: 'divider',
                  borderRadius: 0,
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  '& svg': {
                    m: 1,
                  },
                  padding: "5px",
                }}
              >
                <Box sx={{ width: "45%", padding: "10px" }}>
                  <Typography
                    variant='h5'
                    sx={{
                      mb: "20px",
                    }}
                  >
                    {taskDetail?.taskName}
                  </Typography>
                  <Typography
                    {...typographySettings}
                    sx={{
                      mb: "10px",
                    }}
                  >
                    Nội dung:
                  </Typography>
                  <TextField
                    fullWidth
                    label={"Miêu tả"}
                    variant="outlined"
                    placeholder="Find bug and fix..."
                    style={{ marginBottom: 10 }}
                    multiline
                    rows={2}
                    defaultValue={taskDetail?.description}
                    onChange={handleSetDescription("description")}
                  />
                  {
                    currentUser ? (
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        title={currentUser.name}
                        onClick={() => {
                          handleOpen();
                        }}
                        sx={{
                          mb: "5px",
                        }}
                      >
                        <img src={currentUser.avatar} alt={currentUser.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                      </IconButton>
                    ) : (
                      <Typography {...typographySettings} color={"error"}>
                        Bạn chưa login!
                      </Typography>
                    )
                  }
                  <TextField
                    fullWidth
                    label={"Comment..."}
                    variant="outlined"
                    placeholder="Find bug and fix..."
                    style={{ marginBottom: 10 }}
                    multiline
                    rows={1}
                  // defaultValue={}
                  // onChange={}
                  />
                </Box>
                <Box sx={{ width: "55%", padding: "10px" }}>
                  <Box sx={{ mb: 2 }}>
                    <Stack
                      spacing={1}
                      justifyContent={"center"}
                      alignItems={"center"}
                      direction={"row"}
                      sx={{ margin: "0 0 15px" }}
                    >
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography
                          sx={{ fontSize: 14 }}
                        >
                          Dự án
                        </Typography>
                        <FormControl fullWidth >
                          {/* <InputLabel id="demo-simple-select-label" >Chọn dự án</InputLabel> */}
                          {
                            taskDetail?.statusId ? (
                              <FormControl fullWidth
                                sx={{ mb: 2 }}
                              >
                                <Select
                                  required
                                  id="statusId"
                                  // label={"Chọn dự án"}
                                  defaultValue={taskDetail.statusId}
                                >
                                  {
                                    allStatus?.length > 0 ?
                                      (
                                        allStatus.map((status, index) => {
                                          return (
                                            <MenuItem key={index} value={status.statusId}
                                              onClick={() => { handleSetStatusId(status.statusId) }}
                                            >
                                              {status.statusName}
                                            </MenuItem>
                                          )
                                        })
                                      ) : (
                                        <MenuItem >
                                          ...
                                        </MenuItem>
                                      )
                                  }
                                </Select>
                              </FormControl>
                            ) : (
                              <Typography color={"red"} sx={{ fontSize: 14, mb: "2px" }}>
                                Đang tải...
                              </Typography>
                            )
                          }
                        </FormControl>
                      </Box>
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography
                          sx={{ fontSize: 14, mb: "2px" }}
                        >
                          Ưu tiên
                        </Typography>
                        {
                          taskDetail?.priorityTask ? (
                            <FormControl fullWidth
                              sx={{ mb: 2 }}
                            >
                              <Select
                                required
                                id="priorityId"
                                // label={"Chọn ưu tiên"}
                                defaultValue={taskDetail.priorityTask.priorityId}
                              >
                                {
                                  allPriority?.length > 0 ?
                                    (
                                      allPriority.map((priority, index) => {
                                        return (
                                          <MenuItem key={index} value={priority.priorityId}
                                            onClick={() => { handleSetPriorityId(priority.priorityId) }}
                                          >
                                            {priority.priority}
                                          </MenuItem>
                                        )
                                      })
                                    ) : (
                                      <MenuItem >
                                        ...
                                      </MenuItem>
                                    )
                                }
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography color={"red"} sx={{ fontSize: 14, mb: "2px" }}>
                              Đang tải...
                            </Typography>
                          )
                        }
                      </Box>
                    </Stack>
                    <Stack
                      spacing={1}
                      justifyContent={"center"}
                      alignItems={"center"}
                      direction={"row"}
                      sx={{ margin: "0 0 15px" }}
                    >
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography
                          sx={{ fontSize: 14, mb: "0px" }}
                        >
                          Thành viên:
                        </Typography>
                        {
                          taskDetail?.assigness.length > 0 ? (
                            taskDetail.assigness.map((member, index) => {
                              return (
                                <IconButton
                                  key={index}
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  title={member.name}
                                  onClick={() => {
                                    handleOpen();
                                    setTaskId(taskDetail.taskId);
                                  }}
                                >
                                  <img src={member.avatar} alt={member.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                                </IconButton>
                              )
                            })
                          ) : (
                            <Typography color={"red"} sx={{ fontSize: 14, mb: "2px" }}>
                              Đang tải...
                            </Typography>
                          )
                        }
                      </Box>
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography gutterBottom
                          sx={{
                            textAlign: "left"
                          }}
                        >Thời gian dự định (ngày)</Typography>
                        <Slider
                          valueLabelDisplay="auto"
                          slots={{
                            valueLabel: handleSetTimeEstimate,
                          }}
                          aria-label="custom thumb label"
                          defaultValue={taskDetail?.originalEstimate}
                          sx={{
                            width: "90%",
                            color: 'success.main',
                            textAlign: "center"
                          }}
                        ></Slider>
                      </Box>
                    </Stack>
                    <Stack
                      spacing={1}
                      justifyContent={"center"}
                      alignItems={"center"}
                      direction={"row"}
                      sx={{ margin: "0 0 15px" }}
                    >
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography gutterBottom
                          sx={{
                            textAlign: "left"
                          }}
                        >Thời gian còn lại (ngày)</Typography>
                        <Slider
                          valueLabelDisplay="auto"
                          slots={{
                            valueLabel: handleSetTimeRemaining,
                          }}
                          aria-label="custom thumb label"
                          defaultValue={taskDetail?.timeTrackingRemaining
                          }
                          sx={{
                            width: "90%",
                            color: 'success.main',
                            textAlign: "center"
                          }}
                        ></Slider>
                      </Box>
                      <Box sx={{ mb: 2, width: "50%" }}>
                        <Typography gutterBottom
                          sx={{
                            textAlign: "left"
                          }}
                        >Thời gian đã qua (ngày)</Typography>
                        <Slider
                          valueLabelDisplay="auto"
                          slots={{
                            valueLabel: handleSetTimeSpent,
                          }}
                          aria-label="custom thumb label"
                          defaultValue={taskDetail?.timeTrackingSpent
                          }
                          sx={{
                            width: "90%",
                            color: 'success.main',
                            textAlign: "center"
                          }}
                        ></Slider>
                      </Box>
                    </Stack>
                    <Box sx={{ width: "100%", margin: "0 0 15px", textAlign: "right" }}>
                      <Button
                        variant="outlined"
                        size="large"
                        color='error'
                        sx={{ fontSize: "14px", border: `1px ${red[500]} solid` }}
                        // loading={}
                        onClick={() => {
                          handleCloseModalUpdateTask()
                        }}
                      >
                        Huỷ
                      </Button>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ fontSize: "14px", border: `1px ${blue[500]} solid`, marginLeft: 3 }}
                        loading={isUpdatingPriority}
                        onClick={() => {
                          handleUpdateTask()
                        }}
                      >
                        Lưu
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Modal>
        </div>
      </Container >
    </div >
  )
}

export default Project