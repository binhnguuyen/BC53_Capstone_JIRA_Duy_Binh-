import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
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
const ProjectManagementPage = lazy(() => import("../modules/project/ProjectManagement"))
const ProjectPage = lazy(() => import("../modules/project/Project"))
const CreateProjectPage = lazy(() => import("../modules/project/CreateProject"))
const TaskPage = lazy(() => import("../modules/task"))


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
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <AuthenticationLayout />
                        </Suspense>,
                    children: [
                        {
                            path: PATH.LOGIN,
                            element:
                                <Suspense callBack={<div>Loading</div>}>
                                    <LoginPage />
                                </Suspense>,
                        },
                        {
                            path: PATH.REGISTER,
                            element:
                                <Suspense callBack={<div>Loading</div>}>
                                    <RegisterPage />
                                </Suspense>,
                        }
                    ]
                }
            ]
        },
        {
            path: "",
            element: <MainLayout />,
            children: [
                {
                    path: PATH.HOME,
                    index: 1,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <HomePage />
                        </Suspense>,
                },
                {
                    path: PATH.PROJECTMANAGEMENT,
                    // index: 2,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <ProjectManagementPage />,
                        </Suspense>,
                },
                {
                    path: PATH.CREATEPROJECT,
                    // index: 3,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <CreateProjectPage />
                        </Suspense>,
                },
                {
                    path: PATH.CREATETASK,
                    // index: 2,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <TaskPage />
                        </Suspense>,
                },
                {
                    path: `${PATH.PROJECT}/:projectId`,
                    // index: 3,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <ProjectPage />
                        </Suspense>,
                },
            ],
        },
        {
            path: PATH.ADMIN,
            element:
                <Suspense callBack={<div>Loading</div>}>
                    <AdminLayout />
                </Suspense>,
            children: [
                {
                    index: true,
                    element:
                        <Suspense callBack={<div>Loading</div>}>
                            <AdminPage />
                        </Suspense>,
                },
            ],
        },
        {
            path: "*",
            element:
                <Suspense callBack={<div>Loading</div>}>
                    <NotFoundPage />
                </Suspense>,
        }
    ]);

    return element;
}

export default useRouteElements