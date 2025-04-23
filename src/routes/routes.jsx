import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserDashboard from '../pages/Dashboard/User/UserDashboard.jsx';
import Home from '../pages/Home/home';
import Login from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';
import UserLayout from '../components/Layout/UserLayout/UserLayout.jsx';
import AdminLayout from '../components/Layout/AdminLayout/AdminLayout.jsx';
import DefaultLayout from '../components/Layout/DefaultLayout/defaultLayout.jsx';
import ErrorPage from '../pages/ErrorPage/ErrorPage.jsx';
import LandingPage from '../pages/LandingPage/LandingPage.jsx';
import EditProfilePage from '../pages/ProfilePage/EditProfilePage.jsx';
import MyEvents from '../pages/Event/MyOrganizedEvents/MyOrganizedEvent.jsx';
import CreateEventPage from '../pages/Event/CreateEventPage.jsx';
import UpdateEventPage from '../pages/Event/UpdateEventPage.jsx';
import BrowseEvent from "@/pages/Event/BrowseEvent.jsx";
import EventDetailPage from "@/pages/Event/EventDetails.jsx";
import SidebarLayout from "@/components/Layout/SidebarLayout.jsx";
import eventItems from "@/components/SidebarItems/Event.js";
import userItems from "@/components/SidebarItems/User.js";
import DiscussionPage from "@/pages/Discussion/DiscussionPage.jsx";
import MyJoinedEvent from "@/pages/Event/MyJoinedEvents/MyJoinedEvent.jsx";

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
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <BrowseEvent /> }],
            },
        ],
    },
    {
        path: '/event/organized',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <MyEvents /> }],
            },
        ],
    },
    {
        path: '/event/joined',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <MyJoinedEvent /> }],
            },
        ],
    },
    {
        path: '/event/:eventId',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <EventDetailPage /> }],
            },
        ],
    },
    {
        path: '/event/create',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <CreateEventPage /> }],
            },
        ],
    },
    {
        path: '/event/update/:eventId',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <SidebarLayout items={eventItems} />,
                children: [{ path: '', element: <UpdateEventPage /> }],
            },
        ],
    },
    // {
    //     path: '/admin/dashboard',
    //     element: <ProtectedRoute allowedRoles={['admin']} />,
    //     children: [
    //         {
    //             element: <AdminLayout />,
    //             children: [{ path: '', element: <UserDashboard /> }],
    //         },
    //     ],
    // },
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
        path: '/dashboard',
        element: <ProtectedRoute allowedRoles={['user']} />,
        children: [
            {
                element: <DefaultLayout />,
                children: [{ path: '', element: <UserDashboard /> }],
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
                element: <SidebarLayout items={userItems} />,
                children: [{ path: '', element: <EditProfilePage /> }],
            },
        ],
    },
    {
        path: '/discussions', // New route for the Edit Profile page
        element: <ProtectedRoute allowedRoles={['user', 'admin']} />, // Allow both user and admin roles
        children: [
            {
                element: <SidebarLayout items={userItems} />,
                children: [{ path: '', element: <DiscussionPage /> }],
            },
        ],
    },
    {
        path: '/discussions/:id', // New route for the Edit Profile page
        element: <ProtectedRoute allowedRoles={['user', 'admin']} />, // Allow both user and admin roles
        children: [
            {
                element: <SidebarLayout items={userItems} />,
                children: [{ path: '', element: <DiscussionPage /> }],
            },
        ],
    }
];

export default routes;
