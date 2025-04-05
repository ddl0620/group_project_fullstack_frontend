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
import EventCard from '../components/sub_components/EventCard.jsx';


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
                    flexDirection: 'column',
                    gap: '50px', // Increased gap between sections
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1a1a1a',
                }}
            >
                {/* Event Card Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Event Card Test</h2>
                    <Minicard
                        type="event"
                        avatar="https://techvccloud.mediacdn.vn/2018/12/22/1supq92uyknelefyyf7ughw-15454498606631836572894-crop-1545449864895548482406.png"
                        title="Hackathon 2023"
                        subtitle="Organized by TechVC"
                        eventTime={"April 15, 2023, 10:00 AM - 5:00 PM"}
                        timestamp="12:18 pm"
                        status="online"
                    />
                </div>
    
                {/* Profile Card Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Profile Card Test</h2>
                    <Minicard type="profile" title="Profile Card" subtitle="No avatar provided" />
                </div>
    
                {/* Message Card Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Message Card Test</h2>
                    <Minicard type="message" title="Message Card" subtitle="No avatar provided" />
                </div>
    
                {/* Notification Card Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Notification Card Test</h2>
                    <Minicard type="notification" title="Notification Card" subtitle="No avatar provided" />
                </div>
    
                {/* Event Card Without Avatar Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Event Card Without Avatar Test</h2>
                    <Minicard type="event" title="Event Card" subtitle="No avatar provided" />
                </div>
    
                {/* Info Card Test */}
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Info Card Test</h2>
                    <Minicard type="info" title="Info Card" subtitle="No avatar provided" />
                </div>
            </div>
        ),
    },
    {
        path: "/test-eventcard",
        element: (
            <div
            style={{
              padding: "20px",
              fontFamily: "Arial, sans-serif",
              display: "flex",
              flexDirection: "column",
              gap: "50px",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white", // Dark grey background
              minHeight: "100vh", // Ensure the container takes up the full viewport height
            }}
          >
            <EventCard
              image="https://techvccloud.mediacdn.vn/2018/12/22/1supq92uyknelefyyf7ughw-15454498606631836572894-crop-1545449864895548482406.png"
              location="TechVC Headquarters"
              venue="Hackathon 2023"
              date="Sat. 15"
              time="10h - 17h"
              price={50}
              tags={["Tech", "Innovation"]}
              distance="5 km"
              rating={4.8}
              link="/event/1"
            />
          </div>
        ),
      }    
];

export default routes;