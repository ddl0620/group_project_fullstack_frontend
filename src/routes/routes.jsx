import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard/dashboard';
import Home from '../pages/Home/home';
import Login from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import UserLayout from '../components/Layout/UserLayout/UserLayout.jsx';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout/defaultLayout.jsx';
import ErrorPage from '../pages/ErrorPage/ErrorPage.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';
import EditProfilePage from '../pages/ProfilePage/EditProfilePage.jsx';
import EventPage from '../pages/Event/EventPage.jsx';
import CreateEventPage from '../pages/Event/CreateEventPage.jsx';
import UpdateEventPage from '../pages/Event/UpdateEventPage.jsx';

// Component để bảo vệ các tuyến đường dựa trên trạng thái xác thực và vai trò
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    console.log(isAuthenticated + ' ' + role);
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace={true} />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace={true} />;
    }

    return <Outlet />;
};

const AuthenticatedRoute = () => {
    const { isAuthenticated, role } = useSelector((state) => state.user);

    if (isAuthenticated && (role !== 'user ' || role !== 'admin')) {
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
        path: '/event',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <EventPage /> }],
            },
        ],
    },
    {
        path: '/event/create',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <CreateEventPage /> }],
            },
        ],
    },
    {
        path: '/event/update/:id',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <UserLayout />,
                children: [{ path: '', element: <UpdateEventPage /> }],
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
        element: <AuthenticatedRoute allowedRoles={['guest']} />,
        children: [
            {
                element: <DefaultLayout />,
                children: [{ path: '', element: <Login /> }],
            },
        ],
    },
    {
        path: '/sign-up',
        element: <AuthenticatedRoute allowedRoles={['guest']} />,
        children: [
            {
                element: <DefaultLayout />,
                children: [{ path: '', element: <SignUp /> }],
            },
        ],
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
        path: '/profile/edit', // New route for the Edit Profile page
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
