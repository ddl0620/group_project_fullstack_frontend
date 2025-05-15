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
import CreateEventPage from '../pages/Event/CreateEvent/CreateEventPage.jsx';
import BrowseEvent from '@/pages/Event/BrowseEvent.jsx';
import EventDetailPage from '@/pages/Event/EventDetails.jsx';
import SidebarLayout from '@/components/Layout/SidebarLayout.jsx';
import eventItems from '@/components/SidebarItems/Event.js';
import settingItems from '@/components/SidebarItems/Setting.js';
import DiscussionPage from '@/pages/Discussion/DiscussionPage.jsx';
import MyJoinedEvent from '@/pages/Event/MyJoinedEvents/MyJoinedEvent.jsx';
import userItems from '@/components/SidebarItems/User.js';
import DiscussionThreadList from '@/pages/Discussion/DiscussionPost/DiscussionThreadList.jsx';
import NotificationsPage from '@/pages/Notification/NotificationPage.jsx';
import UpdatePasswordPage from '@/pages/ProfilePage/UpdatePasswordPage.jsx';
import UpdateEmailPage from '@/pages/ProfilePage/UpdateEmailPage.jsx';
import ProfilePage from '@/pages/ProfilePage/ProfilePage.jsx';
import AdminDashboard from '@/pages/Dashboard/Admin/AdminDashBoard.jsx';
import UserManagement from '@/pages/Admin/UserManagement/UserManagement.jsx';
import adminManagementItems from '@/components/SidebarItems/AdminManagement.js';
import EventManagement from '@/pages/Admin/EventManagement/EventManagement.jsx';
import AboutPage from '@/pages/AboutUs/AboutUs.jsx';
import MyInvitations from '@/pages/Event/MyEmailInvitations.jsx';
import FeedbackPage from "@/pages/Feedback/Feedback.jsx";
import contactItems from '@/components/SidebarItems/Contact.js';

const ProtectedRoute = ({ allowedRoles, restrictedPaths = [] }) => {
  const { isAuthenticated, role } = useSelector((state) => state.user);
  const currentPath = window.location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace={true} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace={true} />;
  }

  if (restrictedPaths.includes(currentPath) && role !== 'admin') {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
};

const AuthenticatedRoute = () => {
  const { isAuthenticated, role } = useSelector((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
};

const routes = [
  {
    path: '/',
    children: [
      {
        element: <UserLayout />,
        children: [{ path: '', element: <LandingPage /> }],
      },
    ],
  },
  {
    path: '/sign-in',
    element: <AuthenticatedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [{ path: '', element: <Login /> }],
      },
    ],
  },
  {
    path: '/sign-up',
    element: <AuthenticatedRoute />,
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
    path: '/about-us',
    element: <SidebarLayout title={'Contact'} items={contactItems} />,
    children: [{ path: '', element: <AboutPage /> }],
  },
  // {
  //   path: '/feedback',
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       element: <DefaultLayout />,
  //       children: [{ path: '', element: <FeedbackPage /> }],
  //     },
  //   ],
  // },
  {
    path: '*',
    element: <Navigate to="/error" replace={false} />,
  },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['user', 'admin']} />,
    children: [
      {
        element: (
          <SidebarLayout title={'Contact'} items={contactItems} />
        ),
        children: [
          { path: 'about-us', element: <AboutPage /> },
          { path: 'feedback', element: <FeedbackPage /> },
        ],
      },
      {
        element: (
          <SidebarLayout title={'Event Management'} items={eventItems} />
        ),
        children: [
          { path: 'event', element: <BrowseEvent /> },
          { path: 'event/organized', element: <MyEvents /> },
          { path: 'event/joined', element: <MyJoinedEvent /> },
          { path: 'event/:eventId', element: <EventDetailPage /> },
          { path: 'event/create', element: <CreateEventPage /> },
          { path: 'event/update/:eventId', element: <CreateEventPage /> },
          { path: '/discussions', element: <DiscussionPage /> },
          { path: '/invitations', element: <MyInvitations /> },
          { path: '/discussions/:eventId', element: <DiscussionPage /> },
        ],
      },
      // Group using user sidebar
      {
        element: (
          <SidebarLayout title={'Profile Setting'} items={settingItems} />
        ),
        children: [
          { path: 'profile/', element: <ProfilePage /> },
          { path: 'profile/edit', element: <EditProfilePage /> },
          { path: 'profile/password', element: <UpdatePasswordPage /> },
          { path: 'profile/email', element: <UpdateEmailPage /> },
        ],
      },
      // Dashboard route (not using sidebar layout)
      {
        element: <SidebarLayout title={'Dashboard'} items={userItems} />,
        children: [
          { path: '/dashboard', element: <UserDashboard /> },
          // { path: '/discussions', element: <DiscussionPage /> },
          // { path: '/discussions/:eventId', element: <DiscussionPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
        ],
      },
      // Home page with user layout
      {
        path: 'home',
        element: <UserLayout />,
        children: [{ path: '', element: <Home /> }],
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute
        allowedRoles={['admin']}
        restrictedPaths={[
          '/management',
          '/management/user',
          '/management/event',
          '/dashboard/admin',
        ]}
      />
    ),
    children: [
      // Group using admin sidebar
      {
        element: (
          <SidebarLayout title={'Management'} items={adminManagementItems} />
        ),
        children: [
          { path: 'management', element: <AdminDashboard /> },
          { path: 'management/user', element: <UserManagement /> },
          { path: 'management/event', element: <EventManagement /> },
          { path: 'event/:eventId', element: <EventDetailPage /> },
          { path: 'event/create', element: <CreateEventPage /> },
          { path: 'event/update/:eventId', element: <CreateEventPage /> },
        ],
      },
      // Dashboard route for admin
      {
        element: <SidebarLayout title={'Dashboard'} items={userItems} />,
        children: [{ path: 'dashboard/admin', element: <AdminDashboard /> }],
      },
    ],
  },
];

export default routes;
