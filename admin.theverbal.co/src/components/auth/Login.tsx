import React, { Fragment, useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import { useAuth } from "../../contexts/auth.context";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";

export type LoginInputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const { login, isAuthenticated, loading } = useAuth();

    const history = useHistory();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            history.push("/dashboard");
        }
    }, [loading, isAuthenticated]);

    const onSubmit = async (values: LoginInputs) => {
        const { email, password } = values;
        try {
            await login(email, password);
            setError(undefined);
        } catch (err) {
            setError(err as string);
        }
    };

    return (
        <Fragment>
            <Container maxWidth={"sm"}>
                <Box mb={4}>
                    <Typography variant="h2" component={"h1"} color="textPrimary" align="left">
                        Sign In
                    </Typography>
                </Box>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    onSubmit={onSubmit}
                    validationSchema={yup.object({
                        email: yup.string().email("A valid email is required").required("Email is required"),
                        password: yup.string().required("Password is required"),
                    })}
                    validateOnChange={false}
                >
                    {({ submitForm, errors, values, handleChange, touched, isSubmitting }) => {
                        return (
                            <Form>
                                <FormControl fullWidth margin={"normal"}>
                                    <TextField
                                        autoFocus
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        variant="outlined"
                                        value={values.email}
                                        onChange={handleChange}
                                        helperText={errors.email && touched.email && errors.email}
                                        error={errors.email ? true : false}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin={"normal"}>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        value={values.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        onMouseDown={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        autoComplete="on"
                                        helperText={errors.password && touched.password && errors.password}
                                        error={errors.password ? true : false}
                                    />
                                </FormControl>

                                {error && <Alert severity={"error"}>{error}</Alert>}

                                <FormControl fullWidth margin={"normal"}>
                                    <Button
                                        type="submit"
                                        size="large"
                                        color="secondary"
                                        variant="contained"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        fullWidth
                                    >
                                        {!loading ? "Sign In" : <CircularProgress />}
                                    </Button>
                                </FormControl>
                            </Form>
                        );
                    }}
                </Formik>
            </Container>
        </Fragment>
    );
};

export default Login;
