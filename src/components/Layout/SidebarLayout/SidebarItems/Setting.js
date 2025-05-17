import { Mail, Shield, UserIcon, UserRoundPen } from 'lucide-react';

const settingItems = [
  {
    title: 'My Profile',
    url: '/profile',
    icon: UserIcon,
  },
  {
    title: 'General',
    url: '/profile/edit',
    icon: UserRoundPen,
  },
  {
    title: 'Security',
    url: '/profile/password',
    icon: Shield,
  },
  {
    title: 'Email',
    url: '/profile/email',
    icon: Mail,
  },
];

export default settingItems;
