import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard/dashboard';
import Home from '../pages/Home/home';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import UserLayout from '../components/Layout/UserLayout/UserLayout.jsx';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout/defaultLayout.jsx';
import ErrorPage from '../pages/ErrorPage/ErrorPage.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';
import Minicard from '../components/sub_components/Minicard';
import EventCard from '../components/sub_components/EventCard.jsx';
import EditProfilePage from '../pages/ProfilePage/EditProfilePage.jsx'


// Component để bảo vệ các tuyến đường dựa trên trạng thái xác thực và vai trò
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    console.log(isAuthenticated + " " + role);
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace={true} />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace={true} />;
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
        path: '/home',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <Home /> }],
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
        path: '/error',
        element: <DefaultLayout />,
        children: [{ path: '', element: <ErrorPage /> }],
    },
    {
        path: '*',
        element: <Navigate to="/error" replace={false} />,
    },
    {
        path: '/profile/edit',  // New route for the Edit Profile page
        element: <ProtectedRoute allowedRoles={['user', 'admin']} />, // Allow both user and admin roles
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <EditProfilePage /> }],
            },
        ],
    },
];

export default routes;