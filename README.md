# Eventify - Event Management Frontend

Eventify is a comprehensive event management platform designed to streamline the process of creating, managing, and attending events. This repository contains the frontend implementation of the Eventify application, built with modern web technologies to provide a responsive and intuitive user experience.

## About This Project

This project is a university group assignment for the Fullstack Development course at RMIT University. It was developed by Group 5 as part of their coursework requirements. The frontend application interfaces with a backend API to provide a complete event management solution.

## Product Information

- **Live Demo**: [eventify.solve.vn](https://eventify.solve.vn)
- **Demo Video**: [Link to demo video](https://rmiteduau-my.sharepoint.com/:v:/r/personal/s4029308_rmit_edu_vn/Documents/Full%20Stack%20Development/video%20presentation/Group_5_2.mp4?csf=1&web=1&e=JMxz2B&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)

## Technology Stack

The Eventify frontend is built using the following technologies:

- **Vite**: Build tool and development server
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Redux**: State management library
- **React Router DOM**: Routing library for React applications

## Features

Eventify is a comprehensive event planning and management system that offers the following features:

### Event Creation and Management

Users can create both public and private events with detailed information. Public events are visible to all registered users, while private events are only accessible to invited participants. Event organizers have full control over event details, including date, time, location, and description.

### User Roles and Permissions

The system supports different user roles (admin, organizer, attendee) with appropriate permissions:

- **Admins** can configure system settings such as the maximum number of active events a user can create and the maximum number of invitations that can be sent.
- **Organizers** can create and manage events, send invitations, and track RSVP responses.
- **Attendees** can view events, respond to invitations, and participate in discussions.

### RSVP System

Users can accept or decline invitations to events. The system tracks all responses, allowing event organizers to manage attendance effectively.

### Discussion Board

Each event includes a discussion board for event-related communication, enabling participants to share information, ask questions, and coordinate details.

### Notification System

The platform includes a robust notification system that:

- Sends reminders to accepted participants to confirm their attendance
- Notifies invited participants who have not yet responded
- Alerts all accepted attendees when event details are updated
- Allows organizers to configure when notifications will be sent

### Dashboard and Analytics

A comprehensive dashboard provides insights into event engagement, including:

- Number of invitations sent
- List of invitation recipients
- RSVP response tracking
- Event participation metrics

### Mobile Responsive Design

The application is fully responsive, ensuring a seamless experience across all devices from desktop computers to mobile phones.

### User Registration and Authentication

Secure user accounts with registration and login functionality, supporting the different user roles with appropriate access controls.

## Project Structure

Below is the detailed structure of the Eventify frontend project, focusing on the core `/src` directory and its key subdirectories:

```
src/
├── components/                  # Reusable UI components
│   ├── auth/                    # Authentication-related components
│   │   ├── AuthProvider.jsx     # Context provider for authentication state
│   │   └── ProtectedRoute.jsx   # Route wrapper for authenticated access control
│   ├── event/                   # Event-specific components
│   │   ├── EventCard.jsx        # Card component for displaying event information
│   │   └── EventList.jsx        # Component for listing multiple events
│   ├── forms/                   # Form components for data input
│   │   ├── EventForm.jsx        # Form for creating and editing events
│   │   ├── LoginForm.jsx        # User login form
│   │   └── RegisterForm.jsx     # User registration form
│   ├── layout/                  # Page layout components
│   │   ├── Footer.jsx           # Footer component for all pages
│   │   ├── Header.jsx           # Header/navigation component
│   │   └── Sidebar.jsx          # Sidebar navigation component
│   └── ui/                      # Basic UI elements
│       ├── Button.jsx           # Reusable button component
│       ├── Card.jsx             # Generic card container component
│       ├── Dropdown.jsx         # Dropdown menu component
│       └── Modal.jsx            # Modal dialog component
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.jsx              # Hook for authentication operations
│   ├── useEvents.jsx            # Hook for event data operations
│   ├── useForm.jsx              # Hook for form handling
│   └── useNotification.jsx      # Hook for notification system
│
├── pages/                       # Page components
│   ├── AboutUs/                 # About Us page
│   ├── Admin/                   # Admin dashboard and settings
│   ├── Dashboard/               # User dashboard with analytics
│   ├── Discussion/              # Event discussion board
│   ├── ErrorPage/               # Error handling pages
│   ├── Event/                   # Event creation and detail pages
│   ├── Feedback/                # User feedback system
│   ├── Home/                    # Home page
│   ├── LandingPage/             # Landing page for new visitors
│   ├── Notification/            # Notification center
│   ├── ProfilePage/             # User profile management
│   ├── SignIn/                  # Login page
│   └── SignUp/                  # Registration page
│
├── services/                    # API and service integrations
│   ├── api.js                   # Base API configuration
│   ├── auth.js                  # Authentication service
│   ├── events.js                # Event data service
│   └── notifications.js         # Notification service
│
├── store/                       # Redux state management
│   ├── actions/                 # Redux actions
│   │   ├── authActions.js       # Authentication actions
│   │   └── eventActions.js      # Event-related actions
│   └── slices/                  # Redux slices (reducers)
│       ├── authSlice.js         # Authentication state slice
│       ├── eventSlice.js        # Event data state slice
│       └── uiSlice.js           # UI state slice
│
├── routes/                      # Application routing configuration
├── helpers/                     # Utility functions and helper modules
├── lib/                         # Third-party library configurations
├── App.css                      # Global application styles
├── App.jsx                      # Main application component
├── index.css                    # Entry point CSS with Tailwind directives
└── main.jsx                     # Application entry point
```

## Environment Variables

The project uses the following environment variables:

```
VITE_API_URL=https://api.solve.vn/
VITE_IS_RELEASE=true
```

These variables should be placed in a `.env` file in the root directory of the project.

## Getting Started

### Prerequisites

Before setting up the Eventify frontend, ensure you have the following installed:

- Node.js (version 14.0.0 or higher)
- npm (version 6.0.0 or higher) or yarn (version 1.22.0 or higher)

### Installation

To set up the development environment for Eventify frontend, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/ddl0620/group_project_fullstack_frontend.git
   cd group_project_fullstack_frontend
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the environment variables:
   ```
   VITE_API_URL=https://api.solve.vn/
   VITE_IS_RELEASE=true
   ```

### Development

To start the development server, run:

```
npm run dev
```

This will start the Vite development server, which provides hot module replacement for a smooth development experience. The application will be available at `http://localhost:5173` by default.

### Building for Production

To create a production build, run:

```
npm run build
```

This will generate optimized production files in the `dist` directory, ready for deployment.

### Preview Production Build

To preview the production build locally, run:

```
npm run preview
```

This will serve the production build locally, allowing you to verify its functionality before deployment.

## Contributors

| Name             | Student ID | Role        | Email                 |
|------------------|------------|-------------|-----------------------|
| Khong Quoc Khanh | 4021494    | Team Lead   | s4021494@rmit.edu.vn  |
| Dao Duc Lam      | 4019052    | Team Member | s4019052@rmit.edu.vn  |
| [Tran Dinh Hai   | 4041605    | Team Member | s4041605@rmit.edu.vn  |
| Luong Chi Bach   | 4029308    | Team Member | s4029308@rmit.edu.vn  |
| Duong Bao Ngoc   | s3425449   | Team Member | ss3425449@rmit.edu.vn |

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- RMIT University and the Fullstack Development course instructors for their guidance
- The open-source community for providing the tools and libraries that make this project possible
- All contributors who have helped improve the project

---

For more information or support, please contact the Eventify team or open an issue on GitHub.
