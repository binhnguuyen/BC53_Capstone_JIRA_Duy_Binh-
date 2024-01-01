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
            console.log("error", error.message);
            alert(error.message);
        },
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
                            label="Your Name"
                            name="name"
                            type="text"
                            placeholder="Nguyen Van A"
                            autoFocus
                            {...register("name", {
                                required: "Please enter your name!",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{1,}$/,
                                    message: "Please enter a valid name!",
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
                            label="Phone Number"
                            name="phoneNumber"
                            type="text"
                            placeholder="+84122346689"
                            {...register("phoneNumber", {
                                required: "Please enter your phone number!",
                                minLength: {
                                    value: 9,
                                    message:
                                        "Phone number must be at least 9 digits long",
                                },
                                maxLength: {
                                    value: 11,
                                    message:
                                        "Phone number must be no more than 11 digits",
                                },
                                pattern: {
                                    value: /^(?=.*\d).{1,}$/,
                                    message:
                                        "Please enter a valid phone number!",
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
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
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
                        minLength: {
                            value: 8,
                            message:
                                "Password must be at least 8 characters long!",
                        },
                        maxLength: {
                            value: 32,
                            message:
                                "Password must be no more than 32 characters long!",
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&-]/,
                            message:
                                "Password must contain at least 1 undercase, 1 uppercase, 1 digit and 1 special character!",
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
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="**********"
                    {...register("confirmPassword", {
                        required: "Please confirm your password!",
                        validate: (value) => {
                            const password = watch("password");
                            return (
                                password == value ||
                                "Password entered is not the same"
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
                                    I accepted the{" "}
                                    <Link to="#">terms and conditions</Link>
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
                    Sign up
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Typography>
                            {"Already have an account? "}
                            <Link href="#" variant="body2">
                                {"Sign in"}
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
