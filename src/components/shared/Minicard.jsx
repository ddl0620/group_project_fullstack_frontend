import React from 'react';
import { User, MessageCircle, Bell, Info, Calendar } from 'lucide-react';

// Minicard component for displaying various types of cards (e.g., profile, message, notification, event, etc.)
const Minicard = ({
  type,
  avatar,
  title,
  subtitle,
  timestamp,
  status,
  content,
  eventTime,
}) => {
  // Function to render a fallback icon based on the type of the card
  const renderIcon = () => {
    switch (type) {
      case 'profile':
        return <User className="h-12 w-12 text-gray-500" />;
      case 'message':
        return <MessageCircle className="h-12 w-12 text-gray-500" />;
      case 'notification':
        return <Bell className="h-12 w-12 text-gray-500" />;
      case 'event':
        return <Calendar className="h-12 w-12 text-gray-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-gray-500" />;
      default:
        return <Info className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    // Main container for the card
    <div className="flex items-center rounded-lg bg-black p-4 text-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      {/* Avatar or Icon Section */}
      <div className="relative flex-shrink-0">
        {avatar ? (
          // Render avatar if provided
          <img src={avatar} alt="Avatar" className="h-14 w-14 rounded-full" />
        ) : (
          // Render fallback icon if no avatar is provided
          renderIcon()
        )}
        {status === 'online' && (
          // Status indicator (e.g., green dot for online status)
          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-black bg-green-500"></span>
        )}
      </div>

      {/* Content Section */}
      <div className="ml-4 flex-1">
        {/* Title (Username or Event name) */}
        <div className="text-lg font-semibold text-white">{title}</div>
        {/* Subtitle (optional for event, can be name of the organizer) */}
        {subtitle && (
          <div className="mt-1 text-sm text-gray-400">{subtitle}</div>
        )}
        {/* Can be used for  latest chat message */}
        {content && <div className="mt-2 text-sm text-gray-300">{content}</div>}
        {/* Event time (optional, for event cards) */}
        {eventTime && (
          <div className="mt-2 text-sm text-gray-400">
            Event Time: {eventTime}
          </div>
        )}
      </div>

      {/* Timestamp Section */}
      {timestamp && (
        // Display timestamp on the right side of the card
        <div className="ml-4 text-xs text-gray-500">{timestamp}</div>
      )}
    </div>
  );
};

export default Minicard;
