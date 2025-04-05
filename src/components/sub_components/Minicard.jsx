import React from "react";
import { User, MessageCircle, Bell, Info, Calendar } from "lucide-react";

// Minicard component for displaying various types of cards (e.g., profile, message, notification, event, etc.)
const Minicard = ({ type, avatar, title, subtitle, timestamp, status, content, eventTime }) => {
    // Function to render a fallback icon based on the type of the card
    const renderIcon = () => {
        switch (type) {
            case "profile":
                return <User className="w-12 h-12 text-gray-500" />;
            case "message":
                return <MessageCircle className="w-12 h-12 text-gray-500" />;
            case "notification":
                return <Bell className="w-12 h-12 text-gray-500" />;
            case "event":
                return <Calendar className="w-12 h-12 text-gray-500" />;
            case "info":
                return <Info className="w-12 h-12 text-gray-500" />;
            default:
                return <Info className="w-12 h-12 text-gray-500" />;
        }
    };

    return (
        // Main container for the card
        <div className="flex items-center p-4 bg-black text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Avatar or Icon Section */}
            <div className="relative flex-shrink-0">
                {avatar ? (
                    // Render avatar if provided
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full"
                    />
                ) : (
                    // Render fallback icon if no avatar is provided
                    renderIcon()
                )}
                {status === "online" && (
                    // Status indicator (e.g., green dot for online status)
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                )}
            </div>

            {/* Content Section */}
            <div className="ml-4 flex-1">
                {/* Title (Username or Event name) */}
                <div className="text-lg font-semibold text-white">{title}</div>
                {/* Subtitle (optional for event, can be name of the organizer) */}
                {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
                {/* Can be used for  latest chat message */}
                {content && <div className="text-sm text-gray-300 mt-2">{content}</div>}
                {/* Event time (optional, for event cards) */}
                {eventTime && <div className="text-sm text-gray-400 mt-2">Event Time: {eventTime}</div>}
            </div>

            {/* Timestamp Section */}
            {timestamp && (
                // Display timestamp on the right side of the card
                <div className="text-xs text-gray-500 ml-4">{timestamp}</div>
            )}
        </div>
    );
};

export default Minicard;