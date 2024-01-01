import {
    Grid,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    Avatar,
    Box,
    FormControlLabel,
    Checkbox,
    IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { PATH } from "../../../utils/paths";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../../apis/user.api";
import Copyright from "../../../components/Copyright";
import logo from "../../../assets/img/logo.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "all",
    });

    const navigate = useNavigate();

    const { mutate: handleSignin, isPending } = useMutation({
        mutationFn: (payload) => loginApi(payload),
        onSuccess: (values) => {
            alert("Login successfully!");
            // save user's information to local storage (using values)

            // navigate to page home
            navigate(`${PATH.HOME}`);
        },
        onError: (error) => {
            console.log("error", error.message);
            alert(error.message);
        },
    });

    const onSubmit = async (values) => {
        console.log("values", values);

        // call api
        handleSignin(values);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Stack
            spacing={3}
            padding={5}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Avatar alt="Jira Logo" src={logo} />
            <Typography component="h1" variant="h5" fontWeight={600} mt={1}>
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    autoFocus
                    {...register("email", {
                        required: "Please enter your email!",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email!",
                        },
                    })}
                    error={Boolean(errors.email)}
                    helperText={Boolean(errors.email) && errors.email.message}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="**********"
                    {...register("password", {
                        required: "Please enter your password!",
                    })}
                    error={Boolean(errors.password)}
                    helperText={
                        Boolean(errors.password) && errors.password.message
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox value="remember" color="primary" />
                    }
                    label="Remember me"
                />
                <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={isPending}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign in
                </LoadingButton>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {"Don't have an account? "}
                            <Link href="#" variant="body2">
                                {"Sign Up"}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
            </Box>
        </Stack>
    );
};

export default Login;
