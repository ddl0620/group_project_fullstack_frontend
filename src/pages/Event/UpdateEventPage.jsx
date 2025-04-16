// src/pages/UpdateEventPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import EventForm from "@/components/EventForm.jsx";
import SectionTitle from "@/pages/ProfilePage/SectionTitle.jsx";
import {useEvent} from "@/hooks/useEvent.js";
import {AlertDialog} from "@radix-ui/react-alert-dialog";
import {AlertDialogUtils} from "@/helpers/AlertDialogUtils.jsx";

function UpdateEventPage() {
    const navigate = useNavigate();
    const { eventId } = useParams(); // Lấy ID sự kiện từ URL
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const {getEventById, updateEvent} = useEvent();
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // console.log("Current id: ", eventId);
                const response = await getEventById(eventId); // API lấy chi tiết sự kiện
                console.log("Get Event IDxx:", response.content.event);
                if (response.success) {
                    setInitialData(response.content.event); // Giả định response.data chứa dữ liệu sự kiện
                } else {
                    toast.error('Failed to load event data.');
                    // navigate('/event');
                }
            } catch (error) {
                toast.error('Error loading event: ' + error.message);
                // navigate('/event');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, navigate]);

    const handleUpdate = async (eventData) => {
        const confirmed = await AlertDialogUtils.info({
            title: "Update Event?",
            description: "Are you sure you want to update this event? This action cannot be undone.",
            confirmText: "Update",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        const response = await updateEvent(eventId, eventData); // API cập nhật sự kiện
        console.log(response)
        if (response.success) {
            toast.success('Event updated successfully!');
            navigate('/event');
        } else {
            toast.error('Failed to update event. Please try again.');
            throw new Error('Failed to update event');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!initialData) {
        return <div>Event not found.</div>;
    }

    return (
        <div className="bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <SectionTitle
                    title="Update Event"
                    subtitle="Update the details of your event"
                />
                <br />
                <EventForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    onCancel={() => navigate('/event')}
                    submitButtonText="Update Event"
                />
            </div>
        </div>
    );
}

export default UpdateEventPage;