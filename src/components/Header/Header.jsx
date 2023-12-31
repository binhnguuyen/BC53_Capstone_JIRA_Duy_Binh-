import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AppsIcon from '@mui/icons-material/Apps';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import { Button, Container, Divider, Stack } from '@mui/material';

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

export default function Header() {
    const stackSettings = {
        spacing: 2,
        direction: "row",
        justifyContent: "space-between",
    }

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
                    <Stack
                        {...stackSettings}
                    >
                        <Stack {...stackSettings}>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    <AppsIcon />
                                    Jira Software
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Your Work
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Projects
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Filters
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Dashboards
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Teams
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Plans
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <IconButton>
                                    Apps
                                    <KeyboardArrowDownIcon />
                                </IconButton>
                            </Typography>
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                <Button
                                    variant="contained"
                                    size="large"
                                >
                                    Create
                                </Button>
                            </Typography>
                        </Stack>
                        <Stack {...stackSettings}>
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
                            <Typography
                                variant="h6"
                                nowrap="true"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                { }
                            </Typography>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
