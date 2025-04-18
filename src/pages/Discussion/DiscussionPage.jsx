import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventSidebar from './EventSidebar';
import DiscussionThreadList from './DiscussionThreadList';
import DiscussionHeader from './DiscussionHeader';
import { mockEvents } from './mockData';

const DiscussionPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        // If eventId is provided in URL, find that event
        if (eventId) {
            const event = mockEvents.find(
                (e) => e.id === Number.parseInt(eventId)
            );
            if (event) {
                setSelectedEvent(event);
            }
        } else if (mockEvents.length > 0) {
            // If no eventId in URL, select the first event by default
            // setSelectedEvent(mockEvents[0])
            // navigate(`/discussions/${mockEvents[0].id}`)
        }
    }, [eventId, navigate]);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        // navigate(`/discussions/${event.id}`);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <EventSidebar
                events={mockEvents}
                selectedEventId={selectedEvent?.id}
                onEventSelect={handleEventSelect}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                {selectedEvent ? (
                    <>
                        <DiscussionHeader event={selectedEvent} />
                        <DiscussionThreadList eventId={selectedEvent.id} />
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
