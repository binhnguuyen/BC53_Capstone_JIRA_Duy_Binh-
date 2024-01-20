import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/apps';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, Container, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router';
import { PATH } from "../../utils/paths/index"
import { useDispatch, useSelector } from 'react-redux';
import { userAction } from '../../redux/slices/user.slice';
import { setLocalStorage } from '../../utils/helpers';
import { CURRENT_USER } from '../../utils/constants';

// Thư viện Swal
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    borderRadius: "0px",
    // padding: theme.spacing(1),
    boxShadow: "none",
    textAlign: 'center',
    // color: theme.palette.text.secondary,
    display: "flex",
}));

const drawerWidth = 350;

export default function Header(props) {
    // thư viện SweetAlert
    const MySwal = withReactContent(Swal);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);


    const stackSettings = {
        width: "100%",
        spacing: 2,
        direction: "row",
        justifyContent: "space-between",
        padding: "5px 30px"
    }

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        MySwal.fire({
            icon: "question",
            title: "Bạn chắc muốn đăng xuất?",
            showCancelButton: true,
            confirmButtonText: "Đồng ý"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(userAction.setCurrentUser(null));
                localStorage.clear(CURRENT_USER);
                navigate(PATH.HOME);
            }
            else {
                // do nothing
            }
        })
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Jira Software
            </Typography>
            <Divider />
            <List>
                <Stack
                    // disablePadding
                    sx={{ display: { lg: 'block', xl: 'none' } }}
                >
                    <ListItemButton sx={{ textAlign: 'center', display: { md: 'none' } }}
                        onClick={() => navigate(PATH.CREATETASK)}>
                        <ListItemText primary="Công việc" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center', display: { md: 'none' } }} onClick={() => navigate(PATH.PROJECTMANAGEMENT)}>
                        <ListItemText primary="Dự án" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center', display: { lg: 'none' } }}>
                        <ListItemText primary="Bộ lọc" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center', display: { lg: 'none' } }}>
                        <ListItemText primary="Dashboards" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Nhóm" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Kế hoạch" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Ứng dụng" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                </Stack>
            </List>
        </Box >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box
            sx={{ width: "100%", flexGrow: 1, margin: 0, position: "fixed", top: 0, zIndex: 1000 }}
        >
            <AppBar position="static" sx={{ width: "100%" }}>
                <Toolbar
                    sx={{
                        color: "#6B778C",
                        backgroundColor: "white",
                    }}
                >
                    <Stack {...stackSettings}>
                        <Stack
                            direction="row"
                            sx={{ textAlign: "center", alignItems: "center" }}
                        >
                            <IconButton
                                sx={{ flexGrow: 1, display: { xl: 'none' } }}
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                component="div"
                                onClick={handleDrawerToggle}
                            >
                                <AppsIcon />
                            </IconButton>
                            <IconButton
                                component="div"
                                sx={{ flexGrow: 1, fontSize: 24, color: `${blue[600]}`, fontWeight: 700, display: { sm: 'flex' } }}
                                onClick={() => navigate(PATH.HOME)}
                            >
                                Jira Software
                            </IconButton>
                            <IconButton
                                component="div"
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'flex' }, textAlign: "center", alignItems: "center" }}
                                onClick={() => navigate(PATH.CREATETASK)}
                            >
                                Công việc
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                component="div"
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'flex' }, textAlign: "center", alignItems: "center" }}
                                onClick={() => navigate(PATH.PROJECTMANAGEMENT)}
                            >
                                Dự án
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                component="div"
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }, textAlign: "center", alignItems: "center" }}
                            >
                                Bộ lọc
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' }, textAlign: "center", alignItems: "center" }}
                                component="div"
                            >
                                Tổng quan
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex' }, textAlign: "center", alignItems: "center" }}
                                component="div"
                            >
                                Nhóm
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex' }, textAlign: "center", alignItems: "center" }}
                                component="div"
                            >
                                Kế hoạch
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <IconButton
                                sx={{ fontSize: 18, flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex' }, textAlign: "center", alignItems: "center" }}
                                component="div"
                            >
                                Ứng dụng
                                <KeyboardArrowDownIcon />
                            </IconButton>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    height: 40,
                                    // minWidth: 40,
                                    ml: 1,
                                }}
                                onClick={() => navigate(PATH.CREATEPROJECT)}
                            >
                                Tạo dự án
                            </Button>
                        </Stack>
                        <Stack direction="row" sx={{ textAlign: "center", alignItems: "center" }}>
                            <Search
                                style={{
                                    border: "1px solid #6B778C",
                                    width: "8vw",
                                    height: 40,
                                    marginRight: 2,
                                }}
                            >
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <IconButton
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ fontSize: 10, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <NotificationsActiveIcon />
                            </IconButton>
                            <IconButton
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ fontSize: 10, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <HelpOutlineIcon />
                            </IconButton>
                            <IconButton
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ fontSize: 10, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <SettingsIcon />
                            </IconButton>
                            {currentUser ? (
                                <Stack direction={"row"} spacing={2} alignItems={"center"}>
                                    <IconButton
                                        variant="h6"
                                        nowrap="true"
                                        component="div"
                                        title={currentUser.name}
                                        sx={{ fontSize: 10, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            height: 40,
                                            marginLeft: 1,
                                        }}
                                        onClick={() => {
                                            handleLogout();
                                            // đăng xuất rồi thì đá qua trang HOME
                                            navigate(PATH.HOME);
                                        }}>
                                        Đăng xuất
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={2} direction={"row"}>
                                    <Button
                                        sx={{
                                            height: 40,
                                            marginLeft: 1,
                                        }}
                                        variant="outlined"
                                        onClick={() => navigate(PATH.REGISTER)}>
                                        ĐĂng ký
                                    </Button>
                                    <Button
                                        sx={{
                                            height: 40,
                                            // marginLeft: 1,
                                        }}
                                        variant="contained"
                                        onClick={() => navigate(PATH.LOGIN)}>
                                        Đăng nhập
                                    </Button>
                                </Stack>
                            )}

                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', xl: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box >
    );
}
