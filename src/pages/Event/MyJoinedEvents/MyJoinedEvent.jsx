import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent.js';
import SectionTitle from '@/pages/ProfilePage/SectionTitle.jsx';
import { Button } from '@mui/material';
import EventCard from '@/components/shared/EventCard.jsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const itemPerPage = 9;

function MyJoinedEvent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemPerPage,
    totalPages: 1,
    totalEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllJoinedEvents } = useEvent();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllJoinedEvents({
          page: currentPage,
          limit: itemPerPage,
          isAcs: true,
        });
        setEvents(response.content.events || []);
        setPagination({
          page: response.content.pagination.page || 1,
          limit: response.content.pagination.limit || itemPerPage,
          totalPages: response.content.pagination.totalPages || 1,
          totalEvents: response.content.pagination.totalEvents || 0,
        });
      } catch (err) {
        toast.error('Error fetching events: ' + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [currentPage]);

  const handleChangeCurrentPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of page
  };

  const handleShowEvent = async (eventId) => {
    navigate(`/events/${eventId}`); // Navigate to event detail page
  };

  const handleLinkClick = (e) => {
    if (location.pathname === '/events') {
      e.preventDefault(); // Prevent navigation if already on the same route
    }
  };

  // Calculate display information
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.totalEvents);

  // Generate page numbers for display (limit the number of page buttons shown)
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add pages and ellipsis if needed
    if (startPage > 1) {
      pages.push({ type: 'page', value: 1 });
      if (startPage > 2) {
        pages.push({ type: 'ellipsis', value: 'left' });
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: 'page', value: i });
    }

    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pages.push({ type: 'ellipsis', value: 'right' });
      }
      pages.push({ type: 'page', value: pagination.totalPages });
    }

    return pages;
  };

  return (
    <div className="h-auto min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="my-5">
            <SectionTitle
              title={'My Joined Events'}
              subtitle={'List of events you have joined'}
            />
          </div>
          <Link to="/event/create" onClick={handleLinkClick}>
            <Button className={'bg-black text-white'}>
              <PlusCircleIcon className="h-5 w-5" />
              Create new
            </Button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  actions={[
                    {
                      button: (
                        <Button
                          onClick={() => handleShowEvent(event._id)}
                          className="flex items-center bg-blue-500 text-white"
                        >
                          <EyeIcon className="h-5 w-5" />
                          View
                        </Button>
                      ),
                      onClick: () => navigate(`/events/${event._id}`),
                    },
                  ]}
                />
              ))}
            </div>

            {/* Pagination and Showing Information */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex}-{endIndex} of {pagination.totalEvents} events
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handleChangeCurrentPage(pagination.page - 1)}
                      className={
                        pagination.page === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers().map((item, index) =>
                    item.type === 'page' ? (
                      <PaginationItem key={item.value}>
                        <PaginationLink
                          onClick={() => handleChangeCurrentPage(item.value)}
                          isActive={pagination.page === item.value}
                          className={
                            pagination.page === item.value
                              ? 'bg-blue-500 text-white'
                              : 'cursor-pointer'
                          }
                        >
                          {item.value}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`ellipsis-${item.value}-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handleChangeCurrentPage(pagination.page + 1)}
                      className={
                        pagination.page === pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="mt-8 rounded-lg bg-white py-16 text-center shadow-sm">
            <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-500">
              No events found. Join your first event!
            </p>
            <Link
              to="/event/create"
              onClick={handleLinkClick}
              className="mt-4 inline-block"
            >
              <button className="flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-white hover:bg-gray-700">
                <PlusCircleIcon className="h-5 w-5" />
                <span>Create New Event</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(MyJoinedEvent);