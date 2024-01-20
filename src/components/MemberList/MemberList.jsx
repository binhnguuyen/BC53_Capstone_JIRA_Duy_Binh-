import React, { useState } from 'react'
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTaskDetail, removeUserFromTask } from '../../apis/task.api';
import { useMutation, useQuery } from '@tanstack/react-query';


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

const MemberList = ({ data: taskDetail }) => {


    // thư viện SweetAlert
    const MySwal = withReactContent(Swal);


    // Hàm getTaskDetail để lấy dữ liệu task về theo id
    const { data, isLoadingTaskDetail, refetch: refetchTaskDetail } = useQuery({
        queryKey: ["taskId", taskDetail.taskId],
        queryFn: () => getTaskDetail(taskDetail.taskId),
        enabled: !!taskDetail,
    });


    // Hàm removeUserFromTask để xoá user ra khỏi task
    const { mutate: handleRemoveUserFromTask, isPending: isRemovingUserTask } = useMutation({
        mutationFn: (payload) => removeUserFromTask(payload),
        onSuccess: () => {
            MySwal.fire({
                icon: "success",
                title: "Bạn đã xoá thành viên ra khỏi công việc thành công",
                text: "Bạn muốn xoá thêm thành viên khác?",
                // showCancelButton: true,
                confirmButtonText: "Đồng ý",
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


    // Hàm set User để xoá khỏi Task
    const handleSetRemoveUserTask = (value) => {
        if (value && taskDetail.taskId) {
            MySwal.fire({
                icon: "question",
                title: "Bạn có chắc muốn gỡ thành viên ra khỏi công việc",
                showCancelButton: true,
                confirmButtonText: "Đồng ý"
            }).then((result) => {
                if (result.isConfirmed) {
                    handleRemoveUserFromTask({
                        userId: value,
                        taskId: taskDetail.taskId,
                    });
                }
                else {
                    // do nothing
                    handleClose();
                }
            })
        }
    }


    return (
        <div>
            <Box sx={style}>
                <Typography id="modal-list-member" variant="h5" color={`${blue[500]}`} gutterBottom>
                    Danh sách thành viên
                </Typography>
                <Typography id="modal-list-member-description" gutterBottom>
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
                                taskDetail !== undefined ? (
                                    taskDetail.assigness.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                align="left"
                                            >
                                                <Typography
                                                    {...typographySettings}
                                                >
                                                    {item.id}
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
                                                    title="Loại thành viên"
                                                    sx={{
                                                        border: `1px ${red[500]} solid`,
                                                        marginLeft: "10px",
                                                    }}
                                                    onClick={() => {
                                                        handleSetRemoveUserTask(item.id);
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
        </div>
    )
}

export default MemberList