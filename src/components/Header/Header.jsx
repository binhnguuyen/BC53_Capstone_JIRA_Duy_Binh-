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
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    flexGrow: 1,
}));

const drawerWidth = 350;
const navItems = ['Công việc', 'Dự án', 'Bộ lọc', 'Dashboards', 'Nhóm', 'Kế hoạch', 'Ứng dụng'];


export default function Header(props) {
    const navigate = useNavigate();

    const stackSettings = {
        spacing: 2,
        direction: "row",
        justifyContent: "space-between",
    }

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    console.log('mobileOpen: ', mobileOpen);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Jira Software
            </Typography>
            <Divider />
            <List>
                {/* {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))} */}
                <Stack
                    // disablePadding
                    sx={{ display: { lg: 'block', xl: 'none' } }}

                >
                    <ListItemButton sx={{ textAlign: 'center', display: { md: 'none' } }}>
                        <ListItemText primary="Công việc" />
                        <KeyboardArrowDownIcon />
                    </ListItemButton>
                    <ListItemButton sx={{ textAlign: 'center', display: { md: 'none' } }}>
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
    console.log('container: ', container);

    return (
        <Box
            sx={{ flexGrow: 1 }}
            style={{ width: '100%', margin: 0, position: "fixed", top: 0, zIndex: 1000 }}
        >
            <AppBar position="static">
                <Toolbar
                    style={{
                        color: "#6B778C",
                        backgroundColor: "white",
                    }}
                >
                    {/* <Stack
                        {...stackSettings}
                    >
                        <Stack {...stackSettings}> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
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
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        component="div"
                        sx={{ flexGrow: 1, fontSize: 28, color: `${blue[600]}`, fontWeight: 700, display: { sm: 'block' } }}
                        onClick={() => navigate(PATH.HOME)}
                    >
                        Jira Software
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Box sx={{ display: { sm: 'none', md: 'block' } }}>
                        {navItems.map((item) => (
                            <IconButton
                                component="div"
                                key={item}
                                sx={{ flexGrow: 1 }}
                            >
                                {item}
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        ))}
                    </Box> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'block' } }}
                    >
                        Công việc
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'block' } }}
                        component="div"
                    >
                        Dự án
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
                    >
                        Bộ lọc
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}
                        component="div"
                    >
                        Tổng quan
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } }}
                        component="div"
                    >
                        Nhóm
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } }}
                        component="div"
                    >
                        Kế hoạch
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        sx={{ flexGrow: 1 }}
                    > */}
                    <IconButton
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'block' } }}
                        component="div"
                    >
                        Ứng dụng
                        <KeyboardArrowDownIcon />
                    </IconButton>
                    {/* </Typography> */}
                    {/* <Typography
                        variant="h6"
                        nowrap="true"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    > */}
                    <Button
                        variant="contained"
                        size="large"
                    >
                        Create
                    </Button>
                    {/* </Typography> */}
                    {/* </Stack> */}
                    {/* <Stack {...stackSettings}> */}
                    <Search
                        style={{
                            border: "1px solid #6B778C"
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
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <NotificationsActiveIcon />
                    </IconButton>
                    <IconButton
                        variant="h6"
                        nowrap="true"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <HelpOutlineIcon />
                    </IconButton>
                    <IconButton
                        variant="h6"
                        nowrap="true"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <SettingsIcon />
                    </IconButton>
                    <IconButton
                        variant="h6"
                        nowrap="true"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    {/* </Stack> */}
                    {/* </Stack> */}
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
