import React from "react";
import { User, MessageCircle, Bell, Info, Calendar } from "lucide-react";

const Minicard = ({ type, avatar, title, subtitle, timestamp, status, content, actions }) => {
    // Render fallback icon based on type
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
        <div className="flex items-center p-4 bg-black text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Avatar or Icon Section */}
            <div className="relative flex-shrink-0">
                {avatar ? (
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-14 h-14 rounded-full"
                    />
                ) : (
                    renderIcon()
                )}
                {status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span>
                )}
            </div>
    
            {/* Content Section */}
            <div className="ml-4 flex-1">
                <div className="text-base font-semibold text-white">{title}</div>
                {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
                {content && <div className="text-sm text-gray-300 mt-2">{content}</div>}
            </div>
    
            {/* Timestamp */}
            {timestamp && <div className="text-xs text-gray-500 ml-4">{timestamp}</div>}
        </div>
    );
};

export default Minicard;