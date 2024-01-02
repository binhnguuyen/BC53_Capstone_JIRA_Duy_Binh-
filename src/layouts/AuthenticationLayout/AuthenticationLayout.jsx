import {
    Grid,
    CssBaseline,
    Paper
} from "@mui/material";
import { Outlet } from 'react-router-dom'
import background from "../../assets/img/background.png"

const AuthenticationLayout = () => {
    return (
        <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    // backgroundImage:
                    //     "url(https://source.unsplash.com/random?wallpapers)",
                    backgroundImage: `url(${background})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
            >
                <Outlet />
            </Grid>
        </Grid>
    )
}

export default AuthenticationLayout
