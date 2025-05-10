'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Users,
  Timer,
  Mail,
  Info,
  CheckCircle,
  XCircle,
  User,
  Ticket,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomAvatar } from '@/components/shared/CustomAvatar';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils';
import ImageCarousel from '@/components/ImageCarousel';
import EventDetailsForOrganizer from '@/pages/Event/MyOrganizedEvents/EventDetailsForOrganizer';
import EventInvitationsList from '@/pages/Event/MyJoinedEvents/EventInvitationList.jsx';
import useInvitation from '@/hooks/useInvitation.js';
import { useUser } from '@/hooks/useUser.js';
import { Toast } from '@/helpers/toastService.js';
import { UpdateIcon } from '@radix-ui/react-icons';
import { formatDay } from '@/helpers/format.js';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { getEventById, requestJoinEvent } = useEvent();
  const {
    fetchReceivedInvitationsByEventId,
    fetchRSVPByInvitationId,
    replyInvitation,
  } = useInvitation();
  const { getUserById } = useUser();

  const [event, setEvent] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitationsLoading, setInvitationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

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
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    const getInvitorById = async (userId) => {
      try {
        const response = await getUserById(userId);
        if (response.success) {
          const user = response.content;
          return user;
        } else {
          throw new Error('Failed to load user data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user');
        // toast.error(err.response?.data?.message || 'Failed to load user');
      }
    };
    const getRSVPByInvitationId = async (invitationId) => {
      try {
        const response = await fetchRSVPByInvitationId(invitationId);
        if (response) {
          return response;
        } else {
          throw new Error('Failed to load RSVP data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load RSVP');
        // toast.error(err.response?.data?.message || 'Failed to load RSVP');
      }
    };

    const fetchInvitations = async () => {
      try {
        setInvitationsLoading(true);
        const response = await fetchReceivedInvitationsByEventId(eventId);
        if (!response.success) {
          throw new Error('Failed to load invitations');
        }

        const tmpInvitation = response.content.invitation;
        const invitor = await getInvitorById(tmpInvitation.invitorId);
        const rsvp = await getRSVPByInvitationId(tmpInvitation._id);
        const invitation = [
          {
            ...tmpInvitation,
            invitedBy: invitor,
            status: rsvp.response,
          },
        ];

        console.log(invitation);
        setInvitations(invitation);
      } catch (err) {
        console.error('Failed to load invitations:', err);
      } finally {
        setInvitationsLoading(false);
      }
    };

    fetchEvent();
    fetchInvitations();
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

  const handleJoinEvent = async () => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Join Event?',
      description: 'Are you sure you want to join this event',
      confirmText: 'Join now',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;

    const userData = {
      userId: user._id,
    };

    try {
      const response = await requestJoinEvent(eventId, userData);
      if (response.success) {
        toast.success(
          event.isPublic
            ? 'You have joined the event!'
            : 'Request sent successfully!'
        );
        // Refresh event data
        const updatedEvent = await getEventById(eventId);
        if (updatedEvent.success) {
          setEvent(updatedEvent.content.event);
        }
      }
    } catch (err) {
      console.log('Failed to join event. Please try again.');
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      // In a real app, you would call an API endpoint
      const option = {
        response: 'ACCEPTED',
      };
      await replyInvitation(invitationId, option);

      // Update local state for demo
      setInvitations(
        invitations.map((inv) =>
          inv._id === invitationId ? { ...inv, status: 'ACCEPTED' } : inv
        )
      );
      // Toast.success('Invitation accepted!');
    } catch (err) {
      console.log('Failed to accept invitation');
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      const option = {
        response: 'DENIED',
      };
      await replyInvitation(invitationId, option);

      // Update local state for demo
      setInvitations(
        invitations.map((inv) =>
          inv._id === invitationId ? { ...inv, status: 'DENIED' } : inv
        )
      );

      // toast.success('Invitation declined');
    } catch (err) {
      console.log('Failed to decline invitation');
    }
  };

  // Add a new function to handle status changes in the EventDetailPage component
  const handleStatusChange = async (invitationId, newStatus) => {
    try {
      // In a real app, you would call an API endpoint
      // await changeEventInvitationStatus(invitationId, newStatus)

      // Update local state for demo
      setInvitations(
        invitations.map((inv) =>
          inv._id === invitationId ? { ...inv, status: newStatus } : inv
        )
      );

      // toast.success(`Invitation status changed to ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.log('Failed to change invitation status');
    }
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }

  // Check if user is the organizer
  const isOrganizer = user && event && event.organizer === user._id;

  // If user is the organizer, show organizer view
  if (isOrganizer) {
    return <EventDetailsForOrganizer event={event} />;
  }

  // Check if event exists
  if (error || !event) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <Ticket className="mx-auto h-12 w-12 text-blue-500" />
          <p className="mt-4 text-gray-700">
            This is a private event. Please request to join first
          </p>
          <div className="mt-6">
            <Button
              onClick={handleJoinEvent}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Request to Join
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check user's relationship to the event
  const userParticipant = event.participants?.find(
    (participant) => participant.userId === user?._id
  );
  const isAcceptedParticipant = userParticipant?.status === 'ACCEPTED';
  const isPendingParticipant = userParticipant?.status === 'PENDING';
  const isDeniedParticipant = userParticipant?.status === 'DENIED';
  const hasRequestedToJoin = isPendingParticipant;
  const canViewDetails = event.isPublic || isAcceptedParticipant;
  const canViewInvitations = isAcceptedParticipant;
  const shouldShowJoinButton =
    !hasRequestedToJoin && !isAcceptedParticipant && !isDeniedParticipant;

  // Handle pending request state
  if (!canViewDetails && isPendingParticipant) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
          <Info className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-xl font-semibold text-blue-700">
            Request Pending
          </h2>
          <p className="mt-2 text-blue-600">
            Your request to join this event has been sent. Please wait for the
            organizer's approval.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle denied request state
  if (isDeniedParticipant) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-red-700">
            Request Denied
          </h2>
          <p className="mt-2 text-red-600">
            Your request have been denied. Please contact the organizer for more
            information.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For private events where user hasn't requested to join yet
  if (!canViewDetails && !event.isPublic) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <Lock className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-amber-700">
            Private Event
          </h2>
          <p className="mt-2 text-amber-600">
            This is a private event. You need to request access to view the
            details.
          </p>
          <div className="mt-6">
            <Button
              onClick={handleJoinEvent}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Request to Join
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Count pending invitations
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === 'PENDING'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Conditional rendering based on user's relationship to the event */}
          {isAcceptedParticipant ? (
            <Button
              onClick={() => navigate(`/discussions/${event._id}`)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Join Discussion
            </Button>
          ) : shouldShowJoinButton ? (
            <Button
              onClick={handleJoinEvent}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {event.isPublic ? 'Join Event' : 'Request to Join'}
            </Button>
          ) : null}
        </div>

        <div className="mb-6">
          <ImageCarousel images={event.images} />
        </div>

        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="details" className="text-base">
              Event Details
            </TabsTrigger>
            {canViewInvitations && (
              <TabsTrigger value="invitations" className="text-base">
                Invitations
                {pendingInvitations > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingInvitations}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {event.title || 'Untitled Event'}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {event.isPublic ? (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-green-50 text-green-700"
                      >
                        <Unlock className="h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-amber-50 text-amber-700"
                      >
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-blue-50 text-blue-700"
                    >
                      {event.type === 'ONLINE' ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Online
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3 w-3" />
                          In-Person
                        </>
                      )}
                    </Badge>

                    {isAcceptedParticipant && (
                      <Badge className="bg-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Attending
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    About this event
                  </h2>
                  <p className="text-gray-600">{event.description}</p>
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <CustomAvatar
                    src={''}
                    fallbackText="Organizer"
                    alt="Organizer"
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <p className="font-medium">Event Organizer</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-lg border bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Notify user when:</p>
                    <p className="font-medium">{event.notifyWhen}</p>
                  </div>
                </div>




                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Date and Time */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">
                      Date and Time
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            {formatDay(event.startDate)} -{' '}
                            {formatDay(event.endDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Timer className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(event.endDate) -
                            new Date(event.startDate) >
                            86400000
                              ? `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))} days`
                              : `${Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60))} hours`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">
                      Location
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">
                            {event.location || 'No location specified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {event.isPublic ? (
                          <>
                            <Unlock className="h-5 w-5 text-green-500" />
                            <p className="text-sm">
                              Public event - Anyone can join
                            </p>
                          </>
                        ) : (
                          <>
                            <Lock className="h-5 w-5 text-amber-500" />
                            <p className="text-sm">
                              Private event - Requires approval to join
                            </p>
                          </>
                        )}
                      </div>

                      {event.type === 'ONLINE' && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-purple-500" />
                          <p className="text-sm">
                            Online event - link will be provided to participants
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">
                      Participants
                    </h3>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">
                          {event.participants?.filter(
                            (p) => p.status === 'ACCEPTED'
                          ).length || 0}{' '}
                          Attending
                        </p>
                        {event.maxParticipants && (
                          <p className="text-sm text-gray-500">
                            {event.maxParticipants -
                              (event.participants?.filter(
                                (p) => p.status === 'ACCEPTED'
                              ).length || 0)}{' '}
                            spots left
                          </p>
                        )}
                      </div>
                    </div>

                    {event.participants && event.participants.length > 0 && (
                      <div className="mt-3 flex -space-x-2">
                        {event.participants
                          .filter((p) => p.status === 'ACCEPTED')
                          .slice(0, 5)
                          .map((participant, index) => (
                            <CustomAvatar
                              key={index}
                              src={''}
                              fallbackText={`P${index + 1}`}
                              alt={`Participant ${index + 1}`}
                              className="h-8 w-8 border-2 border-white"
                            />
                          ))}
                        {event.participants.filter(
                          (p) => p.status === 'ACCEPTED'
                        ).length > 5 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium">
                            +
                            {event.participants.filter(
                              (p) => p.status === 'ACCEPTED'
                            ).length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Settings */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-700">
                      Event Settings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <UpdateIcon className="h-5 w-5 text-purple-500" />
                        <p className="text-sm">
                          Update:{' '}
                          {format(new Date(event.updatedAt), 'MMMM d, yyyy')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <p className="text-sm">
                          Created:{' '}
                          {format(new Date(event.createdAt), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Join button for public events (if not already joined) */}
                {event.isPublic && shouldShowJoinButton && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleJoinEvent}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Join Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {canViewInvitations && (
            <TabsContent value="invitations" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                    Event Invitations
                  </h2>

                  {invitationsLoading ? (
                    <InvitationsSkeleton />
                  ) : invitations.length > 0 ? (
                    <EventInvitationsList
                      invitations={invitations}
                      onAccept={handleAcceptInvitation}
                      onDecline={handleDeclineInvitation}
                      onStatusChange={handleStatusChange}
                    />
                  ) : (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <Mail className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium">
                        No Invitations
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You don't have any invitations for this event yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      <div className="mb-6">
        <Skeleton className="h-12 w-full" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-2/3" />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvitationsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-2/3" />
            <div className="mt-3 flex justify-end gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
