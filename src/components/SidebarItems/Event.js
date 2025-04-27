import { Calendar, Plus, UserIcon } from 'lucide-react';

const eventItems = [
  {
    title: 'Create New Event',
    url: '/event/create',
    icon: Plus,
  },
  {
    title: 'All Events',
    url: '/event',
    icon: UserIcon,
  },
  {
    title: 'My Organized Events',
    url: '/event/organized',
    icon: Calendar,
  },
  {
    title: 'My Joined Events',
    url: '/event/joined',
    icon: Calendar,
  },
];

export default eventItems;
