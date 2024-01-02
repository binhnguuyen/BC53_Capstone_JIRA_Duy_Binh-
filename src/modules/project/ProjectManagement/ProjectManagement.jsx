import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { blue } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import { green } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import { getAllProject } from '../../../apis/project.api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DataGrid } from '@mui/x-data-grid';


const ProjectManagement = () => {
  let { projectList } = useSelector((state) => state.project)
  const [member, setMember] = useState("");

  const renderDeleteButton = (params) => {
    return (
      <strong>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            // parseName(params.row.col6)
          }}
        >
          <DeleteIcon />
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            // parseName(params.row.col6)
          }}
        >
          <EditIcon />
        </Button>
      </strong>
    )
  }


  const renderAddCreatorButton = (params) => {
    console.log('params: ', params);
    return (
      <strong>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          sx={{ fontSize: "14px" }}
          onClick={() => {
            // parseName(params.row.col6)
          }}
        >
          {/* <img src={item.avatar} alt={item.name} style={{width: "30px", height: "30px"}}/> */}
          #{params.row.creator.name}&cedil;
        </IconButton>
      </strong >
    )
  }

  const renderAddMemberButton = (params) => {
    return (
      <strong>
        {
          params.row.members.length < 2 ? (
            params.row.members.map((item, index) => {
              return (
                <>
                  <IconButton
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ fontSize: "14px" }}
                    onClick={() => {
                      // parseName(params.row.col6)
                    }}
                  >
                    {/* <img src={item.avatar} alt={item.name} style={{width: "30px", height: "30px"}}/> */}
                    #{item.name}&cedil;
                  </IconButton>
                </>
              )
            })
          ) : (
            <>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                sx={{ fontSize: "14px" }}
                onClick={() => {
                  // parseName(params.row.col6)
                }}
              >
                {/* <img src={params.row.members[0].avatar} alt={params.row.members[0].name} style={{width: "30px", height: "30px"}}/> */}
                #{params.row.members[0].name}&cedil;
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                sx={{ fontSize: "14px" }}
                onClick={() => {
                  // parseName(params.row.col6)
                }}
              >
                {/* <img src={params.row.members[1].avatar} alt={params.row.members[1].name} style={{width: "30px", height: "30px"}}/> */}
                #{params.row.members[1].name}&cedil;
              </IconButton>
            </>
          )
        }
        <Button>
          <AddBoxIcon />
        </Button>
      </strong >
    )
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: "60" },
    { field: 'projectName', headerName: 'Dự án', width: "150" },
    { field: 'categoryName', headerName: 'Phân loại', width: "130" },
    {
      field: 'creator', headerName: 'Người tạo', width: "120",
      renderCell: renderAddCreatorButton,
      // valueGetter: (params) => {
      //   return `${params.value.name || "Không chủ"}`;
      // }
    },
    {
      field: 'members', headerName: 'Thành viên', width: "300",
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
      renderCell: renderAddMemberButton,
    },
    {
      field: 'action', headerName: 'Hành động', width: "150",
      renderCell: renderDeleteButton,
      disableClickEventBubbling: true,
    },
  ];


  // nếu user ko chạy trang home trước mà vô trang management trước thì ko dùng dữ liệu từ store Redux đc mà phải tự gọi API
  // const [projectListData, setProjectListData] = useState("");
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

  const indicesToCopy = [1, 8, 2, 3, 7];
  // Lấy các thành phần mong muốn từ mỗi đối tượng
  const rows = projectList.map(({ id, projectName, categoryName, creator, members }) => ({ id, projectName, categoryName, creator, members }));


  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Container style={{ maxWidth: "80vw" }} sx={{ margin: "60px 60px", padding: "24px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
        <Box style={{ padding: "10px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
          <Typography variant="h5" style={{ color: `${blue[500]}` }}>
            Bảng dự án
          </Typography>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
        {/* <TableContainer component={Paper} style={{ maxWidth: "100%" }}>
          <Table sx={{ maxWidth: "100%" }} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell width={"10%"} >Id</TableCell>
                <TableCell width={"15%"} align="left" >Tên dự án</TableCell>
                <TableCell width={"15%"} align="left">Phân loại</TableCell>
                <TableCell width={"15%"} align="left">Người tạo</TableCell>
                <TableCell width={"25%"} align="left">Thành viên</TableCell>
                <TableCell width={"10%"} align="left">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                projectList.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="item">
                      {item.id}
                    </TableCell>
                    <TableCell align="left">{item.projectName}</TableCell>
                    <TableCell align="left">{item.categoryName}</TableCell>
                    <TableCell align="left">{item.creator.name}</TableCell>
                    <TableCell
                      align="left"
                      key={index}
                    >
                      {
                        item.members.length > 0 ?
                          (
                            item.members.map((member, index) => {
                              return (
                                <>
                                  <IconButton
                                    size="small"
                                    sx={{ fontSize: "16px" }}
                                    key={index}
                                  >
                                    #{member.name}
                                  </IconButton>
                                </>
                              )
                            })
                          ) : (
                            <>
                              <IconButton
                                size="small"
                                sx={{ fontSize: "16px" }}
                                key={index}
                              >
                                Chưa có
                              </IconButton>
                            </>
                          )
                      }
                      <IconButton 
                        onClick={() => {

                        }}
                      >
                        ...<AddBoxIcon/>
                      </IconButton>
                    </TableCell>
                    <TableCell align="left">
                      <Button variant="contained" size='small' startIcon={<EditIcon />}>
                      </Button>
                      <Button variant="contained" size='small' color="error" startIcon={<DeleteIcon />}>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer> */}

      </Container>
    </div>
  )
}

export default ProjectManagement