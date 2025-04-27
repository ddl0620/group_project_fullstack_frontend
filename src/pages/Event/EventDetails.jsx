// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent.js';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Clock,
  Lock,
  Unlock,
  Users,
  Timer,
} from 'lucide-react';
import ImageSlider from '@/components/shared/ImageSlider.jsx';
import SectionTitle from '@/pages/ProfilePage/SectionTitle.jsx';
import Button from '@/components/shared/SubmitButton.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { AlertDialog } from '@/components/ui/alert-dialog.js';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { useSelector } from 'react-redux';
import EventDetailsForOrganizer from '@/pages/Event/MyOrganizedEvents/EventDetailsForOrganizer.jsx';

function EventDetailPage() {
  let { eventId } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { getEventById, requestJoinEvent } = useEvent();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getEventById(eventId);
        if (response.success) {
          setEvent(response.content.event);
        } else {
          throw new Error('Failed to load event data');
        }
      } catch (err) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleJoinEvent = async () => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Joined Event?',
      description: 'Are you sure you want to join this event',
      confirmText: 'Join now',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;
    const userData = {
      userId: user._id,
    };

    await requestJoinEvent(eventId, userData);
  };

  if (error || !event) {
    return (
      <div className="py-10 text-center text-red-500">
        {error}
        <br />
        <span>This is a private event. Please request to join first</span>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleJoinEvent}
            className="w-fit bg-blue-500 text-white hover:bg-blue-600"
          >
            Request to Join
          </Button>
        </div>
      </div>
    );
  }

  const isSentRequest = event.participants?.some(
    (participant) =>
      participant.userId === user._id && participant.status === 'PENDING'
  );

  if (event && !event.isPublic && isSentRequest) {
    return (
      <div className="py-10 text-center text-blue-500">
        {error}
        <br />
        <span>
          Your request to join this event has been sent. Please wait for the
          organizer's approval.
        </span>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const isDenied = event.participants?.some(
    (participant) =>
      participant.userId === user._id && participant.status === 'DENIED'
  );

  if (event && !event.isPublic && isDenied) {
    return (
      <div className="py-10 text-center text-red-500">
        {error}
        <br />
        <span>
          You are denied to join this event. Please contact the organizer for
          more information.
        </span>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (user && event.organizer === user._id) {
    console.log(event);
    return <EventDetailsForOrganizer event={event} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative top-4 left-4 z-10 sm:top-6 sm:left-6">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
      </div>

      <div className="mx-auto max-w-5xl py-10 sm:px-6 lg:px-24">
        <div className="flex flex-col items-center justify-center gap-6">
          <ImageSlider
            className="w-full max-w-3xl rounded-xl shadow-md"
            imageList={event.images}
          />

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

            <div className="flex justify-between">
              {/* Conditional rendering based on user's relationship to the event */}
              {user && event.organizer === user._id ? (
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-blue-100 px-3 py-2 text-blue-600">
                    You're the organizer of this event
                  </span>
                  <Button
                    onClick={() => navigate(`/discussions/${event._id}`)}
                    className="w-fit bg-blue-500 text-white hover:bg-blue-600"
                  >
                    View Discussion
                  </Button>
                </div>
              ) : user &&
                event.participants?.some(
                  (participant) =>
                    participant.userId === user._id &&
                    participant.status === 'PENDING'
                ) ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-100 px-3 py-2 text-amber-600">
                    Request sent. Awaiting approval.
                  </span>
                </div>
              ) : user &&
                event.participants?.some(
                  (participant) =>
                    participant.userId === user._id &&
                    participant.status === 'ACCEPTED'
                ) ? (
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-green-100 px-3 py-2 text-green-700">
                    You're attending this event
                  </span>
                  <Button
                    onClick={() => navigate(`/discussions/${event._id}`)}
                    className="w-fit bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Join Discussion
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleJoinEvent}
                  className="w-fit bg-blue-500 text-white hover:bg-blue-600"
                >
                  {event.isPublic ? 'Join Event' : 'Request to Join'}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2 sm:space-y-6 sm:space-x-8">
              {/*Participant*/}
              <div className={'space-y-2'}>
                <p className={'border-b pb-2 text-2xl font-semibold'}>
                  Participants
                </p>
                <div className="flex items-center gap-3 pb-2 text-sm text-gray-700">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <span>{event.participants?.length || 0} Participants</span>
                </div>
              </div>

              {/*Date and Time*/}
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
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </span>
                </div>
              </div>

              {/*Event Type*/}
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

              {/*Venue*/}
              <div className={'space-y-2'}>
                <p className={'border-b pb-2 text-2xl font-semibold'}>Venue</p>

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
                    {event.type === 'ONLINE' ? 'Online Event' : 'Offline Event'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailPage;
