import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomAvatar } from '@/components/shared/CustomAvatar';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/helpers/toastService.js';
import ImageCarousel from '@/components/ImageCarousel.jsx';
import { useEvent } from '@/hooks/useEvent';
import { useUser } from '@/hooks/useUser';
import Pagination from '@/components/shared/Pagination.jsx';

const ITEMS_PER_PAGE = 9;

export default function MyInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { getAllEvents, replyInvitation } = useEvent();
  const { getUserById } = useUser();
  const me = useSelector((state) => state.user.user);
  // Fetch all events, filter for user invitations, and fetch organizer details
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: 1,
          limit: 1000, // Fetch a large number of events
        };

        const response = await getAllEvents(params);
        if (response.success) {
          const userInvitations = response.content.events.filter((event) =>
            event.participants.some(
              (p) => p.userId === user._id && p.status === 'INVITED'
            )
          );

          // Fetch organizer details for each event
          const invitationsWithOrganizers = await Promise.all(
            userInvitations.map(async (event) => {
              try {
                const organizerResponse = await getUserById(event.organizer);
                if (organizerResponse.success) {
                  return {
                    ...event,
                    organizer: {
                      _id: event.organizer,
                      name:
                        organizerResponse.content.name || 'Unknown Organizer',
                      avatar: organizerResponse.content.avatar || '',
                    },
                  };
                }
                // Fallback if organizer fetch fails
                return {
                  ...event,
                  organizer: {
                    _id: event.organizer,
                    name: 'Unknown Organizer',
                    avatar: '',
                  },
                };
              } catch (error) {
                console.error(
                  `Failed to fetch organizer ${event.organizer}:`,
                  error
                );
                return {
                  ...event,
                  organizer: {
                    _id: event.organizer,
                    name: 'Unknown Organizer',
                    avatar: '',
                  },
                };
              }
            })
          );

          setInvitations(invitationsWithOrganizers);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (err) {
        Toast.error('Error fetching invitations: ' + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchInvitations();
    }
  }, [user]);

  const { respondJoinEvent } = useEvent();
  // Filter invitations based on active tab
  const filteredInvitations = invitations.filter((event) => {
    const status = event.participants.find(
      (p) => p.userId === user._id
    )?.status;

    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return status === 'INVITED';
    if (activeTab === 'accepted') return status === 'ACCEPTED';
    if (activeTab === 'declined') return status === 'DECLINED';

    return true;
  });

  // Calculate pagination
  const paginatedInvitations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredInvitations.slice(startIndex, endIndex);
  }, [filteredInvitations, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredInvitations.length / ITEMS_PER_PAGE);
  }, [filteredInvitations]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const respondToInvitation = async (eventId, response) => {
    try {
      // const apiResponse = await replyInvitation(eventId, option)
      const data = {
        userId: me._id,
        status: response === 'accept' ? 'ACCEPTED' : 'DENIED',
      };

      const apiResponse = await respondJoinEvent(eventId, data);
      if (!apiResponse.success) {
        Toast.error('Failed to deny request');
        return;
      }

      if (!apiResponse.success) {
        throw new Error('Failed to respond to invitation');
      }

      // Update local state
      setInvitations((prev) =>
        prev.map((event) => {
          if (event._id === eventId) {
            return {
              ...event,
              participants: event.participants.map((participant) => {
                if (participant.userId === user._id) {
                  return {
                    ...participant,
                    status: response === 'accept' ? 'ACCEPTED' : 'DECLINED',
                    respondedAt: new Date().toISOString(),
                  };
                }
                return participant;
              }),
            };
          }
          return event;
        })
      );

      Toast.success(
        `You have ${response === 'accept' ? 'accepted' : 'declined'} the invitation`
      );
    } catch (error) {
      Toast.warning('Failed to respond to invitation');
      console.error('Error responding to invitation:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700"
          >
            <CheckCircle className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case 'DECLINED':
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-50 text-red-700"
          >
            <XCircle className="h-3 w-3" />
            Declined
          </Badge>
        );
      case 'INVITED':
      default:
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-amber-50 text-amber-700"
          >
            <HelpCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

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
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Event Invitations
          </h1>
          <p className="mt-2 text-gray-600">
            Manage invitations you've received to participate in events
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="all" className="text-base">
              All
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex h-60 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
                  <p className="text-gray-500">Loading invitations...</p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <h3 className="flex items-center gap-2 font-medium">
                  <XCircle className="h-5 w-5" />
                  Error loading invitations
                </h3>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            ) : filteredInvitations.length === 0 ? (
              <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8">
                <div className="text-center">
                  <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    No invitations found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'all'
                      ? "You don't have any event invitations yet."
                      : `You don't have any ${activeTab} invitations.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {paginatedInvitations.map((event) => {
                  const participantInfo = event.participants.find(
                    (p) => p.userId === user._id
                  );
                  const isPending = participantInfo.status === 'INVITED';

                  return (
                    <Card key={event._id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="h-48 w-full md:h-auto md:w-1/3">
                          <ImageCarousel images={event.images} />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <CardContent className="flex-1 p-6">
                            <div className="mb-2 flex items-center justify-between">
                              <h2 className="text-xl font-bold text-gray-900">
                                {event.title}
                              </h2>
                              {getStatusBadge(participantInfo.status)}
                            </div>

                            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                              {event.description}
                            </p>

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                <span>
                                  {formatDate(event.startDate)}
                                  {event.startDate !== event.endDate &&
                                    ` - ${formatDate(event.endDate)}`}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-2 h-4 w-4 text-green-500" />
                                <span>
                                  {event.startTime} - {event.endTime}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="mr-2 h-4 w-4 text-red-500" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Users className="mr-2 h-4 w-4 text-purple-500" />
                                <span>
                                  Max {event.maxParticipants} participants
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <CustomAvatar
                                src={event.organizer.avatar}
                                fallbackText={event.organizer.name.charAt(0)}
                                alt={event.organizer.name}
                                _className="h-8 w-8"
                              />
                              <div>
                                <p className="text-xs text-gray-500">
                                  Organized by
                                </p>
                                <p className="text-sm font-medium">
                                  {event.organizer.name}
                                </p>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="border-t bg-gray-50 p-4">
                            <div className="flex w-full items-center justify-between">
                              <p className="text-xs text-gray-500">
                                Invited on{' '}
                                {format(
                                  parseISO(participantInfo.invitedAt),
                                  'MMM d, yyyy'
                                )}
                              </p>

                              {isPending ? (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      respondToInvitation(event._id, 'decline')
                                    }
                                    variant="outline"
                                    className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                  >
                                    Decline
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      respondToInvitation(event._id, 'accept')
                                    }
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                  >
                                    Accept
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() =>
                                    navigate(`/event/${event._id}`)
                                  }
                                  variant="outline"
                                >
                                  View Event
                                </Button>
                              )}
                            </div>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
            {/* Pagination */}
            {!loading && !error && filteredInvitations.length > 0 && (
              <div className="mt-8 w-full">
                <div className="max-w-full overflow-hidden">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredInvitations.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    itemName="invitations"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
