import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { lazy } from "react";
import { PATH } from "../utils/paths";
import MainLayout from "../layouts/MainLayout";
import AuthenticationLayout from "../layouts/AuthenticationLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";

//* LAZY LOADING PAGES
const HomePage = lazy(() => import("../modules/home"));
const NotFoundPage = lazy(() => import("../modules/error/NotFound"))
// const NotAuthorizedPage = lazy(() => import("../modules/error/NotAuthorized"))
const LoginPage = lazy(() => import("../modules/auth/Login"))
const RegisterPage = lazy(() => import("../modules/auth/Register"))
const AdminPage = lazy(() => import("../modules/admin"))

const AuthenticateRouter = () => {
    // Check for authentication token
    const isAuthenticated = false;

    // Check Navigation
    return isAuthenticated ? (<Navigate to={PATH.HOME} />) : <Outlet />
}

const useRouteElements = () => {
    let element = useRoutes([
        {
            path: "",
            element: <AuthenticateRouter />,
            children: [
                {
                    path: "",
                    element: <AuthenticationLayout />,
                    children: [
                        {
                            path: PATH.LOGIN,
                            element: <LoginPage />,
                        },
                        {
                            path: PATH.REGISTER,
                            element: <RegisterPage />,
                        }
                    ]
                }
            ]
        },
        {
            path: PATH.HOME,
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
            ],
        },
        {
            path: PATH.ADMIN,
            element: <AdminLayout />,
            children: [
                {
                    index: true,
                    element: <AdminPage />,
                },
            ],
        },
        { path: "*", element: <NotFoundPage /> },
    ]);

    return element;
}

export default useRouteElements