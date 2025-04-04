import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard/dashboard';
import Home from '../pages/Home/home';
import SignIn from '../pages/SignIn/signIn';
import SignUp from '../pages/SignUp/signUp';
import UserLayout from '../components/Layout/UserLayout/UserLayout.jsx';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout/defaultLayout.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';

// Component để bảo vệ các tuyến đường dựa trên trạng thái xác thực và vai trò
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace={true} />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/home" replace={true} />;
    }

    return <Outlet />;
};

// Định nghĩa các tuyến đường
const routes = [
    {
        path: '/',
        // element: <ProtectedRoute allowedRoles={['organizer', 'attendee']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <LandingPage /> }],
            },
        ],
    },
    {
        path: '/',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: 'home', element: <Home /> }],
            },
        ],
    },
    {
        path: '/dashboard',
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [{ path: '', element: <Dashboard /> }],
            },
        ],
    },
    {
        path: '/sign-in',
        element: <DefaultLayout />,
        children: [{ path: '', element: <SignIn /> }],
    },
    {
        path: '/sign-up',
        element: <DefaultLayout />,
        children: [{ path: '', element: <SignUp /> }],
    },
    {
        path: '*',
        element: <Navigate to="/home" replace={true} />,
    },
];

export default routes;
