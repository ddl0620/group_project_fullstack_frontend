// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent.js';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Globe,
    Clock,
    Lock,
    Unlock,
    Users,
    Timer,
} from 'lucide-react';
import ImageSlider from '@/components/shared/ImageSlider.jsx';
import SectionTitle from '@/pages/ProfilePage/SectionTitle.jsx';
import Button from "@/components/shared/SubmitButton.jsx";
import { CustomAvatar } from "@/components/shared/CustomAvatar.jsx";

function EventDetailPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { getEventById } = useEvent();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await getEventById(eventId);
                if (response.success) {
                    setEvent(response.data.event);
                } else {
                    throw new Error('Failed to load event data');
                }
            } catch (err) {
                setError(err.message);
                toast.error('Error loading event: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const formatDay = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="py-10 text-center text-red-500">
                {error || 'Event not found.'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="top-4 left-4 z-10 sm:top-6 sm:left-6 relative">
                <Button
                    onClick={() => navigate('/event')}
                    className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </Button>
            </div>

            <div className="py-10 sm:px-6 lg:px-24 max-w-5xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-6">
                    <ImageSlider className="w-full max-w-3xl rounded-xl shadow-md" imageList={event.images} />

                    <div className="w-full rounded-2xl bg-white p-4 sm:p-6 shadow-lg space-y-6 mt-2">
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                            {event.title || 'Untitled Event'}
                        </h1>

                        <p className="italic text-gray-600 text-sm sm:text-base">
                            {event.description}
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-700">Hosted by</span>
                            <CustomAvatar src={""} fallbackText="Khanh" alt="User" />
                        </div>

                        <div className="flex justify-end">
                            <Button className="w-fit bg-blue-500 text-white hover:bg-blue-600">
                                {event.isPublic ? "Join Event" : "Request to Join"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 space-y-4 sm:space-y-6 sm:space-x-8">


                            {/*Participant*/}
                            <div className={"space-y-2"}>
                                <p className={"font-semibold text-2xl border-b pb-2"}>Participants</p>
                                <div className="flex items-center gap-3 text-sm text-gray-700 pb-2">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    <span>{event.participants?.length || 0} Participants</span>
                                </div>
                            </div>

                            {/*Date and Time*/}
                            <div className={"space-y-2"}>
                                <p className={"font-semibold text-2xl border-b pb-2"}>Date and Time</p>
                                <div className="flex items-center gap-3 text-sm text-gray-700 pb-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>
                                    {formatDay(event.startDate)} - {formatDay(event.endDate)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-700 pb-2">
                                    <Timer className="h-5 w-5 text-green-500" />
                                    <span>
                                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                    </span>
                                </div>
                            </div>

                            {/*Event Type*/}
                            <div className={"space-y-2"}>
                                <p className={"font-semibold text-2xl border-b pb-2"}>Event Type</p>

                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    {event.isPublic ? (
                                        <Unlock className="h-5 w-5 text-teal-500" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-orange-500" />
                                    )}
                                    <span>{event.isPublic ? 'Public' : 'Private'}</span>
                                </div>
                            </div>




                            {/*Venue*/}
                            <div className={"space-y-2"}>
                                <p className={"font-semibold text-2xl border-b pb-2"}>Venue</p>

                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                    <span>{event.location || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    {event.type === 'ONLINE' ? (
                                        <Globe className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-purple-500" />
                                    )}
                                    <span>
                                    {event.type === 'ONLINE' ? 'Online Event' : 'Offline Event'}
                                </span>
                                </div>
                            </div>









                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetailPage;