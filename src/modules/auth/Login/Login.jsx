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
import { CURRENT_USER } from "../../../utils/constants";
import { setLocalStorage } from "../../../utils/helpers";

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
            alert("Đăng nhập thành công!");
            // save user's information to local storage (using values)
            // save sau khi login POST thành công lên API để có Access Token
            setLocalStorage(CURRENT_USER , values);
            // navigate to page home
            navigate(`${PATH.HOME}`);
        },
        onError: (error) => {
            console.log("error", error.message);
            alert(error.message);
        },
    });
    
    const onSubmit = async (values) => {

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
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                    autoFocus
                    {...register("email", {
                        required: "Vui lòng nhập email!",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Vui lòng nhập email hợp lệ!",
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
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="**********"
                    {...register("password", {
                        required: "Vui lòng nhập mật khẩu!",
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
                    label={<Typography component={"span"} variant="body2">Ghi nhớ đăng nhập</Typography>}
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
                            Quên mật khẩu
                        </Link>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {"Chưa có tài khoản? "}
                            <Link href="#" variant="body2">
                                {"Đăng ký"}
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
