// Mock data for events
export const mockEvents = [
  {
    id: 1,
    title: "Annual Tech Conference 2023",
    date: "2023-11-15",
    location: "San Francisco, CA",
    attendees: 250,
    discussionCount: 24,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 2,
    title: "Product Launch: NextGen App",
    date: "2023-12-05",
    location: "New York, NY",
    attendees: 120,
    discussionCount: 18,
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
  },
  {
    id: 3,
    title: "Web Development Workshop",
    date: "2023-11-28",
    location: "Chicago, IL",
    attendees: 75,
    discussionCount: 12,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 4,
    title: "Networking Mixer",
    date: "2023-12-15",
    location: "Austin, TX",
    attendees: 100,
    discussionCount: 8,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    date: "2024-01-10",
    location: "Seattle, WA",
    attendees: 150,
    discussionCount: 15,
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 6,
    title: "Design Systems Symposium",
    date: "2024-01-25",
    location: "Portland, OR",
    attendees: 85,
    discussionCount: 10,
    image: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: 7,
    title: "AI and Machine Learning Summit",
    date: "2024-02-08",
    location: "Boston, MA",
    attendees: 200,
    discussionCount: 22,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
]

// Mock data for discussions
export const mockDiscussions = [
  {
    id: 101,
    eventId: 1,
    title: "What sessions are you most excited about?",
    content: "I'm looking forward to the keynote on AI advancements. Anyone else planning to attend that one?",
    author: {
      id: 201,
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    createdAt: "2023-10-25T14:32:00Z",
    likes: 12,
    replies: 8,
    lastReplyTime: "2 hours ago",
  },
  {
    id: 102,
    eventId: 1,
    title: "Hotel recommendations near the venue?",
    content:
      "This is my first time in San Francisco. Can anyone recommend good hotels within walking distance of the conference center?",
    author: {
      id: 202,
      name: "Sarah Miller",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    createdAt: "2023-10-28T09:15:00Z",
    likes: 7,
    replies: 15,
    lastReplyTime: "1 day ago",
  },
  {
    id: 103,
    eventId: 1,
    title: "Looking for a study group for the workshop",
    content:
      "I'm attending the advanced React workshop on day 2. Would anyone be interested in forming a study group to review the material afterward?",
    author: {
      id: 203,
      name: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    createdAt: "2023-11-01T16:45:00Z",
    likes: 9,
    replies: 6,
    lastReplyTime: "5 hours ago",
  },
  {
    id: 104,
    eventId: 2,
    title: "Features you hope to see in the new app",
    content:
      "I've been following the development of this app for a while. I'm really hoping they include offline mode. What features are you all looking forward to?",
    author: {
      id: 204,
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    createdAt: "2023-11-10T11:20:00Z",
    likes: 18,
    replies: 22,
    lastReplyTime: "30 minutes ago",
  },
  {
    id: 105,
    eventId: 2,
    title: "After-party details?",
    content:
      "Has anyone heard about any after-parties following the product launch? Would love to network more after the main event.",
    author: {
      id: 205,
      name: "Michael Thompson",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    createdAt: "2023-11-12T13:50:00Z",
    likes: 6,
    replies: 4,
    lastReplyTime: "3 days ago",
  },
  {
    id: 106,
    eventId: 3,
    title: "Prerequisites for the advanced session",
    content:
      "I'm planning to attend the advanced JavaScript session. Does anyone know what the prerequisites are? Should I brush up on any specific topics?",
    author: {
      id: 206,
      name: "Jessica Lee",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    createdAt: "2023-11-05T10:30:00Z",
    likes: 4,
    replies: 7,
    lastReplyTime: "1 week ago",
  },
  {
    id: 107,
    eventId: 3,
    title: "Looking for project collaborators",
    content:
      "I'm working on a web app for environmental monitoring and looking for collaborators. If you're attending the workshop and interested in environmental tech, let's connect!",
    author: {
      id: 207,
      name: "Ryan Garcia",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    createdAt: "2023-11-08T15:15:00Z",
    likes: 11,
    replies: 9,
    lastReplyTime: "2 days ago",
  },
  {
    id: 108,
    eventId: 4,
    title: "First-time attendee tips?",
    content:
      "This will be my first networking event in the tech industry. Any tips for making the most of it? I'm a bit nervous!",
    author: {
      id: 208,
      name: "Olivia Wilson",
      avatar: "https://randomuser.me/api/portraits/women/71.jpg",
    },
    createdAt: "2023-11-20T09:45:00Z",
    likes: 15,
    replies: 12,
    lastReplyTime: "6 hours ago",
  },
  {
    id: 109,
    eventId: 5,
    title: "Pitch deck feedback",
    content:
      "Would anyone be willing to review my pitch deck before the competition? I'm presenting a SaaS solution for small businesses.",
    author: {
      id: 209,
      name: "Daniel Kim",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    createdAt: "2023-12-05T14:00:00Z",
    likes: 8,
    replies: 5,
    lastReplyTime: "4 days ago",
  },
  {
    id: 110,
    eventId: 6,
    title: "Design system implementation challenges",
    content:
      "I'm currently implementing a design system at my company and facing some challenges with developer adoption. Anyone else experienced this?",
    author: {
      id: 210,
      name: "Sophia Martinez",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    createdAt: "2023-12-15T11:30:00Z",
    likes: 7,
    replies: 11,
    lastReplyTime: "1 day ago",
  },
  {
    id: 111,
    eventId: 7,
    title: "Ethical considerations in AI development",
    content:
      "I'm hoping the summit addresses ethical considerations in AI. What specific topics do you think should be covered?",
    author: {
      id: 211,
      name: "James Wilson",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    createdAt: "2023-12-20T16:20:00Z",
    likes: 22,
    replies: 18,
    lastReplyTime: "12 hours ago",
  },
]
