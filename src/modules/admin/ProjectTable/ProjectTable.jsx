import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StyledTableCell from "../../../components/StyledTableCell";
import { useQuery } from "@tanstack/react-query";
import { getAllProject } from "../../../apis/project.api";
import { Avatar, Box, Button, Grid, TablePagination, Typography } from "@mui/material";
import { AppRegistration } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { useMemo, useState } from "react";

const ProjectTable = () => {
    const {
        data = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["projectList"],
        queryFn: getAllProject,
    });

    // console.log("data: ", data)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = useMemo(
        () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [data, page, rowsPerPage]
    );

    return (
        <Paper sx={{ width: "100%" }}>
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 750 }}
                    size="medium"
                    aria-label="project table"
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell
                                component="th"
                                sx={{ fontWeight: 800 }}
                            >
                                ID
                            </StyledTableCell>
                            <StyledTableCell
                                component="th"
                                align="left"
                                sx={{ fontWeight: 800 }}
                            >
                                Project Name
                            </StyledTableCell>
                            <StyledTableCell
                                component="th"
                                align="left"
                                sx={{ fontWeight: 800 }}
                            >
                                Category
                            </StyledTableCell>
                            <StyledTableCell
                                component="th"
                                align="left"
                                sx={{ fontWeight: 800 }}
                            >
                                Creator
                            </StyledTableCell>
                            <StyledTableCell
                                component="th"
                                align="left"
                                sx={{ fontWeight: 800 }}
                            >
                                Members
                            </StyledTableCell>
                            <StyledTableCell
                                component="th"
                                sx={{ fontWeight: 800 }}
                            >
                                Action
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="left">
                                    <Typography color={"darkblue"} fontSize={14} fontWeight={600}>{row.projectName}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    {row.categoryName}
                                </TableCell>
                                <TableCell align="left">
                                    <Button variant="outlined" color="success" size="small">
                                        <Typography fontSize={12}>{row.creator.name}</Typography>
                                    </Button>
                                </TableCell>
                                <TableCell align="left">
                                    <Grid container spacing={1}>
                                        {row.members.map((member) => (
                                            // <Typography key={member.id} component={"span"}>{member.name}</Typography>
                                            <Grid item>
                                                <Avatar
                                                    alt={`Avatar #${member.userId}`}
                                                    src={member.avatar}
                                                    key={member.id}
                                                    sx={{}}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{display: "flex"}}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            sx={{mr: 2}}
                                        >
                                            <AppRegistration />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                        >
                                            <ClearIcon />
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 20, 35, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default ProjectTable;
