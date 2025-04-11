import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EventCard from '../../components/shared/EventCard.jsx';
import SectionTitle from '../ProfilePage/SectionTitle.jsx';
import Button from '../../components/shared/SubmitButton.jsx';
import {
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    CalendarIcon,
    MapPinIcon,
    UserGroupIcon,
    StarIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { useEvent } from '../../hooks/useEvent.js';
import { toast } from 'sonner';
import { EditIcon } from 'lucide-react';
import {Pagination} from "@heroui/pagination";

const itemPerPage = 9;
function MyEvent() {
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getMyEvent, deleteEvent } = useEvent();
    const location = useLocation();
    const navigate = useNavigate();
    // Fetch events from backend

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getMyEvent({
                    page: currentPage,
                    limit: itemPerPage,
                    isAcs: true,
                });
                setEvents(data);
            } catch (err) {
                toast.error('Error fetching events:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [currentPage]);

    const handleEditButton = (eventId) => {
        // Navigate to the update event page with the event ID
        navigate(`/event/update/${eventId}`);
    };

    const handleChangeCurrentPage = (page) => {
        setCurrentPage(page);
    }


    const handleRemoveEvent = async (id) => {
        // e.preventDefault();
        try {
            const response = await deleteEvent(id);
            if (response.success) {
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event._id !== id)
                );
                toast.success('Event deleted successfully');
            } else {
                toast.error('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            toast.error('Failed to delete event' || response.message);
        }
    };


    const handleLinkClick = (e) => {
        if (location.pathname === '/events') {
            e.preventDefault(); // Ngăn chặn điều hướng nếu đã ở cùng route
        }
    };

    return (
        <div className="h-auto min-h-screen">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div className="my-5">
                        <SectionTitle
                            title={'Organized Events'}
                            subtitle={'List of event you have created'}
                        />
                    </div>
                    <Link to="/event/create" onClick={handleLinkClick}>
                        <Button className={'bg-black text-white'}>
                            <PlusCircleIcon className="h-5 w-5" />
                            Create new
                        </Button>
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
                <div className={"flex items-center justify-center"}>
                    <Pagination loop showControls color="success" initialPage={1} total={5} />;
                </div>
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => {
                        return (
                            <EventCard
                                key={event._id}
                                event={event}
                                actions={[
                                    {
                                        button: (
                                            <Button
                                                onClick={() =>
                                                    handleRemoveEvent(event._id)
                                                }
                                                className="flex items-center gap-2 bg-red-500 px-3 text-white"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                Delete
                                            </Button>
                                        ),
                                        onClick: () => {},
                                    },
                                    {
                                        button: (
                                            <Button
                                                onClick={() =>
                                                    handleEditButton(event._id)
                                                }
                                                className="gap-2 bg-blue-500 px-3 text-white"
                                            >
                                                <EditIcon className="h-5 w-5" />
                                                Edit
                                            </Button>
                                        ),
                                        onClick: () => {},
                                    },
                                ]}
                            />
                        );
                    })}
                </div>

                {!loading && events.length === 0 && (
                    <div className="mt-8 rounded-lg bg-white py-16 text-center shadow-sm">
                        <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-lg text-gray-500">
                            No events found. Create your first event!
                        </p>
                        <Link
                            to="/event/create"
                            onClick={handleLinkClick}
                            className="mt-4 inline-block"
                        >
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

export default React.memo(MyEvent);
