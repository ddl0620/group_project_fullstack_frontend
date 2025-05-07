export const navbarItems = [
  {
    path: '/',
    title: 'Home',
    roles: ['user', 'admin', 'unauthenticated'],
  },
  {
    path: '/event',
    title: 'Events',
    roles: ['user', 'admin'],
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    roles: ['user', 'admin'],
  },
  // {
  //   path: '/sign-in',
  //   title: 'Sign in',
  // },
  // {
  //   path: '/sign-up',
  //   title: 'Sign Up',
  // },
  {
    path: '/management',
    title: 'Admin',
    roles: ['admin'],
  },
];
