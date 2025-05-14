import { Calendar, Handshake, MessageSquare, PartyPopper, Plus, TicketPlus, Tickets, UserIcon } from 'lucide-react';

const eventItems = [
  {
    title: 'Create New Event',
    url: '/event/create',
    icon: TicketPlus,
  },
  {
    title: 'All Events',
    url: '/event',
    icon: PartyPopper ,
  },
  {
    title: 'My Organized Events',
    url: '/event/organized',
    icon: Calendar,
  },
  {
    title: 'My Joined Events',
    url: '/event/joined',
    icon: Tickets,
  },
  {
    title: 'Discussions',
    url: '/discussions',
    icon: MessageSquare,
  },
  {
    title: 'Invitation',
    url: '/invitations',
    icon: Handshake,
  },
];

export default eventItems;
