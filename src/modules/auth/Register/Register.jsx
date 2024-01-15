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
import { registerApi } from "../../../apis/user.api";
import Copyright from "../../../components/Copyright";
import logo from "../../../assets/img/logo.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const Register = () => {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phoneNumber: "",
            confirmPassword: "",
        },
        mode: "all",
    });

    const navigate = useNavigate();

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: (payload) => registerApi(payload),
        onSuccess: (values) => {
            alert("Register account successfully!");

            // navigate to page login
            navigate(`${PATH.LOGIN}`);
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

    const onSubmit = async (values) => {
        console.log("values", values);

        // call api
        handleRegister(values);
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () =>
        setConfirmShowPassword((show) => !show);

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
                Sign up
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
            >
                <Grid container spacing={2}>
                    <Grid item sm={12} md={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Họ và tên"
                            name="name"
                            type="text"
                            placeholder="Nguyen Van A"
                            autoFocus
                            {...register("name", {
                                required: "Vui lòng nhập họ tên!",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{1,}$/,
                                    message: "Vui lòng nhập họ tên hợp lệ!",
                                },
                            })}
                            error={Boolean(errors.name)}
                            helperText={
                                Boolean(errors.name) && errors.name.message
                            }
                        />
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phoneNumber"
                            label="Số điện thoại"
                            name="phoneNumber"
                            type="text"
                            placeholder="+84122346689"
                            {...register("phoneNumber", {
                                required: "Vui lòng nhập số điện thoại!",
                                minLength: {
                                    value: 10,
                                    message:
                                        "Số điện thoại phải có ít nhất 10 kí tự!",
                                },
                                maxLength: {
                                    value: 11,
                                    message:
                                        "Số điện thoại chỉ chứa tối đa 11 kí tự!",
                                },
                                pattern: {
                                    value: /^(?=.*\d).{1,}$/,
                                    message:
                                        "Vui lòng nhập số điện thoại hợp lệ!",
                                },
                            })}
                            error={Boolean(errors.phoneNumber)}
                            helperText={
                                Boolean(errors.phoneNumber) &&
                                errors.phoneNumber.message
                            }
                        />
                    </Grid>
                </Grid>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
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
                        minLength: {
                            value: 8,
                            message:
                                "Mật khẩu phải có ít nhất 8 kí tự!",
                        },
                        maxLength: {
                            value: 32,
                            message:
                                "Mật khẩu phải chỉ chứa tối đa 32 kí tự!",
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&-]/,
                            message:
                                "Mật khẩu phải chứa ít nhất 1 kí tự thường, 1 kí tự in hoa, 1 số và 1 kí tự đặc biệt!",
                        },
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="**********"
                    {...register("confirmPassword", {
                        required: "Vui lòng nhập lại mật khẩu!",
                        validate: (value) => {
                            const password = watch("password");
                            return (
                                password == value ||
                                "Mật khẩu không trùng khớp, vui lòng nhập lại!"
                            );
                        },
                    })}
                    error={Boolean(errors.confirmPassword)}
                    helperText={
                        Boolean(errors.confirmPassword) &&
                        errors.confirmPassword.message
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Grid container alignItems={"center"} sx={{ p: 0 }}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value="agree"
                                    color="primary"
                                    required
                                />
                            }
                            label={
                                <Typography component={"span"} variant="body2">
                                    Tôi đồng ý với{" "}
                                    <Link to="#">điều khoản sử dụng</Link>
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>

                <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={isPending}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Đăng Ký
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Typography>
                            {"Đã có tài khoản? "}
                            <Link href="#" variant="body2">
                                {"Đăng nhập"}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
            </Box>
        </Stack>
    );
};

export default Register;
