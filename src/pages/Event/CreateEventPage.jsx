import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import TextInputField from '../../components/sub_components/TextInputField.jsx';
import Button from '../../components/sub_components/SubmitButton.jsx';
import SectionTitle from '../ProfilePage/SectionTitle.jsx';
import {
    validateForm,
    scrollToFirstError,
} from '../../components/sub_components/validationUtils.jsx';

// Define Zod schema for event validation based on backend interface
const eventSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters' }),
    description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters' }),
    location: z.string().min(2, { message: 'Location is required' }),
    venue: z.string().min(2, { message: 'Venue is required' }),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Start date must be in format YYYY-MM-DD',
    }),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, {
        message: 'Start time must be in 24-hour format (e.g., 22:00)',
    }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'End date must be in format YYYY-MM-DD',
    }),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, {
        message: 'End time must be in 24-hour format (e.g., 22:00)',
    }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
        message: 'Price must be a valid number',
    }),
    tags: z.string(),
    image: z.string().url({ message: 'Please enter a valid image URL' }),
    eventType: z.string(),
    maxParticipants: z.string().regex(/^\d+$/, {
        message: 'Max participants must be a number',
    }),
});

function CreateEventPage() {
    const navigate = useNavigate();

    // Create refs object for all fields that need validation
    const refs = {
        title: useRef(null),
        description: useRef(null),
        location: useRef(null),
        venue: useRef(null),
        startDate: useRef(null),
        startTime: useRef(null),
        endDate: useRef(null),
        endTime: useRef(null),
        price: useRef(null),
        image: useRef(null),
        eventType: useRef(null),
        maxParticipants: useRef(null),
    };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        venue: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        price: '',
        tags: '',
        image: '',
        eventType: 'PUBLIC', // Default event type
        maxParticipants: '100', // Default max participants
        organizer: '', // This will be set from the current user on submit
    });

    const [errors, setErrors] = useState({});

    // Define validation rules based on Zod schema
    const validationRules = {
        title: {
            required: true,
            requiredMessage: 'Event title is required',
        },
        description: {
            required: true,
            requiredMessage: 'Description is required',
        },
        location: {
            required: true,
            requiredMessage: 'Location is required',
        },
        venue: {
            required: true,
            requiredMessage: 'Venue is required',
        },
        startDate: {
            required: true,
            requiredMessage: 'Start date is required',
            pattern: /^\d{4}-\d{2}-\d{2}$/,
            patternMessage: 'Start date must be in format YYYY-MM-DD',
        },
        startTime: {
            required: true,
            requiredMessage: 'Start time is required',
            pattern: /^\d{2}:\d{2}$/,
            patternMessage:
                'Start time must be in 24-hour format (e.g., 22:00)',
        },
        endDate: {
            required: true,
            requiredMessage: 'End date is required',
            pattern: /^\d{4}-\d{2}-\d{2}$/,
            patternMessage: 'End date must be in format YYYY-MM-DD',
        },
        endTime: {
            required: true,
            requiredMessage: 'End time is required',
            pattern: /^\d{2}:\d{2}$/,
            patternMessage: 'End time must be in 24-hour format (e.g., 22:00)',
        },
        price: {
            required: true,
            requiredMessage: 'Price is required',
            pattern: /^\d+(\.\d{1,2})?$/,
            patternMessage: 'Price must be a valid number',
        },
        image: {
            required: true,
            requiredMessage: 'Image URL is required',
            pattern: /^https?:\/\/.+/,
            patternMessage: 'Please enter a valid image URL',
        },
        eventType: {
            required: true,
            requiredMessage: 'Event type is required',
        },
        maxParticipants: {
            required: true,
            requiredMessage: 'Maximum participants is required',
            pattern: /^\d+$/,
            patternMessage: 'Maximum participants must be a number',
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // Clear error when field is being edited
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateForm(formData, validationRules);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            scrollToFirstError(validationErrors, refs);
            return;
        }

        try {
            // Format data for API
            const eventData = {
                ...formData,
                startDateTime: `${formData.startDate}T${formData.startTime}:00`,
                endDateTime: `${formData.endDate}T${formData.endTime}:00`,
                maxParticipants: parseInt(formData.maxParticipants),
                price: parseFloat(formData.price),
                tags: formData.tags.split(',').map((tag) => tag.trim()),
            };

            // Remove unnecessary fields
            delete eventData.startDate;
            delete eventData.startTime;
            delete eventData.endDate;
            delete eventData.endTime;

            // Make API call to create event
            const response = await fetch(
                'http://localhost:5001/api/v1/event/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(eventData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create event');
            }

            // Redirect to events page on success
            navigate('/events');
        } catch (error) {
            console.error('Error creating event:', error);
            setErrors({
                submit: error.message,
            });
        }
    };

    return (
        <div className="bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-2xl">
                <SectionTitle
                    title="Create New Event"
                    subtitle="Fill in the details to create your event"
                />
                <br></br>
                {errors.submit && (
                    <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline">
                            {' '}
                            {errors.submit}
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 ">
                    <TextInputField
                        label="Event Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                        ref={refs.title}
                        required
                    />

                    <div className="form-group">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                                errors.description
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            ref={refs.description}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInputField
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            error={errors.location}
                            ref={refs.location}
                            required
                        />

                        <TextInputField
                            label="Venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            error={errors.venue}
                            ref={refs.venue}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInputField
                            label="Start Date (YYYY-MM-DD)"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            error={errors.startDate}
                            ref={refs.startDate}
                            required
                        />

                        <TextInputField
                            label="Start Time (HH:MM)"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            error={errors.startTime}
                            ref={refs.startTime}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInputField
                            label="End Date (YYYY-MM-DD)"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            error={errors.endDate}
                            ref={refs.endDate}
                            required
                        />

                        <TextInputField
                            label="End Time (HH:MM)"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            error={errors.endTime}
                            ref={refs.endTime}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInputField
                            label="Price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            error={errors.price}
                            ref={refs.price}
                            required
                        />

                        <TextInputField
                            label="Maximum Participants"
                            name="maxParticipants"
                            type="number"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            error={errors.maxParticipants}
                            ref={refs.maxParticipants}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label
                            htmlFor="eventType"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Event Type
                        </label>
                        <select
                            id="eventType"
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${
                                errors.eventType
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            ref={refs.eventType}
                        >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                            <option value="RESTRICTED">Restricted</option>
                        </select>
                        {errors.eventType && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.eventType}
                            </p>
                        )}
                    </div>

                    <TextInputField
                        label="Tags (comma separated)"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        error={errors.tags}
                        placeholder="music, concert, live"
                    />

                    <TextInputField
                        label="Image URL"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        error={errors.image}
                        ref={refs.image}
                        required
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button
                            onClick={() => navigate('/event')}
                            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-gray-800 text-white transition-colors duration-200 hover:bg-black"
                            type="submit"
                        >
                            Save Event
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEventPage;
