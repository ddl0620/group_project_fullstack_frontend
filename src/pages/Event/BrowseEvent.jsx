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
import {EditIcon, ShowerHeadIcon} from 'lucide-react';
import {Pagination} from "@heroui/pagination";
import {AlertDialogUtils} from "@/helpers/AlertDialog.jsx";

const itemPerPage = 9;
function BrowseEvent() {
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAllEvents, deleteEvent } = useEvent();
    const location = useLocation();
    const navigate = useNavigate();
    // Fetch events from backend

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const data = await getAllEvents({
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
    

    const handleChangeCurrentPage = (page) => {
        setCurrentPage(page);
    }


    const handleShowEvent = async () => {
        // e.preventDefault();
        alert("Show")
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
                            title={'Browse Events'}
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
                                                    handleShowEvent(event._id)
                                                }
                                                className="flex items-center bg-blue-500 text-white"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                                View
                                            </Button>
                                        ),
                                        onClick: () => {},
                                    }
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

export default React.memo(BrowseEvent);
