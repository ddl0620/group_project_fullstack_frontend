// src/components/EventForm.jsx
import { useState, useRef } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import {scrollToFirstError, validateForm} from "@/components/shared/validationUtils.jsx";
import TextInputField from "@/components/shared/TextInputField.jsx";
import {Button} from "@mui/material";

// Define Zod schema for event validation
const eventSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    location: z.string().min(2, { message: 'Location is required' }),
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
    image: z.string().url({ message: 'Please enter a valid image URL' }),
    eventType: z.enum(['ONLINE', 'OFFLINE'], { message: 'Event type is required' }),
});

// Validation rules based on Zod schema
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
        patternMessage: 'Start time must be in 24-hour format (e.g., 22:00)',
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
};

const EventForm = ({
                       initialData = {},
                       onSubmit,
                       submitButtonText = 'Save Event',
                       onCancel,
                   }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        location: initialData.location || '',
        startDate: initialData.startDate?.split('T')[0] || '',
        startTime: initialData.startDate?.split('T')[1]?.slice(0, 5) || '',
        endDate: initialData.endDate?.split('T')[0] || '',
        endTime: initialData.endDate?.split('T')[1]?.slice(0, 5) || '',
        image: initialData.images?.[0] || '',
        eventType: initialData.type || 'ONLINE',
    });

    const [errors, setErrors] = useState({});

    const refs = {
        title: useRef(null),
        description: useRef(null),
        location: useRef(null),
        startDate: useRef(null),
        startTime: useRef(null),
        endDate: useRef(null),
        endTime: useRef(null),
        image: useRef(null),
        eventType: useRef(null),
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm(formData, validationRules);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            scrollToFirstError(validationErrors, refs);
            return;
        }

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                type: formData.eventType,
                startDate: `${formData.startDate}T${formData.startTime}:00.000Z`,
                endDate: `${formData.endDate}T${formData.endTime}:00.000Z`,
                location: formData.location,
                images: formData.image ? [formData.image] : [],
                isPublic: formData.eventType === 'ONLINE',
            };

            await onSubmit(eventData);
        } catch (error) {
            toast.error('Error: ' + error.message);
            setErrors({ submit: error.message });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {errors.submit}</span>
                </div>
            )}

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
                        errors.description ? 'border-red-500' : 'border-gray-300'
                    } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    ref={refs.description}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <TextInputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                ref={refs.location}
                required
            />

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
                        errors.eventType ? 'border-red-500' : 'border-gray-300'
                    } p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                    ref={refs.eventType}
                >
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                </select>
                {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>
                )}
            </div>

            <TextInputField
                label="Images (URL)"
                name="image"
                value={formData.image}
                onChange={handleChange}
                error={errors.image}
                ref={refs.image}
                required
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    type="button"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-gray-800 text-white transition-colors duration-200 hover:bg-black"
                    type="submit"
                >
                    {submitButtonText}
                </Button>
            </div>
        </form>
    );
};

export default EventForm;