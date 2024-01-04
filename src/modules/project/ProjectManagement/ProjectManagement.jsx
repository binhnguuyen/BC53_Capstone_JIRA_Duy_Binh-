import { Box, Button, Container, IconButton, Typography, Modal } from '@mui/material'
import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { blue } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProject, getAllProject } from '../../../apis/project.api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import { PATH } from '../../../utils/paths';
import { useNavigate } from 'react-router-dom';
import { projectListAction } from "../../../redux/slices/project.slice"

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const ProjectManagement = () => {
  let { projectList } = useSelector((state) => state.project);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: `1px ${blue[500]} solid`,
    boxShadow: 24,
    p: 4,
  };


  // Hàm để handle modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // hàm render nút Delete
  const renderDeleteButton = (params) => {
    return (
      <strong>
        <IconButton
          variant="contained"
          color="error"
          size="small"
          sx={{
            border: `1px ${green[500]} solid`
          }}
          onClick={() => {
            handleProjectIdToEdit(params.row.id);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          sx={{
            border: `1px ${red[500]} solid`,
            marginLeft: "10px",
          }}
          onClick={() => {
            handleDeleteProject(params.row.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </strong>
    )
  }


  // hàm render nút Add Creator
  const renderAddCreatorButton = (params) => {
    return (
      <strong>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ fontSize: "12px", border: `1px ${blue[500]} solid` }}
          onClick={() => {
            // parseName(params.row.col6)
          }}
        >
          #{params.row.creator.name}&cedil;
        </Button>
      </strong >
    )
  }


  // hàm render nút Add member
  const renderAddMemberButton = (params) => {
    return (
      <strong>
        {
          // có 3 thành viên trở lại thì render hết
          params.row.members.length <= 3 ? (
            params.row.members.map((item, index) => {
              return (
                <IconButton
                  key={index}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => {
                    // parseName(params.row.col6)
                  }}
                >
                  <img src={item.avatar} alt={item.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }} />
                  {/* #{item.name}&cedil; */}
                </IconButton>
              )
            })
          ) : (
            // có 4 thành viên trở lên thì render 3 người đầu tiên
            <>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  // parseName(params.row.col6)
                }}
              >
                <img src={params.row.members[0].avatar} alt={params.row.members[0].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }} />
                {/* #{params.row.members[0].name}&cedil; */}
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  // parseName(params.row.col6)
                }}
              >
                <img src={params.row.members[1].avatar} alt={params.row.members[1].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }} />
                {/* #{params.row.members[1].name}&cedil; */}
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  // parseName(params.row.col6)
                }}
              >
                <img src={params.row.members[2].avatar} alt={params.row.members[1].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }} />
                {/* #{params.row.members[1].name}&cedil; */}
              </IconButton>
            </>
          )
        }
        <IconButton
          size="small"
          sx={{
            border: `1px ${blue[500]} solid`
          }}
          onClick={() => {
            handleOpen();
            handleSetProjectId(params.row.id);
          }}
        >
          <AddBoxIcon />
        </IconButton>
      </strong >
    )
  }


  // Tạo column hiển thị danh sách Project cho DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: "60" },
    { field: 'projectName', headerName: 'Dự án', width: "170" },
    { field: 'categoryName', headerName: 'Phân loại', width: "150" },
    {
      field: 'creator', headerName: 'Người tạo', width: "220",
      renderCell: renderAddCreatorButton,
      // valueGetter giúp lấy dữ liệu ko phải là string mà là array hoặc object
      // valueGetter: (params) => {
      //   return `${params.value.name || "Không chủ"}`;
      // }
    },
    {
      field: 'members', headerName: 'Thành viên', width: "230",
      // valueGetter giúp lấy dữ liệu ko phải là string mà là array hoặc object
      // valueGetter: (params) =>
      // {
      //   let member = [];
      //   if (params.value.length > 0) {
      //     params.value.map((item, index) => {
      //       member += item.name + ", ";
      //     })
      //   }
      //   else {
      //     member = "Chưa có";
      //   }
      //   if (member) {
      //     // setMember(params.value);
      //   }
      //   return member;
      // },
      // renderCell giúp cấy thêm component(Button...) vào bảng
      renderCell: renderAddMemberButton,
    },
    {
      field: 'action', headerName: 'Thao tác', width: "150",
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },
  ];


  // nếu user ko chạy trang home trước mà vô trang management trước thì ko dùng dữ liệu từ store Redux đc mà phải tự gọi API
  let projectListData = [];
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["allProject"],
    queryFn: getAllProject,
    // chỉ kích hoạt nếu có dữ liệu trong projectList (lấy từ store của Redux về do Home đưa lên)
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


  // Lấy các thành phần mong muốn từ mỗi đối tượng vào đối tượng mới sau đó cho vào array rows
  const rows = projectList.map(({ id, projectName, categoryName, creator, members }) => ({ id, projectName, categoryName, creator, members }));


  // Hàm để set Id của project để gọi đúng thành viên project đó
  // const [projectId, setProjectId] = useState("");
  const handleSetProjectId = (value) => {
    // setProjectId(value);
    handleChangeMemberByProjectId(value);
  }


  // Hàm để lấy danh sách member ra từ projectId
  const [memberByProjectId, setMemberByProjectId] = useState("");
  const handleChangeMemberByProjectId = (value) => {
    for (let i in projectList) {
      if (projectList[i].id === value) {
        setMemberByProjectId(projectList[i].members)
      }
    }
  }


  // Hàm để truyền dữ liệu Project muống edit lên store Redux và chuyển hướng qua trang CreateProject
  const handleProjectIdToEdit = (value) => {
    if (value) {
      dispatch(projectListAction.setProjectIdToEdit(value));
    }
    navigate(PATH.CREATEPROJECT);
  }



  // dùng useMutation để Delete Project trên API
  const { mutate: handleDeleteProject, isPending } = useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => {
      MySwal.fire({
        icon: "success",
        title: "Bạn đã xoá dự án thành công",
        // text: "Quay lại trang quản lý dự án",
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries({ queryKey: ["deleteProject"] });
        }
      })
    },
    onError: (error) => {
      alert(error);
    }
  });


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
          <Button
            variant="contained"
            size="medium"
            onClick={() => navigate(PATH.CREATEPROJECT)}
          >
            Tạo dự án
          </Button>
        </Box>
        <div style={{ height: "90%", width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" color={`${blue[500]}`} gutterBottom>
              Danh sách thành viên
            </Typography>
            <Typography id="modal-modal-description" gutterBottom>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      {...typographySettings}
                    >
                      Id
                    </TableCell>
                    <TableCell
                      align="left"
                      {...typographySettings}
                    >
                      Avatar
                    </TableCell>
                    <TableCell
                      align="left"
                      {...typographySettings}
                    >
                      Tên
                    </TableCell>
                    <TableCell
                      align="left"
                      {...typographySettings}
                    >
                      Xoá
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    memberByProjectId.length > 0 ? (
                      memberByProjectId.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="left"
                          >
                            <Typography
                              {...typographySettings}
                            >
                              {item.userId}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                          >
                            <IconButton
                              size="small"
                              sx={{ fontSize: "16px" }}
                            >
                              <img src={item.avatar} alt={item.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid` }} />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="left"
                          >
                            <Typography
                              {...typographySettings}
                            >
                              {item.name}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                          >
                            <IconButton
                              variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                border: `1px ${red[500]} solid`,
                                marginLeft: "10px",
                              }}
                              onClick={() => {
                                // 
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <Typography {...typographySettings} color={"error"}>
                        Chưa có thành viên
                      </Typography>
                    )
                  }
                </TableBody>
              </Table>
            </Typography>
          </Box>
        </Modal>
      </Container>
    </div >
  )
}

export default ProjectManagement