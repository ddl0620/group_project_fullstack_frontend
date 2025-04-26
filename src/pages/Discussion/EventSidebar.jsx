'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Calendar,
    MapPin,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {useNavigate} from "react-router-dom";

const EventSidebar = ({ events, selectedEventId, onEventSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    // Auto-collapse on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-16' : 'w-80'
            }`}
        >
            <div
                className={`relative border-b border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}
            >
                {!isCollapsed && (
                    <>
                        <h2 className="text-xl font-bold text-gray-800">
                            Event Discussions
                        </h2>
                        <div className="relative mt-4">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {isCollapsed && (
                    <div className="flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <Search className="h-5 w-5 text-gray-600" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Search Events
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 -right-3 z-10 -translate-y-1/2 transform rounded-full border border-gray-200 bg-white shadow-sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredEvents.length > 0 ? (
                    <ul
                        className={`${isCollapsed ? 'space-y-2 p-2' : 'divide-y divide-gray-200'}`}
                    >
                        {filteredEvents.map((event) => (
                            <li
                                key={event._id}
                                className={`cursor-pointer transition-colors ${isCollapsed ? 'rounded-md' : ''} ${
                                    selectedEventId === event._id
                                        ? isCollapsed
                                            ? 'bg-blue-100'
                                            : 'bg-blue-50'
                                        : isCollapsed
                                          ? 'hover:bg-gray-100'
                                          : 'hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    navigate(`/discussions/${event._id}`);
                                    console.log(event._id);
                                }
                                }
                            >
                                {isCollapsed ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex justify-center p-2">
                                                    <CustomAvatar
                                                        src={
                                                            event.images[0] ||
                                                            ''
                                                        }
                                                        fallbackText={
                                                            event.title
                                                        }
                                                        alt={event.title}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                className="max-w-xs"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {event.title}
                                                    </p>
                                                    <p className="mt-1 flex items-center text-xs">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        {new Date(
                                                            event.startDate,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                    <p className="mt-1 flex items-center text-xs">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        {event.location}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <CustomAvatar
                                                    src={event.images[0] || ''}
                                                    fallbackText={event.title}
                                                    alt={event.title}
                                                />

                                                <h3 className="truncate text-sm font-medium text-gray-900">
                                                    {event.title}
                                                </h3>
                                            </div>
                                            {/*<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">*/}
                                            {/*    {event.discussionCount}{' '}*/}
                                            {/*</span>*/}
                                        </div>
                                        <div className="mt-2 ml-11 space-y-1">
                                            <p className="flex items-center text-xs text-gray-500">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {new Date(
                                                    event.startDate,
                                                ).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center truncate text-xs text-gray-500">
                                                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">
                                                    {event.location}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div
                        className={`text-center text-gray-500 ${isCollapsed ? 'p-2' : 'p-4'}`}
                    >
                        {isCollapsed ? (
                            <div className="flex justify-center">
                                <span className="text-xs">No events</span>
                            </div>
                        ) : (
                            'No events found'
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventSidebar;
