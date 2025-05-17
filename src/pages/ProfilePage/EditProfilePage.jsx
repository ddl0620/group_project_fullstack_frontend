import { useState, useRef, useEffect } from 'react';
import Button from '../../components/shared/SubmitButton.jsx';
import SectionTitle from './SectionTitle.jsx';
import AvatarUpload from './AvatarUpload.jsx';
import {
  validateForm,
  scrollToFirstError,
} from '../../components/shared/validationUtils.jsx';
import TextInputField from '@/components/shared/TextInputField.jsx';
import { Toast } from '@/helpers/toastService.js';
import { useSelector } from 'react-redux';
import { useUser } from '@/hooks/useUser.js';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button as UIButton } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { PureCalendar } from '@/components/ui/pure-calendar.js';

function EditProfilePage() {
  // Create refs object for all fields that need validation
  const refs = {
    name: useRef(null),
    dateOfBirth: useRef(null),
    phone: useRef(null),
  };

  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: user.name,
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
  });

  // State để lưu file avatar
  const [avatarFile, setAvatarFile] = useState(null);

  // Add state for success message
  const [error, setError] = useState(false);

  // Add state for validation errors
  const [errors, setErrors] = useState('');

  // Define validation rules
  const validationRules = {
    name: {
      required: true,
      requiredMessage: 'Full name is required',
    },
    dateOfBirth: {
      required: true,
      requiredMessage: 'Date of birth is required',
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

  // Handle date of birth selection
  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));

    // Clear error when field is being edited
    if (errors.dateOfBirth) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: '',
      }));
    }
  };

  // Callback để nhận file từ AvatarUpload
  const handleAvatarChange = (file) => {
    setAvatarFile(file);
  };

  const { handleUpdateUser } = useUser();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form using our utility
    const newErrors = validateForm(formData, validationRules);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(refs);
      return;
    }

    if (!isChanged() && !avatarFile) {
      Toast.warning('No changes made to your profile!');
      return;
    }

    // Tạo FormData để gửi lên API
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', user.email);
    if (formData.dateOfBirth) {
      data.append('dateOfBirth', formData.dateOfBirth.toISOString());
    }
    if (avatarFile) {
      data.append('avatar', avatarFile); // Gửi file avatar
    }

    console.log('FormData sent:', data.get('name'));
    console.log('FormData sent:', data.get('dateOfBirth'));
    console.log('FormData sent:', data.get('avatar'));
    await handleUpdateUser(data, user._id, setError);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData({
      name: user.name,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
    });
    setAvatarFile(null); // Reset file avatar
    Toast.info('All changes have been reverted!');
  };

  const isChanged = () => {
    const originalDate = user.dateOfBirth
      ? new Date(user.dateOfBirth)
      : undefined;
    const currentDate = formData.dateOfBirth;

    // Compare dates by converting to ISO string or comparing undefined
    const dateChanged =
      (originalDate &&
        currentDate &&
        originalDate.toISOString() !== currentDate.toISOString()) ||
      (originalDate && !currentDate) ||
      (!originalDate && currentDate);

    return formData.name !== user.name || dateChanged || avatarFile;
  };

  useEffect(() => {
    setFormData({
      name: user.name || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
    });
  }, [user]);

  return (
    <div className="h-screen max-w-screen items-center justify-between bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionTitle
          title="Edit Your Profile"
          subtitle="Update your information and manage your EventApp presence"
        />

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Avatar Upload Section */}
            <div className="mb-8 flex flex-col items-center">
              <AvatarUpload
                currentAvatar={user.avatar}
                onAvatarChange={handleAvatarChange} // Truyền callback
              />
            </div>

            {/* Personal Information */}
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

                {/* Date of Birth Field */}
                <div ref={refs.dateOfBirth} className="space-y-2">
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <UIButton
                        id="dateOfBirth"
                        variant="outline"
                        className={cn(
                          'w-full justify-start border border-gray-300 bg-white text-left font-normal hover:bg-gray-50',
                          !formData.dateOfBirth && 'text-gray-500',
                          errors.dateOfBirth && 'border-red-500'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? (
                          format(formData.dateOfBirth, 'PPP')
                        ) : (
                          <span>Select your date of birth</span>
                        )}
                      </UIButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <PureCalendar
                        showYearInput={true}
                        minYear={1900}
                        maxYear={2007}
                        disabled={(date) =>
                          date > new Date('2007-12-31') ||
                          date < new Date('1900-01-01')
                        }
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Management Links */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Account Management
              </h3>
              <div className="space-y-4 rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Address</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile/email"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Update
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">••••••••</p>
                  </div>
                  <Link
                    to="/profile/password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </Link>
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
                className="bg-black text-white transition-colors duration-200 hover:bg-gray-900"
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
