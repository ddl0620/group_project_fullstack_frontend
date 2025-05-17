import { Calendar, Globe, Plus, Tickets, UserIcon, Users } from 'lucide-react';

const adminManagementItems = [
  {
    title: 'Overview',
    url: '/management',
    icon: Globe,
  },
  {
    title: 'User Management',
    url: '/management/user',
    icon: Users,
  },
  {
    title: 'Event Management',
    url: '/management/event',
    icon: Tickets,
  },
];

export default adminManagementItems;
