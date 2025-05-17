'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Clock,
  Users,
  Calendar,
  Timer,
  Unlock,
  Lock,
  MapPin,
  Globe,
} from 'lucide-react';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import Button from '@/components/shared/SubmitButton.jsx';
import EventRequestManagement from '@/pages/Event/MyOrganizedEvents/EventRequestManagement.jsx';
import EventInvitationManagement from '@/pages/Event/MyOrganizedEvents/EventInvitationManagement.jsx';
import EventRSVP from '@/pages/Event/MyOrganizedEvents/EventRSVP.jsx';
import { useInvitation } from '@/hooks/useInvitation.js';
import ImageCarousel from '@/components/ImageCarousel.jsx';

const EventManagement = ({ event }) => {
  const [activeTab, setActiveTab] = useState('eventDetail');
  const { fetchInvitationsByEventId } = useInvitation();

  // Fetch invitations when event._id changes
  useEffect(() => {
    if (event?._id) {
      console.log(
        'Fetching invitations for event in EventManagement:',
        event._id
      );
      fetchInvitationsByEventId(event._id, 1, 10);
    }
  }, [event._id, fetchInvitationsByEventId]);

  const formatDay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentTab = useMemo(() => {
    if (activeTab === 'eventDetail') {
      return (
        <div className="mx-auto max-w-5xl py-10 sm:px-6 lg:px-24">
          <div className="flex flex-col items-center justify-center gap-6">
            <ImageCarousel images={event.images} />

            <div className="mt-2 w-full space-y-6 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
                {event.title || 'Untitled Event'}
              </h1>

              <p className="text-sm text-gray-600 italic sm:text-base">
                {event.description}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-gray-700">Hosted by</span>
                <CustomAvatar src={''} fallbackText="Khanh" alt="User" />
              </div>

              <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-6 sm:space-x-8">
                {/* Participant */}
                <div className={'space-y-2'}>
                  <p className={'border-b pb-2 text-2xl font-semibold'}>
                    Participants
                  </p>
                  <div className="flex items-center gap-3 pb-2 text-sm text-gray-700">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <span>{event.participants?.length || 0} Participants</span>
                  </div>
                </div>

                {/* Date and Time */}
                <div className={'space-y-2'}>
                  <p className={'border-b pb-2 text-2xl font-semibold'}>
                    Date and Time
                  </p>
                  <div className="flex items-center gap-3 pb-2 text-sm text-gray-700">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>
                      {formatDay(event.startDate)} - {formatDay(event.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pb-2 text-sm text-gray-700">
                    <Timer className="h-5 w-5 text-green-500" />
                    <span>
                      {formatTime(event.startDate)} -{' '}
                      {formatTime(event.endDate)}
                    </span>
                  </div>
                </div>

                {/* Event Type */}
                <div className={'space-y-2'}>
                  <p className={'border-b pb-2 text-2xl font-semibold'}>
                    Event Type
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    {event.isPublic ? (
                      <Unlock className="h-5 w-5 text-teal-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-orange-500" />
                    )}
                    <span>{event.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>

                {/* Venue */}
                <div className={'space-y-2'}>
                  <p className={'border-b pb-2 text-2xl font-semibold'}>
                    Venue
                  </p>

                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <MapPin className="h-5 w-5 text-red-500" />
                    <span>{event.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    {event.type === 'ONLINE' ? (
                      <Globe className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-purple-500" />
                    )}
                    <span>
                      {event.type === 'ONLINE'
                        ? 'Online Event'
                        : 'Offline Event'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'request') {
      return <EventRequestManagement event={event} />;
    } else if (activeTab === 'invitation') {
      return <EventInvitationManagement event={event} />;
    } else if (activeTab === 'rsvp') {
      return <EventRSVP event={event} />;
    }
  }, [activeTab, event]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            className={`px-1 pb-2 ${
              activeTab === 'eventDetail'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('eventDetail')}
          >
            Event Details
          </button>
          <button
            className={`px-1 pb-2 ${
              activeTab === 'request'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('request')}
          >
            Request
          </button>
          <button
            className={`px-1 pb-2 ${
              activeTab === 'invitation'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('invitation')}
          >
            Invitation
          </button>
          <button
            className={`px-1 pb-2 ${
              activeTab === 'rsvp'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('rsvp')}
          >
            RSVP
          </button>
        </div>
      </div>
      <div>{currentTab}</div>
    </div>
  );
};

export default EventManagement;
