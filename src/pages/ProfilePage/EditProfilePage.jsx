import {useState, useRef, useEffect} from 'react';
import Button from '../../components/shared/SubmitButton.jsx';
import SectionTitle from './SectionTitle.jsx';
import AvatarUpload from './AvatarUpload.jsx';
import SocialLinkInput from './SocialLinkInput.jsx';
import TextareaField from '../../components/shared/TextareaField.jsx';
import {
    validateForm,
    scrollToFirstError,
    validationPatterns,
} from '../../components/shared/validationUtils.jsx';
import TextInputField from "@/components/shared/TextInputField.jsx";
import {Toast} from "@/helpers/toastService.js";
import {useSelector} from "react-redux";
import {useUser} from "@/hooks/useUser.js";


function EditProfilePage() {
    // Create refs object for all fields that need validation
    const refs = {
        name: useRef(null),
        email: useRef(null),
        phone: useRef(null),
    };

    const {user} = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email
    });

    // Add state for success message
    const [error, setError] = useState(false);

    // Add state for validation errors
    const [errors, setErrors] = useState("");

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
    const {handleUpdateUser} = useUser();
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form using our utility
        const newErrors = validateForm(formData, validationRules);
        setErrors(newErrors);

        if(!isChanged()){
            Toast.warning("No changes made to your profile!");
            return;
        }
        await handleUpdateUser(formData, user._id, setError);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setFormData(
            {
                name: user.name,
                email: user.email
            }
        )
        Toast.info("All changes have been reverted!");
    }

    const isChanged = () => {
        return (
            formData.name !== user.name ||
            formData.email !== user.email
        );
    }

    useEffect(() => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
        });
    }, [user]);

    return (
        <div className="bg-white px-4 py-12 sm:px-6 lg:px-8 h-screen max-w-screen justify-between items-center">
            <div className="mx-auto max-w-3xl">
                <SectionTitle
                    title="Edit Your Profile"
                    subtitle="Update your information and manage your EventApp presence"
                />

                {/* Success Message */}

                <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} >
                        {/* Avatar Upload Section */}
                        <div className="mb-8 flex flex-col items-center">
                            <AvatarUpload currentAvatar="" />
                        </div>

                        {/* Personal Information */}
                        <div className="mb-8">
                            <h3 className="mb-4 font-bold text-xl text-gray-900 pb-5">
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
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Enter your email address"
                                        error={errors.email}
                                        required
                                    />
                                </div>
                            </div>
                        </div>



                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                onClick={handleCancel}
                                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-black text-white transition-colors duration-200 hover:bg-gray-900 "
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
