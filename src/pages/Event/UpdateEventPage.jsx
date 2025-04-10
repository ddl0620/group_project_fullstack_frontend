import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import TextInputField from '../../components/sub_components/TextInputField.jsx';
import Button from '../../components/sub_components/SubmitButton.jsx';
import SectionTitle from '../ProfilePage/SectionTitle.jsx';
import {
    validateForm,
    scrollToFirstError,
} from '../../components/sub_components/validationUtils.jsx';
import { useEvent } from '../../hooks/useEvent.js'; // Added this import to match EventPage

// Define Zod schema for event validation
const eventSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters' }),
    location: z.string().min(2, { message: 'Location is required' }),
    venue: z.string().min(2, { message: 'Venue is required' }),
    date: z.string().regex(/^\d{2}\s[A-Za-z]{3}\s\d{4}$/, {
        message: 'Date must be in format DD MMM YYYY (e.g., 24 Jun 2025)',
    }),
    time: z.string().regex(/^\d{2}:\d{2}$/, {
        message: 'Time must be in 24-hour format (e.g., 22:00)',
    }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
        message: 'Price must be a valid number',
    }),
    tags: z.string(),
    image: z.string().url({ message: 'Please enter a valid image URL' }),
});

function UpdateEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getEventById, updateEvent } = useEvent();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        venue: '',
        date: '',
        time: '',
        price: '',
        tags: '',
        image: '',
        rating: '0.0',
    });
    const [errors, setErrors] = useState({});
    const refs = {
        title: useRef(null),
        location: useRef(null),
        venue: useRef(null),
        date: useRef(null),
        time: useRef(null),
        price: useRef(null),
        image: useRef(null),
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await getEventById(id);
                setFormData({
                    title: event.title,
                    location: event.location,
                    venue: event.venue,
                    date: event.date,
                    time: event.time,
                    price: event.price,
                    tags: event.tags,
                    image: event.image,
                    rating: event.rating,
                });
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };
        fetchEvent();
    }, [id, getEventById]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = eventSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = validation.error.format();
            setErrors(fieldErrors);
            scrollToFirstError(refs, fieldErrors);
            return;
        }

        try {
            await updateEvent(id, formData);
            navigate('/events');
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <SectionTitle title="Update Event" />
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInputField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    error={errors.title?._errors[0]}
                    ref={refs.title}
                    required
                />
                <TextInputField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Event Location"
                    error={errors.location?._errors[0]}
                    ref={refs.location}
                    required
                />
                <TextInputField
                    label="Venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Event Venue"
                    error={errors.venue?._errors[0]}
                    ref={refs.venue}
                    required
                />
                <TextInputField
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="DD MMM YYYY"
                    error={errors.date?._errors[0]}
                    ref={refs.date}
                    required
                />
                <TextInputField
                    label="Time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    error={errors.time?._errors[0]}
                    ref={refs.time}
                    required
                />
                <TextInputField
                    label="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Event Price"
                    error={errors.price?._errors[0]}
                    ref={refs.price}
                    required
                />
                <TextInputField
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Event Tags"
                />
                <TextInputField
                    label="Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL"
                    error={errors.image?._errors[0]}
                    ref={refs.image}
                    required
                />
                <div className="flex space-x-4">
                    <Button type="submit" className="bg-blue-500 text-white">
                        Update Event
                    </Button>
                    <Button
                        type="button"
                        className="bg-gray-500 text-white"
                        onClick={() => navigate(`/event`)}
                    >
                        Go Back
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UpdateEventPage;
