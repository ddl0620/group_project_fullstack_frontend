import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../../components/sub_components/EventCard.jsx';
import SectionTitle from '../ProfilePage/SectionTitle.jsx';
import Button from '../../components/sub_components/SubmitButton.jsx';
import {
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    CalendarIcon,
    MapPinIcon,
    UserGroupIcon,
    StarIcon,
} from '@heroicons/react/24/outline';
import { useEvent } from '../../hooks/useEvent.js';

function EventPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAllEvents } = useEvent();

    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // Replace with your actual API endpoint
                const data = await getAllEvents({
                    page: 1,
                    limit: 10,
                    isAcs: true,
                });
                setEvents(data);
                console.log(data);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRemoveEvent = async (id) => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            // Update UI after successful deletion
            setEvents(events.filter((event) => event._id !== id));
        } catch (err) {
            console.error('Error deleting event:', err);
            // Handle error (show notification, etc.)
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Format time for display
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <div className="bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Events
                        </h2>
                        <p className="text-sm text-gray-500">
                            Discover and manage your events
                        </p>
                    </div>
                    <Link to="/event/create">
                        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                            <PlusCircleIcon className="h-5 w-5" />
                            Create New Event
                        </button>
                    </Link>
                </div>

                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                )}

                {error && (
                    <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => {
                        const eventType = event.type?.toUpperCase() || 'EVENT';
                        const isPublic = event.isPublic;

                        return (
                            <div
                                key={event._id}
                                className="flex h-full flex-col overflow-hidden rounded-md bg-gray-100"
                            >
                                {/* Event card header with image and badges */}
                                <div className="relative">
                                    {/* Image */}
                                    <div className="h-32 bg-gray-200">
                                        {event.images &&
                                        event.images.length > 0 ? (
                                            <img
                                                src={event.images[0]}
                                                alt={event.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xl font-medium text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Event type badge - top left */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                            {eventType}
                                        </span>
                                    </div>

                                    {/* Public badge - top right */}
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-block rounded bg-white px-2 py-1 text-xs font-medium text-gray-800">
                                            {isPublic ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                </div>

                                {/* Event content - Fixed layout with consistent spacing */}
                                <div className="flex flex-grow flex-col justify-between p-4">
                                    {/* Top content section */}
                                    <div>
                                        {/* Title */}
                                        <h3 className="mb-1 text-base font-medium text-gray-900">
                                            {event.title}
                                        </h3>

                                        {/* Location */}
                                        <p className="mb-1 text-xs text-gray-600">
                                            {event.location ||
                                                'No location specified'}
                                        </p>

                                        {/* Date and time */}
                                        <p className="mb-3 text-xs text-gray-600">
                                            {formatDate(event.startDate)} |{' '}
                                            {formatTime(event.startDate)}
                                        </p>

                                        {/* Description - always include a container with fixed height */}
                                        <div className="mb-3 min-h-[40px]">
                                            {event.description ? (
                                                <p className="line-clamp-2 text-xs text-gray-600">
                                                    {event.description}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">
                                                    {event.isPublic
                                                        ? 'Event public for every one'
                                                        : 'Private event'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom content - always at the bottom */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">
                                            {event.participants
                                                ? `${event.participants.length} participants`
                                                : '0 participants'}
                                        </p>
                                        <p className="text-xs font-medium text-gray-900">
                                            {event.price || 'Free'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 bg-white p-2">
                                    <Link
                                        to={`/event/update/${event._id}`}
                                        className="flex-1"
                                    >
                                        <button className="flex w-full items-center justify-center gap-1 rounded bg-blue-500 px-3 py-2 text-sm text-white transition-colors hover:bg-blue-600">
                                            <PencilIcon className="h-4 w-4" />
                                            Update
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleRemoveEvent(event._id)
                                        }
                                        className="flex flex-1 items-center justify-center gap-1 rounded bg-red-500 px-3 py-2 text-sm text-white transition-colors hover:bg-red-600"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!loading && events.length === 0 && (
                    <div className="mt-8 rounded-lg bg-white py-16 text-center shadow-sm">
                        <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-lg text-gray-500">
                            No events found. Create your first event!
                        </p>
                        <Link to="/event/create" className="mt-4 inline-block">
                            <button className="flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-white hover:bg-gray-700">
                                <PlusCircleIcon className="h-5 w-5" />
                                <span>Create New Event</span>
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventPage;
