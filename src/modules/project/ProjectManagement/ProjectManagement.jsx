import { Box, Button, Container, IconButton, Typography, Modal, Stack, Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { blue, red, green } from '@mui/material/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProject, getAllProject, assignUserProject, removeUserFromProject } from '../../../apis/project.api';
import { getUser } from '../../../apis/user.api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DataGrid } from '@mui/x-data-grid';
import { PATH } from '../../../utils/paths';
import { useNavigate } from 'react-router-dom';
import { projectListAction } from "../../../redux/slices/project.slice"
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';


// Style của ô Search
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { LoadingButton } from '@mui/lab';
import MemberList from '../../../components/MemberList';


const ProjectManagement = () => {
  let { projectList } = useSelector((state) => state.project);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [memberByProjectId, setMemberByProjectId] = useState("");
  console.log('memberByProjectId: ', memberByProjectId);
  const [searchMemberInput, setSearchMemberInput] = useState("");
  const [searchMemberResult, setSearchMemberResult] = useState("");
  const [projectId, setProjectId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberToAssign, setMemberToAssign] = useState({
    projectId: "",
    userId: "",
  });
  const [memberToRemove, setMemberToRemove] = useState({
    projectId: "",
    userId: "",
  });


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


  // Hàm để handle modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const handleOpenModalAddUser = () => setOpenModalAddUser(true);
  const handleCloseModalAddUser = () => setOpenModalAddUser(false);


  // hàm render nút Delete
  const renderDeleteButton = (params) => {
    return (
      <strong>
        <IconButton
          variant="contained"
          color="error"
          size="small"
          title="Sửa dự án"
          style={{ width: "30px", height: "30px", border: `1px ${green[500]} solid`, borderRadius: "30px", marginRight: "5px" }}
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
          title="Xoá dự án"
          style={{ width: "30px", height: "30px", border: `1px ${red[500]} solid`, borderRadius: "30px" }}
          onClick={() => {
            MySwal.fire({
              icon: "question",
              title: "Bạn có chắc muốn xoá dự án này?",
              text: "Xoá xong tạo lại thì cũng đơn giản lắm nha, xoá thoải mái!",
              showCancelButton: true,
              confirmButtonText: "Đồng ý"
            }).then((result) => {
              if (result.isConfirmed) {
                handleDeleteProject(params.row.id);
              }
              else {
                // do nothing
              }
            })
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
          sx={{ fontSize: 12, border: `1px ${blue[500]} solid` }}
          title={params.row.creator.name}
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
                  title={item.name}
                  onClick={() => {
                    handleOpen();
                    handleSetProjectId(params.row.id);
                  }}
                >
                  <img src={item.avatar} alt={item.name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
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
                title={params.row.members.name}
                onClick={() => {
                  handleOpen();
                  handleSetProjectId(params.row.id);
                }}
              >
                <img src={params.row.members[0].avatar} alt={params.row.members[0].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                {/* #{params.row.members[0].name}&cedil; */}
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                title={params.row.members.name}
                onClick={() => {
                  handleOpen();
                  handleSetProjectId(params.row.id);
                }}
              >
                <img src={params.row.members[1].avatar} alt={params.row.members[1].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                {/* #{params.row.members[1].name}&cedil; */}
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                title={params.row.name}
                onClick={() => {
                  handleOpen();
                  handleSetProjectId(params.row.id);
                }}
              >
                <img src={params.row.members[2].avatar} alt={params.row.members[1].name} style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }} />
                {/* #{params.row.members[1].name}&cedil; */}
              </IconButton>
            </>
          )
        }
        <IconButton
          size="small"
          title="Thêm thành viên"
          style={{ width: "30px", height: "30px", border: `1px ${blue[500]} solid`, borderRadius: "30px" }}
          onClick={() => {
            handleOpenModalAddUser();
            handleSetProjectId(params.row.id);
          }}
        >
          <AddBoxIcon />
        </IconButton>
      </strong >
    )
  }


  // hàm render nút chuyển qua trang Task
  const renderLinkProjectIdButton = (params) => {
    return (
      <strong>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          title="Xem chi tiết"
          sx={{ fontSize: 12, border: 0 }}
          onClick={() => {
            navigate(`${PATH.PROJECT}/${params.id}`)
          }}
        >
          {params.id}
        </Button>
      </strong >
    )
  }


  // hàm render nút chuyển qua trang Task
  const renderLinkProjectNameButton = (params) => {
    return (
      <strong>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          title="Xem chi tiết"
          sx={{ fontSize: 12, border: 0 }}
          onClick={() => {
            navigate(`${PATH.PROJECT}/${params.id}`)
          }}
        >
          {params.row.projectName}
        </Button>
      </strong >
    )
  }


  // Tạo column hiển thị danh sách Project cho DataGrid
  const columns = [
    {
      field: 'id', headerName: 'ID', width: "80",
      renderCell: renderLinkProjectIdButton,
    },
    {
      field: 'projectName', headerName: 'Dự án', width: "250",
      renderCell: renderLinkProjectNameButton,
    },
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
      field: 'members', headerName: 'Thành viên', width: "250",
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
  const { data = [], isLoading, isError, error, refetch } = useQuery({
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


  // Lấy các thành phần mong muốn từ mỗi đối tượng vào đối tượng mới sau đó cho vào array rows
  const rows = projectList.map(({ id, projectName, categoryName, creator, members }) => ({ id, projectName, categoryName, creator, members }));


  // Hàm để set Id của project để gọi đúng thành viên project đó
  const handleSetProjectId = (value) => {
    setProjectId(value);
    handleChangeMemberByProjectId(value);
  }


  // Hàm để lấy danh sách member ra từ projectId
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
          // delete xong re-render lại
          refetch();
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


  // Hàm getUser để lấy dữ liệu user về
  const { data: foundMember, isLoading: searchingMember } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
    // chỉ kích hoạt nếu có dữ liệu trong searchMember (lấy từ ô search ra)
    // enabled: !!searchMember,
  });


  // Hàm tìm kiếm searchMemberResult trong foundMember
  const handleSetMemberToAssign = () => {
    let memberToAssignId = "";
    let searchName = searchMemberResult.trim()?.toLowerCase();
    for (let i in foundMember) {
      if (foundMember[i].name.toLowerCase().includes(searchName)) {
        memberToAssignId = foundMember[i].userId;
        break;
      }
    }
    // setSearchMemberInput("");
    setSearchMemberResult("");
    setMemberToAssign({
      ...memberToAssign,
      projectId: projectId,
      userId: memberToAssignId,
    })
  }
  if (searchMemberInput && searchMemberResult) {
    handleSetMemberToAssign();
  }


  // Hàm assignUserProject để thêm vào project
  const { mutate: handleAssignUserProject, isPending: isAssigningUser } = useMutation({
    mutationFn: (payload) => assignUserProject(payload),
    onSuccess: () => {
      handleCloseModalAddUser();
      MySwal.fire({
        icon: "success",
        title: "Bạn đã gán thành viên và dự án thành công",
        // text: "Quay lại trang quản lý dự án",
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries({ queryKey: ["assignUserProject"] });
          refetch();
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


  // Hàm removeUserFromProject để xoá user ra khỏi project
  const { mutate: handleRemoveUserFromProject, isPending: isRemovingUserFromProject } = useMutation({
    mutationFn: (payload) => removeUserFromProject(payload),
    onSuccess: () => {
      MySwal.fire({
        icon: "success",
        title: "Bạn đã gán thành viên và dự án thành công",
        // text: "Quay lại trang quản lý dự án",
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          queryClient.invalidateQueries({ queryKey: ["removeUserFromProject"] });
          refetch();
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


  // Hàm set member để xoá ra khỏi project
  const handleSetMemberToRemove = (value) => {
    setMemberId(value);
    if (memberId !== "") {
      setMemberToRemove({
        ...memberToRemove,
        projectId: projectId,
        userId: value,
      })
    }

    if (memberToRemove.userId !== "" && memberToRemove.projectId !== "") {
      handleClose();
      MySwal.fire({
        icon: "question",
        title: "Bạn có chắc muốn xoá thành viên này?",
        text: "Xoá là bị giận đó, ko giỡn!",
        showCancelButton: true,
        confirmButtonText: "Đồng ý"
      }).then((result) => {
        if (result.isConfirmed) {
          handleRemoveUserFromProject(memberToRemove);
        }
        else {
          // do nothing
        }
      })
    }
  }


  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Container style={{ maxWidth: "100%" }} sx={{ margin: "60px 60px", padding: "24px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
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
          <Button
            variant="contained"
            size="small"
            sx={{
              height: 40,
            }}
            onClick={() => navigate(PATH.CREATEPROJECT)}
          >
            Tạo dự án
          </Button>
        </Box>
        <div style={{ height: "80vh", width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
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
          aria-labelledby="modal-list-member"
          aria-describedby="modal-list-member-description"
        >
          <MemberList memberList={memberByProjectId} />
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
                  <Typography {...typographySettings} color={"error"}>
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
                    loading={isAssigningUser}
                    onClick={() => {
                      handleAssignUserProject(memberToAssign);
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
      </Container>
    </div >
  )
}

export default ProjectManagement