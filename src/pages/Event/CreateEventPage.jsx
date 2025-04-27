// src/pages/CreateEventPage.jsx
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent.js';
import SectionTitle from '@/pages/ProfilePage/SectionTitle.jsx';
import EventForm from '@/components/EventForm.jsx';

function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent } = useEvent();
  const handleSubmit = async (eventData) => {
    const response = await createEvent(eventData);
    if (response.success) {
      toast.success('Event created successfully!');
      navigate('/event');
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionTitle
          title="Create New Event"
          subtitle="Fill in the details to create your event"
        />
        <br />
        <EventForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/event')}
          submitButtonText="Create Event"
        />
      </div>
    </div>
  );
}

export default CreateEventPage;
