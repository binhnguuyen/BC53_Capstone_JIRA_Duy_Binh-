import React from 'react'
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Divider, Stack, Typography } from '@mui/material'
import Copyright from "../../../components/Copyright";
import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { useParams } from 'react-router-dom';
import { getProjectDetail } from '../../../apis/project.api';
import { useQuery } from '@tanstack/react-query';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CategoryIcon from '@mui/icons-material/Category';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';

// CSS
const typographySettings = {
  style: {
    fontSize: 16,
    fontWeight: 500,
  }
}


const Project = () => {
  // dùng useParams lấy id sau dầu : trong URL của details về
  const { projectId } = useParams();
  console.log('projectId: ', projectId);


  // hàm getProjectDetail bằng projectId
  const { data: projectDetail, isLoading, isError, error } = useQuery({
    queryKey: ["projectIdToEdit", projectId],
    queryFn: () => getProjectDetail(projectId),
    // chỉ kích hoạt nếu có dữ liệu trong projectIdToEdit (lấy từ store của Redux về do Home đưa lên)
    // enabled: !!projectId,
  });
  console.log('projectDetail: ', projectDetail);



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
            Bảng quản lý dự án
          </Typography>
        </Box>
        <div style={{ height: "90vh", width: '100%' }}>
          <Stack
            spacing={3}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"row"}
            sx={{ margin: "0 0 15px" }}
          >
            {
              projectDetail ? (
                projectDetail.lstTask?.map((task, index) => (
                  <Box sx={{ width: "25%" }} key={index}>
                    <Card sx={{ height: "80vh", border: `1px ${blue[200]} solid`, margin: "5px 5px", p: "5px" }}>
                      <CardHeader
                        sx={{ p: "2px", height: "10%" }}
                        avatar={
                          <Avatar sx={{ bgcolor: blue[500], height: 30, width: 30, fontSize: "24px" }} aria-label="recipe">
                            {task.statusId}
                          </Avatar>
                        }
                        action={
                          <Box>
                            <IconButton
                              variant="contained"
                              color="error"
                              size="small"
                              title="Sửa công việc"
                              onClick={() => {
                                // handleProjectIdToEdit(params.row.id);
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton
                              variant="contained"
                              color="primary"
                              size="small"
                              title="Xoá công việc"
                              onClick={() => {
                                MySwal.fire({
                                  icon: "question",
                                  title: "Bạn có chắc muốn xoá dự án này?",
                                  text: "Xoá xong tạo lại thì cũng đơn giản lắm nha, xoá thoải mái!",
                                  showCancelButton: true,
                                  confirmButtonText: "Đồng ý"
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    // handleDeleteProject(params.row.id);
                                  }
                                  else {
                                    // do nothing
                                  }
                                })
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        }
                        title={task.statusName
                        }
                      >

                      </CardHeader>

                      <Divider width="100%" />
                      <CardContent
                        sx={{ p: "0px", height: "90%" }}
                      >
                        {
                          task.lstTaskDeTail ? (
                            task.lstTaskDeTail.map((taskDetail, index) => (
                              <Card sx={{ height: "50%", fontSize: "12px", mb: "10px" }}>
                                <CardHeader
                                  sx={{ height: "35%", p: "10px" }}
                                  action={
                                    <IconButton aria-label="settings">
                                      <MoreVertIcon />
                                    </IconButton>
                                  }
                                  title={`ID: ${taskDetail.taskId
                                    }`}
                                  subheader={
                                    `
                                    Name: ${taskDetail.taskName}
                                    `
                                  }
                                >
                                </CardHeader>
                                <Divider width="100%" />
                                <CardContent sx={{ height: "65%", p: "10px" }}>
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
                                              // handleOpen();
                                              // handleSetProjectId(params.row.id);
                                            }}
                                          >
                                            <img src={member.avatar} alt={member.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                                            {/* #{item.name}&cedil; */}
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
                                    style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`}}
                                    onClick={() => {
                                      // handleOpenModalAddUser();
                                      // handleSetProjectId(params.row.id);
                                    }}
                                  >
                                    <AddBoxIcon />
                                  </IconButton>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Typography {...typographySettings} color={"error"}>
                              Chưa có công việc
                            </Typography>
                          )
                        }
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography {...typographySettings} color={"error"}>
                  Không tải được thành viên
                </Typography>
              )
            }
          </Stack>
        </div>
        <Copyright sx={{ mt: 5 }} />
      </Container >
    </div >
  )
}

export default Project