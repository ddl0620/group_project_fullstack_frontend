import { useState, useRef } from 'react';
import Button from '../../components/sub_components/SubmitButton.jsx';
import SectionTitle from './SectionTitle.jsx';
import AvatarUpload from './AvatarUpload.jsx';
import SocialLinkInput from './SocialLinkInput.jsx';
import TextareaField from '../../components/sub_components/TextareaField.jsx';
import {
    validateForm,
    scrollToFirstError,
    validationPatterns,
} from '../../components/sub_components/validationUtils.jsx';
import TextInputField from "@/components/sub_components/TextInputField.jsx";

function EditProfilePage() {
    // Create refs object for all fields that need validation
    const refs = {
        name: useRef(null),
        email: useRef(null),
        phone: useRef(null),
    };

    const [formData, setFormData] = useState({
        name: 'Ngoc Dai Ca',
        email: 'cocailoz@gmail.com',
        phone: '+84 0968578540',
        bio: 'Event Organizer with Osama Bin Laden',
        location: 'Hanoi Underground',
        website: 'pornhub.com',
        twitter: 'nudieX',
        instagram: 'nudeForLife',
    });

    // Add state for success message
    const [showSuccess, setShowSuccess] = useState(false);

    // Add state for validation errors
    const [errors, setErrors] = useState({});

    // Define validation rules
    const validationRules = {
        name: {
            required: true,
            requiredMessage: 'Full name is required (first and last name)',
        },
        email: {
            required: true,
            requiredMessage: 'Email address is required',
            pattern: validationPatterns.email.pattern,
            patternMessage: validationPatterns.email.message,
        },
        phone: {
            required: true,
            requiredMessage: 'Phone number is required',
            pattern: validationPatterns.phone.pattern,
            patternMessage: validationPatterns.phone.message,
        },
        website: {
            pattern: validationPatterns.url.pattern,
            patternMessage: validationPatterns.url.message,
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
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form using our utility
        const newErrors = validateForm(formData, validationRules);
        setErrors(newErrors);

        // If there are errors, scroll to the first one
        if (Object.keys(newErrors).length > 0) {
            scrollToFirstError(newErrors, refs);
            return;
        }

        // If form is valid, proceed with submission
        console.log('Form submitted:', formData);

        // Show success message
        setShowSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <SectionTitle
                    title="Edit Your Profile"
                    subtitle="Update your information and manage your EventApp presence"
                />

                {/* Success Message */}
                {showSuccess && (
                    <div className="animate-fade-in fixed top-4 right-4 z-50 rounded border-l-4 border-green-500 bg-green-100 p-4 text-green-700 shadow-md">
                        <div className="flex items-center">
                            <div className="py-1">
                                <svg
                                    className="mr-4 h-6 w-6 text-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold">Success!</p>
                                <p className="text-sm">
                                    Your profile has been updated successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Avatar Upload Section */}
                        <div className="mb-8 flex flex-col items-center">
                            <AvatarUpload currentAvatar="/path/to/avatar.jpg" />
                        </div>

                        {/* Personal Information */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Personal Information
                            </h3>
                            <div className="space-y-5">
                                <div ref={refs.name}>
                                    <TextInputField
                                        label="Full Name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        error={errors.name}
                                        required
                                    />
                                </div>

                                <div ref={refs.email}>
                                    <TextInputField
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        error={errors.email}
                                        required
                                    />
                                </div>

                                <div ref={refs.phone}>
                                    <TextInputField
                                        label="Phone Number"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        error={errors.phone}
                                        required
                                    />
                                </div>

                                <TextareaField
                                    label="Bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself"
                                />

                                <TextInputField
                                    label="Location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Social Links
                            </h3>
                            <div className="space-y-5">
                                <SocialLinkInput
                                    platform="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    error={errors.website}
                                />

                                <SocialLinkInput
                                    platform="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                />

                                <SocialLinkInput
                                    platform="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                onClick={() => window.history.back()}
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
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
