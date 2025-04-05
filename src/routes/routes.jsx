import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard/dashboard';
import Home from '../pages/Home/home';
import SignIn from '../pages/SignIn/signIn';
import SignUp from '../pages/SignUp/signUp';
import UserLayout from '../components/Layout/UserLayout/UserLayout.jsx';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout/defaultLayout.jsx';
import ErrorPage from '../pages/ErrorPage/ErrorPage.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';
import Minicard from '../components/sub_components/Minicard';

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
        path: '/test-minicard',
        element: (
            <div
                style={{
                    padding: '20px',
                    fontFamily: 'Arial, sans-serif',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#1a1a1a',
                }}
            >
                <Minicard
                    type="profile"
                    avatar="https://techvccloud.mediacdn.vn/2018/12/22/1supq92uyknelefyyf7ughw-15454498606631836572894-crop-1545449864895548482406.png"
                    title="Hackathon 2023"
                    subtitle="Organized by TechVC"
                    content="Join us for an exciting hackathon experience!"
                    timestamp="12:18 pm"
                    status="online"
                />
            </div>
        ),
    },
];

export default routes;