import { useState, useRef, useEffect } from 'react';
import Button from '../../components/sub_components/SubmitButton.jsx';
import SectionTitle from './SectionTitle.jsx';
import AvatarUpload from './AvatarUpload.jsx';
import SocialLinkInput from './SocialLinkInput.jsx';
import TextareaField from '../../components/sub_components/TextareaField.jsx';
import {
    validateForm,
    validationPatterns,
} from '../../components/sub_components/validationUtils.jsx';
import TextInputField from '@/components/sub_components/TextInputField.jsx';
import { Toast } from '@/helpers/toastService.js';
import { useSelector } from 'react-redux';
import { useUser } from '@/hooks/useUser.js';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.js';
import { cn } from '@/lib/utils.js';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { ConfirmationAlert } from '@/components/shared/CustomConfirmDialog.jsx';

function EditProfilePage() {
    const refs = {
        name: useRef(null),
        email: useRef(null),
        phone: useRef(null),
    };

    const { user } = useSelector((state) => state.user);
    const [date, setDate] = useState(user.dob ? new Date(user.dob) : null);

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
    });

    const [error, setError] = useState(false);
    const [errors, setErrors] = useState('');

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

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const { handleUpdateUser } = useUser();
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm(formData, validationRules);
        setErrors(newErrors);

        if (!isChanged()) {
            Toast.warning('No changes made to your profile!');
            return;
        }
        await handleUpdateUser(formData, user._id, setError);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setFormData({
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
        });
        setDate(user.dob ? new Date(user.dob) : null);
        Toast.info('All changes have been reverted!');
    };

    const isChanged = () => {
        return (
            formData.name !== user.name ||
            formData.email !== user.email ||
            formData.dob !== user.dob ||
            formData.gender !== user.gender
        );
    };

    useEffect(() => {
        setFormData({
            name: user.name || '',
            email: user.email || '',
            gender: user.gender || '',
            dob: user.dob || '',
        });
        setDate(user.dob ? new Date(user.dob) : null);
    }, [user]);

    return (
        <div className="bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <SectionTitle
                    title="Edit Your Profile"
                    subtitle="Update your information and manage your EventApp presence"
                />

                <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8 flex flex-col items-center">
                            <AvatarUpload currentAvatar="" />
                        </div>

                        <div className="mb-8">
                            <h3 className="mb-4 pb-5 text-xl font-bold text-gray-900">
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

                                {/* Date of Birth Field */}
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-neutral-600">
                                        Date of Birth
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                className={cn(
                                                    'text-muted-foreground bg-background ring-offset-background flex h-10 w-full items-center justify-start rounded-xl border border-gray-200 px-3 py-2 text-left text-sm font-normal',
                                                    !date &&
                                                        'text-muted-foreground rounded-xl border-gray-200'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? (
                                                    format(date, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto bg-white p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(newDate) => {
                                                    setDate(newDate);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dob: newDate
                                                            ? newDate.toISOString()
                                                            : '',
                                                    }));
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Gender Field */}
                                <div>
                                    <label className="mb-1 block text-sm font-bold text-neutral-600">
                                        Gender
                                    </label>
                                    <Select
                                        value={
                                            formData.gender ? 'male' : 'female'
                                        }
                                        onValueChange={(value) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                gender:
                                                    value === 'male'
                                                        ? true
                                                        : false,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="w-full rounded-xl border-gray-200">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className={
                                                'border-gray-200 bg-white'
                                            }
                                        >
                                            <SelectItem
                                                className={
                                                    'hover:cursor-pointer hover:bg-gray-200'
                                                }
                                                value="male"
                                            >
                                                Male
                                            </SelectItem>
                                            <SelectItem
                                                className={
                                                    'hover:cursor-pointer hover:bg-gray-200'
                                                }
                                                value="female"
                                            >
                                                Female
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                onClick={handleCancel}
                                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                                type="button"
                            >
                                Cancel
                            </Button>
                            <ConfirmationAlert
                                button={
                                    <Button
                                        // onClick={handleSubmit}
                                        className="bg-black text-white transition-colors duration-200 hover:bg-gray-900"
                                        type="submit"
                                    >
                                        Save Changes
                                    </Button>
                                }
                                title={"Are you sure?"}
                                description={
                                    "Are you sure you want to save these changes? This action cannot be undone."
                                }
                            />

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
