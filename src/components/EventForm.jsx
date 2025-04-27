import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  scrollToFirstError,
  validateForm,
} from '@/components/shared/validationUtils.jsx';
import TextInputField from '@/components/shared/TextInputField.jsx';
import { Switch } from '@/components/ui/switch';
import Button from '@/components/shared/SubmitButton.jsx';

const validationRules = {
  title: { required: true, requiredMessage: 'Event title is required' },
  isPublic: { required: true, requiredMessage: 'Public status is required' },
  description: { required: true, requiredMessage: 'Description is required' },
  location: { required: true, requiredMessage: 'Location is required' },
  startDate: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    requiredMessage: 'Start date is required',
    patternMessage: 'Start date must be YYYY-MM-DD',
  },
  startTime: {
    required: true,
    pattern: /^\d{2}:\d{2}$/,
    requiredMessage: 'Start time is required',
    patternMessage: 'Start time must be HH:MM',
  },
  endDate: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    requiredMessage: 'End date is required',
    patternMessage: 'End date must be YYYY-MM-DD',
  },
  endTime: {
    required: true,
    pattern: /^\d{2}:\d{2}$/,
    requiredMessage: 'End time is required',
    patternMessage: 'End time must be HH:MM',
  },
  image: {
    required: false,
    pattern: /^https?:\/\/.+/,
    requiredMessage: 'Image URL is required',
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
    isPublic: initialData.isPublic ?? true, // Use ?? to handle undefined
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
  const [step, setStep] = useState(1);

  const refs = Object.keys(validationRules).reduce((acc, key) => {
    acc[key] = useRef(null);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }));
    if (errors.isPublic) {
      setErrors((prev) => ({ ...prev, isPublic: null }));
    }
  };

  const handleNext = () => {
    const stepFields = getFieldsForStep(step);
    const stepErrors = validateForm(formData, stepFields);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      scrollToFirstError(stepErrors, refs);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateForm(formData, validationRules);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      scrollToFirstError(allErrors, refs);
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
        isPublic: formData.isPublic,
      };

      await onSubmit(eventData);
    } catch (error) {
      toast.error('Error: ' + error.message);
      setErrors({ submit: error.message });
    }
  };

  const getFieldsForStep = (step) => {
    if (step === 1)
      return {
        title: validationRules.title,
        description: validationRules.description,
        eventType: validationRules.eventType,
        isPublic: validationRules.isPublic,
      };
    if (step === 2)
      return {
        startDate: validationRules.startDate,
        startTime: validationRules.startTime,
        endDate: validationRules.endDate,
        endTime: validationRules.endTime,
      };
    return {
      location: validationRules.location,
      image: validationRules.image,
    };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex h-fit items-center justify-end">
        <span
          className={
            'flex w-fit rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-sm font-medium text-gray-500'
          }
        >
          Step {step}/3
        </span>
      </div>

      {errors.submit && (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong className="font-bold">Error:</strong>
          <span> {errors.submit}</span>
        </div>
      )}

      {step === 1 && (
        <>
          <div className={'text-left text-2xl font-semibold'}>
            Basic Information
          </div>
          <div
            className={
              'space-y-6 rounded-xl border border-gray-200 p-5 shadow-md'
            }
          >
            <div>
              <label className="block py-2 text-lg font-semibold">
                Event Title
              </label>
              <TextInputField
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                ref={refs.title}
              />
            </div>
            <div>
              <label className="block py-2 text-lg font-semibold">
                Open For Everyone
              </label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={handleSwitchChange}
                  id="isPublic"
                />
              </div>
              {errors.isPublic && (
                <p className="text-sm text-red-600">{errors.isPublic}</p>
              )}
            </div>

            <div>
              <label className="block py-2 text-lg font-semibold">
                Event Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } p-2 shadow-sm`}
                ref={refs.description}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            <div>
              <label className="block py-2 text-lg font-semibold">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.eventType ? 'border-red-500' : 'border-gray-300'
                } p-2 shadow-sm`}
                ref={refs.eventType}
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
              {errors.eventType && (
                <p className="text-sm text-red-600">{errors.eventType}</p>
              )}
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className={'space-y-4'}>
          <div className={'text-left text-2xl font-semibold'}>Date & Time</div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <TextInputField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              ref={refs.startDate}
              required
            />
            <TextInputField
              label="Start Time"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              error={errors.startTime}
              ref={refs.startTime}
              required
            />
            <TextInputField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              ref={refs.endDate}
              required
            />
            <TextInputField
              label="End Time"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              error={errors.endTime}
              ref={refs.endTime}
              required
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <>
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
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={errors.image}
            ref={refs.image}
            required
          />
        </>
      )}

      <div className="flex justify-between pt-4">
        <Button
          className={'bg-black text-white'}
          onClick={step === 1 ? onCancel : handleBack}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 3 ? (
          <Button className={'bg-black text-white'} onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button className={'bg-black text-white'} type="submit">
            {submitButtonText}
          </Button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
