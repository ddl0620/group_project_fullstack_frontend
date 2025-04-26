// src/pages/DiscussionPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EventSidebar from './EventSidebar';
import DiscussionThreadList from './DiscussionThreadList';
import DiscussionHeader from './DiscussionHeader';
import { mockEvents } from './mockData';
import { useEvent } from '@/hooks/useEvent.js';

const DiscussionPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const { getAllJoinedEvents } = useEvent();
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getAllJoinedEvents(
                    currentPage,
                    10,
                    true
                );
                setEvents(response.content.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (eventId) {
            const event = events.find((e) => e._id === eventId);
            if (event) {
                setSelectedEvent(event);
            }
        } else if (events.length > 0) {
            setSelectedEvent(events[0]);
            // <Link to={`/discussions/${events[0]._id}`} />;
        }
    }, [eventId, navigate]);

    // const handleEventSelect = (event) => {
    //     setSelectedEvent(event);
    //     navigate(`/discussions/${selectedEvent._id}`);
    //     console.log(event._id);
    // };

    return (
        <div className="flex h-screen bg-gray-100">
            <EventSidebar
                events={events}
                selectedEventId={selectedEvent?._id}
                // onEventSelect={handleEventSelect}
            />
            <div className="flex flex-1 flex-col">
                {selectedEvent ? (
                    <>
                        <DiscussionThreadList eventId={selectedEvent._id} />
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-lg text-gray-500">
                            Select an event to view discussions
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscussionPage;
