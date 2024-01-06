import React, { useState } from 'react'
import { Autocomplete, Box, Container, Stack, TextField, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import Copyright from "../../components/Copyright";
import { styled, alpha } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useQuery } from '@tanstack/react-query';
import { getAllProject } from '../../apis/project.api';


const Task = () => {
    let { projectList } = useSelector((state) => state.project);
    const [searchprojectInput, setSearchProjectInput] = useState("");
    const [searchProjectResult, setSearchProjectResult] = useState("");



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
    console.log('projectList: ', projectList);

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
                    // onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <Typography {...typographySettings}>
                            Chọn dự án
                        </Typography>
                        <Typography>
                            {
                                projectList ? (
                                    <Stack spacing={2} sx={{ width: "100%", margin: "10px 0" }} >
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
                </div>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </div>
    )
}

export default Task