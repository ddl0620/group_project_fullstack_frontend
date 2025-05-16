import { useState, useEffect, useMemo, useRef } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminManagement } from '@/hooks/useAdminManagement.js';
import { useSelector } from 'react-redux';
import { useUser } from '@/hooks/useUser.js';

// Import components

import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { Toast } from '@/helpers/toastService.js';
import EventFilters from '@/pages/Admin/EventManagement/components/EventFilters.jsx';
import EventTable from '@/pages/Admin/EventManagement/components/EventTable.jsx';
import EventModal from '@/pages/Admin/EventManagement/components/EventModal.jsx';
import EventDetailsModal from '@/pages/Admin/EventManagement/components/EventDetailsModal.jsx';
import Pagination from '@/components/shared/Pagination.jsx';

const EventManagement = () => {
  const { fetchEvents, updateActiveStatus, fetchUsers } = useAdminManagement();
  const { getUserById } = useUser();

  // Get events directly from Redux store
  const events = useSelector((state) => state.adminManagement.events);
  const pagination = useSelector(
    (state) => state.adminManagement.pagination.events
  );
  const loading = useSelector((state) => state.adminManagement.loading);

  // State for users specifically for the modal
  const [modalUsers, setModalUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const usersLoadedRef = useRef(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enhancedEvents, setEnhancedEvents] = useState([]);
  const [isEnhancingEvents, setIsEnhancingEvents] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents(pagination.page, pagination.limit, false);
  }, [fetchEvents, pagination.page, pagination.limit]);

  // Function to fetch users for the modal
  const fetchUsersForModal = async () => {
    if (usersLoadedRef.current) return;

    setIsLoadingUsers(true);
    try {
      // Fetch users with pagination - adjust limit as needed
      const response = await fetchUsers(1, 100, true);
      if (response.users) {
        setModalUsers(response.users);
        console.log(response.users);
        usersLoadedRef.current = true;
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users for event modal:', error);
      Toast.error('Failed to load users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Enhance events with user data for organizers and participants
  useEffect(() => {
    const enhanceEventsWithUserData = async () => {
      if (!events.length || isEnhancingEvents) return;

      setIsEnhancingEvents(true);

      try {
        // Create a map to store all user IDs that need to be fetched
        const userIdsToFetch = new Set();

        // Collect all user IDs from events (organizers and participants)
        events.forEach((event) => {
          // Add organizer ID
          if (event.organizer) {
            userIdsToFetch.add(event.organizer);
          }

          // Add participant IDs
          if (event.participants && event.participants.length > 0) {
            event.participants.forEach((participant) => {
              if (participant.userId) {
                userIdsToFetch.add(participant.userId);
              }
            });
          }
        });

        // Convert Set to Array for fetching
        const userIds = Array.from(userIdsToFetch);

        // Fetch all users in parallel
        const userResponses = await Promise.all(
          userIds.map((id) => getUserById(id))
        );

        // Create a map of user IDs to user data for easy lookup
        const userMap = {};
        userResponses.forEach((response, index) => {
          if (response && response.content) {
            userMap[userIds[index]] = response.content;
          }
        });

        // Enhance events with user data
        const enhanced = events.map((event) => {
          // Enhanced organizer
          const enhancedOrganizer = event.organizer
            ? userMap[event.organizer] || null
            : null;

          // Enhanced participants
          const enhancedParticipants = event.participants
            ? event.participants.map((participant) => ({
                ...participant,
                userId: participant.userId
                  ? userMap[participant.userId] || { name: 'Unknown User' }
                  : { name: 'Unknown User' },
              }))
            : [];

          // Return enhanced event
          return {
            ...event,
            organizer: enhancedOrganizer,
            participants: enhancedParticipants,
          };
        });

        setEnhancedEvents(enhanced);
      } catch (error) {
        console.error('Error enhancing events with user data:', error);
        Toast.error('Failed to load user data for events');
        // Fallback to original events if enhancement fails
        setEnhancedEvents(events);
      } finally {
        setIsEnhancingEvents(false);
      }
    };

    enhanceEventsWithUserData();
  }, [events]);

  // Filter events using useMemo to avoid unnecessary recalculations
  const filteredEvents = useMemo(() => {
    // Use enhanced events if available, otherwise use original events
    let result = [...(enhancedEvents.length ? enhancedEvents : events)];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        // Active events: not deleted and not ended
        result = result.filter(
          (event) => !event.isDeleted && new Date() <= new Date(event.endDate)
        );
      } else if (statusFilter === 'deleted') {
        // Deleted events
        result = result.filter((event) => event.isDeleted);
      } else if (statusFilter === 'ended') {
        // Ended events: not deleted but end date is in the past
        result = result.filter(
          (event) => !event.isDeleted && new Date() > new Date(event.endDate)
        );
      }
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter((event) => event.type === typeFilter);
    }

    return result;
  }, [enhancedEvents, events, searchTerm, statusFilter, typeFilter]);

  // Handle page change
  const paginate = async (pageNumber) => {
    await fetchEvents(pageNumber, pagination.limit);
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    setIsSubmitting(true);

    try {
      // await createEvent(organizerId, formData);
      setIsCreateModalOpen(false);

      // Refresh the event list
      fetchEvents(pagination.page, pagination.limit, false, true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event update
  const handleUpdateEvent = async () => {
    setIsSubmitting(true);

    try {
      // await updateEventInfo(eventId, formData);
      setIsEditModalOpen(false);

      // Refresh the event list
      fetchEvents(pagination.page, pagination.limit, false, true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event deletion (soft delete)
  const handleDeleteEvent = async (eventId) => {
    const confirmed = await AlertDialogUtils.danger({
      title: 'Delete Event',
      description: 'Are you sure you want to delete this event?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
    });

    if (!confirmed) return;

    try {
      await updateActiveStatus(eventId, {
        isDeleted: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Handle event restoration
  const handleRestoreEvent = async (eventId) => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Restore Event',
      description: 'Are you sure you want to restore this event?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
    });

    if (!confirmed) return;

    try {
      await updateActiveStatus(eventId, {
        isDeleted: false,
      });
      fetchEvents(pagination.page, pagination.limit, false, true);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle view event details
  const handleViewEvent = (event) => {
    // Find the enhanced version of the event if available
    const enhancedEvent =
      enhancedEvents.find((e) => e._id === event._id) || event;
    setSelectedEvent(enhancedEvent);
    setIsDetailsModalOpen(true);
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    // Find the enhanced version of the event if available
    const enhancedEvent =
      enhancedEvents.find((e) => e._id === event._id) || event;
    setSelectedEvent(enhancedEvent);

    // Ensure users are loaded before opening the edit modal
    fetchUsersForModal().then(() => {
      setIsEditModalOpen(true);
    });
  };

  // Handle opening create modal - ensure users are loaded first
  const handleOpenCreateModal = () => {
    fetchUsersForModal().then(() => {
      setIsCreateModalOpen(true);
    });
  };

  // Get users for the event modal - use our independently fetched users if available,
  // otherwise fall back to Redux state
  const reduxUsers = useSelector((state) => state.adminManagement.users);
  const availableUsers = modalUsers.length > 0 ? modalUsers : reduxUsers;

  // Determine if we're still loading data
  const isDataLoading = loading || isEnhancingEvents;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
        Event Management
      </h1>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <Button
          className="mt-4 whitespace-nowrap md:mt-0"
          onClick={handleOpenCreateModal}
          disabled={isLoadingUsers}
        >
          {isLoadingUsers ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            <>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </>
          )}
        </Button>
      </div>

      {/* Events Table */}
      <EventTable
        events={filteredEvents}
        isLoading={isDataLoading}
        handleDeleteEvent={handleDeleteEvent}
        handleRestoreEvent={handleRestoreEvent}
        handleViewEvent={handleViewEvent}
        handleEditEvent={handleEditEvent}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={paginate}
        totalItems={pagination.totalEvents}
        itemsPerPage={pagination.limit}
        itemName="events"
      />

      {/* Modals */}
      <EventModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onSubmit={handleCreateEvent}
        isLoading={isSubmitting}
        users={availableUsers}
      />

      <EventModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        event={selectedEvent}
        onSubmit={handleUpdateEvent}
        isLoading={isSubmitting}
        users={availableUsers}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventManagement;
