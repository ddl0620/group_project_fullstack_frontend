import MyEventHeader from '@/pages/Event/MyOrganizedEvents/MyEventHeader.jsx';
import EventManagement from '@/pages/Event/MyOrganizedEvents/EventManagement.jsx';
import Button from '@/components/shared/SubmitButton.jsx';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventDetailsForOrganizer = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="relative top-4 left-4 z-10 sm:top-6 sm:left-6">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
      </div>
      <MyEventHeader event={event} />
      <EventManagement event={event} />
    </div>
  );
};

export default EventDetailsForOrganizer;
