// src/pages/MyEvent.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EventCard from '../../components/shared/EventCard.jsx';
import SectionTitle from '../ProfilePage/SectionTitle.jsx';
import Button from '../../components/shared/SubmitButton.jsx';
import {
    PlusCircleIcon,
    TrashIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';
import { EditIcon } from 'lucide-react';
import { Pagination } from '@heroui/pagination';
import {useEvent} from "@/hooks/useEvent.js";
import {AlertDialogUtils} from "@/helpers/AlertDialogUtils.jsx";
const itemsPerPage = 9;

function MyOrganizedEvents() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getMyEvents, deleteEvent, loading, error } = useEvent();
    const myEvents = useSelector((state) => state.event.myEvents);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        const fetchEvents = async () => {
            await getMyEvents({
                page: currentPage,
                limit: itemsPerPage,
                isAcs: true,
            });
        };
        fetchEvents();
    }, [currentPage]); // Chỉ phụ thuộc vào currentPage

    const handleEditButton = (eventId) => {
        navigate(`/event/update/${eventId}`);
    };

    const handleRemoveEvent = async (id) => {
        const confirmed = await AlertDialogUtils.warning({
            title: "Delete Event?",
            description: "Are you sure you want to delete this event? This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
        });

        if (!confirmed) return;
        await deleteEvent(id);
    };

    const handleLinkClick = (e) => {
        if (location.pathname === '/events') {
            e.preventDefault();
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="h-auto min-h-screen">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
                    <div className="my-5">
                        <SectionTitle
                            title={'Organized Events'}
                            subtitle={'List of events you have created'}
                        />
                    </div>
                    <Link to="/event/create" onClick={handleLinkClick}>
                        <Button className={'bg-black text-white'}>
                            <PlusCircleIcon className="h-5 w-5" />
                            Create new
                        </Button>
                    </Link>
                </div>

                {/* Phân trang */}
                {totalItems > 0 && (
                    <div className="mb-6 flex justify-center">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            showControls={true}
                            loop={true}
                            color="success"
                            className="rounded-full"
                        />
                    </div>
                )}

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
                    {myEvents.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            actions={[
                                {
                                    button: (
                                        <Button
                                            className="flex items-center gap-2 border border-red-300 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
                                        >
                                            <TrashIcon className="h-5 w-5 text-red-400" />
                                            Delete
                                        </Button>
                                    ),
                                    onClick: () => handleRemoveEvent(event._id),
                                },
                                {
                                    button: (
                                        <Button
                                            className="flex items-center gap-2 border border-blue-500 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
                                        >
                                            <EditIcon className="h-5 w-5 text-blue-500" />
                                            Edit
                                        </Button>
                                    ),
                                    onClick: () => handleEditButton(event._id),
                                },
                                {
                                    button: (
                                        <Button
                                            className="flex items-center gap-2 border border-green-500 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
                                        >
                                            <EyeIcon className="h-5 w-5 text-green-700" />
                                            View Details
                                        </Button>
                                    ),
                                    onClick: () => handleEditButton(event._id),
                                },
                            ]}
                        />
                    ))}
                </div>

                {!loading && myEvents.length === 0 && (
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
                            <Button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700">
                                <PlusCircleIcon className="h-5 w-5" />
                                <span>Create New Event</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(MyOrganizedEvents);