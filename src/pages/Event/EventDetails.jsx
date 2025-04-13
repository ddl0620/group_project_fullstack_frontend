// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Globe,
    Clock,
    Lock,
    Unlock,
    Users,
    MessageSquare,
} from 'lucide-react';
import ImageSlider from '@/components/shared/ImageSlider.jsx';
import SectionTitle from '@/pages/ProfilePage/SectionTitle.jsx';

function EventDetailPage() {
    const { eventId } = useParams(); // Lấy eventId từ URL
    const navigate = useNavigate();
    const { getEventById } = useEvent();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch chi tiết sự kiện
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await getEventById(eventId);
                if (response.success) {
                    setEvent(response.data.event); // Giả định response.data.event chứa dữ liệu sự kiện
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

    // Định dạng ngày giờ
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
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

            {/* Hình ảnh sự kiện (toàn màn hình) */}
            <div className="relative">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <Button
                        onClick={() => navigate('/event')}
                        className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Events
                    </Button>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                {/* Tiêu đề và nút tham gia */}


                {/* Thông tin chi tiết */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Cột thông tin chính */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center">
                        <div className={""}>
                            <ImageSlider classname={"w-"} imageList={event.images} />
                        </div>
                        <div className="mb-8 flex flex-col items-end justify-end">

                            <Button
                                onClick={() => alert("Join Event")}
                                className={`rounded-full px-6 py-3 text-lg font-semibold text-white ${
                                    event.isPublic
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {event.isPublic ? 'Join Event' : 'Request to Join'}
                            </Button>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                                {event.title || 'Untitled Event'}
                            </h1>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                {event.description ||
                                    'No description available.'}
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>
                                        <strong>Start:</strong>{' '}
                                        {formatDateTime(event.startDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>
                                        <strong>End:</strong>{' '}
                                        {formatDateTime(event.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <MapPin className="h-5 w-5 text-red-500" />
                                    <span>{event.location || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    {event.type === 'ONLINE' ? (
                                        <Globe className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-purple-500" />
                                    )}
                                    <span>
                                        {event.type === 'ONLINE'
                                            ? 'Online Event'
                                            : 'Offline Event'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    {event.isPublic ? (
                                        <Unlock className="h-5 w-5 text-teal-500" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-orange-500" />
                                    )}
                                    <span>
                                        {event.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                    <span>
                                        {event.participants?.length || 0}{' '}
                                        Participants
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột Discussion */}
                    {/*<div className="lg:col-span-1 h-full min-h-full">*/}
                    {/*    <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">*/}
                    {/*        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-gray-900">*/}
                    {/*            <MessageSquare className="h-6 w-6 text-blue-500" />*/}
                    {/*            Discussion*/}
                    {/*        </h2>*/}
                    {/*        <div className="max-h-96 space-y-4 overflow-y-auto">*/}
                    {/*            /!* Placeholder cho tin nhắn *!/*/}
                    {/*            <div className="rounded-lg bg-gray-100 p-4">*/}
                    {/*                <p className="text-sm text-gray-600 italic">*/}
                    {/*                    No messages yet. Start the conversation!*/}
                    {/*                </p>*/}
                    {/*            </div>*/}
                    {/*            /!* Placeholder cho một tin nhắn giả *!/*/}
                    {/*            <div className="flex items-start gap-3">*/}
                    {/*                <div className="h-10 w-10 rounded-full bg-gray-300"></div>*/}
                    {/*                <div>*/}
                    {/*                    <p className="text-sm font-medium text-gray-900">*/}
                    {/*                        John Doe*/}
                    {/*                    </p>*/}
                    {/*                    <p className="text-sm text-gray-600">*/}
                    {/*                        Looking forward to this event!*/}
                    {/*                    </p>*/}
                    {/*                    <p className="mt-1 text-xs text-gray-400">*/}
                    {/*                        2 hours ago*/}
                    {/*                    </p>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        /!* Input để gửi tin nhắn (placeholder) *!/*/}
                    {/*        <div className="mt-4 flex items-center gap-2">*/}
                    {/*            <input*/}
                    {/*                type="text"*/}
                    {/*                placeholder="Type a message..."*/}
                    {/*                className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"*/}
                    {/*                disabled*/}
                    {/*            />*/}
                    {/*            <Button*/}
                    {/*                className="bg-blue-500 text-white hover:bg-blue-600"*/}
                    {/*                disabled*/}
                    {/*            >*/}
                    {/*                Send*/}
                    {/*            </Button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    );
}

export default EventDetailPage;
