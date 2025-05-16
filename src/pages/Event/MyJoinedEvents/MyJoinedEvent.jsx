import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEvent } from '@/hooks/useEvent';
import { toast } from 'sonner';
import { PlusCircle, Eye, Calendar, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/shared/Pagination.jsx';
import { EventCard } from '@/components/shared/EventCard.jsx';
import EventFilters from '@/components/shared/EventFilters.jsx';
import useEventFiltering from '@/hooks/useEventFiltering.js';
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 9;

export default function MyJoinedEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user.user);
  const { getAllJoinedEvents } = useEvent();
  const location = useLocation();
  const navigate = useNavigate();

  // Use the custom hook for filtering
  const {
    searchTerm,
    setSearchTerm,
    visibilityFilter,
    setVisibilityFilter,
    selectedTypes,
    setSelectedTypes,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    filteredEvents,
    clearFilters,
  } = useEventFiltering(allEvents);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllJoinedEvents({
          page: 1,
          limit: 1000,
          isAcs: sortBy === 'oldest',
        });
        const events = (response.content.events || []).filter((event) => {
          for (const participant of event.participants) {
            if (
              participant.userId === user._id &&
              participant.status === 'ACCEPTED'
            ) {
              return true;
            }
          }
        });
        setAllEvents(events || []);
      } catch (err) {
        toast.error('Error fetching events: ' + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  // Calculate pagination
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  }, [filteredEvents]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 py-8">
      <div className="container mx-auto max-w-full px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Joined Events
            </h1>
            <p className="mt-1 text-gray-500">
              Events you have joined and are participating in
            </p>
          </div>

          <Link to="/event/create">
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Event Filters Component */}
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          visibilityFilter={visibilityFilter}
          setVisibilityFilter={setVisibilityFilter}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          showVisibilityFilter={false} // Hide visibility filter for joined events
        />

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <p className="text-sm text-gray-500">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <h3 className="flex items-center gap-2 font-medium">
              <X className="h-5 w-5" />
              Error loading events
            </h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && paginatedEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                actions={[
                  {
                    button: (
                      <Button
                        onClick={() => handleShowEvent(event._id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    ),
                    onClick: () => {},
                  },
                ]}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Calendar className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium">No joined events found</h3>
            <p className="mt-1 text-center text-gray-500">
              {searchTerm || selectedTypes.length > 0
                ? 'No events found matching your filters'
                : "You haven't joined any events yet"}
            </p>
            <Link to="/browse-events" className="mt-4">
              <Button>Browse Events</Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-8 w-full">
            <div className="max-w-full overflow-hidden">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredEvents.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="events"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
