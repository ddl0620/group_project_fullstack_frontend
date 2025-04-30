import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SectionTitle from '../../ProfilePage/SectionTitle.jsx';
import Button from '../../../components/shared/SubmitButton.jsx';
import {
  PlusCircleIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { EditIcon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEvent } from '@/hooks/useEvent.js';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { EventCard } from '@/components/shared/EventCard.jsx';

const itemPerPage = 9;

function MyOrganizedEvents() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getMyEvents, deleteEvent, loading, error } = useEvent();
  const myEvents = useSelector((state) => state.event.myEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemPerPage,
    totalPages: 1,
    totalEvents: 0,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getMyEvents({
          page: currentPage,
          limit: itemPerPage,
          isAcs: true,
        });
        // Assuming the response structure matches the API
        setPagination({
          page: response.content.pagination.page || 1,
          limit: response.content.pagination.limit || itemPerPage,
          totalPages: response.content.pagination.totalPages || 1,
          totalEvents: response.content.pagination.totalEvents || 0,
        });
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [currentPage]);

  const handleEditButton = (eventId) => {
    navigate(`/event/update/${eventId}`);
  };

  const handleRemoveEvent = async (id) => {
    const confirmed = await AlertDialogUtils.warning({
      title: 'Delete Event?',
      description:
        'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!confirmed) return;
    await deleteEvent(id);
  };

  const handleLinkClick = (e) => {
    if (location.pathname === '/events') {
      e.preventDefault();
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of page
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
              title={'Organized Events'}
              subtitle={'List of events you have created'}
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

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {myEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              actions={[
                {
                  button: (
                    <Button className="flex items-center gap-2 border border-red-300 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white">
                      <TrashIcon className="h-5 w-5 text-red-400" />
                      Delete
                    </Button>
                  ),
                  onClick: () => handleRemoveEvent(event._id),
                },
                {
                  button: (
                    <Button className="flex items-center gap-2 border border-blue-500 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white">
                      <EditIcon className="h-5 w-5 text-blue-500" />
                      Edit
                    </Button>
                  ),
                  onClick: () => handleEditButton(event._id),
                },
                {
                  button: (
                    <Button className="flex items-center gap-2 border border-green-500 bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-white">
                      <EyeIcon className="h-5 w-5 text-green-700" />
                      View Details
                    </Button>
                  ),
                  onClick: () => handleEditButton(event._id),
                },
              ]}
            />
          ))}
        </div>

        {pagination.totalEvents > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex}-{endIndex} of {pagination.totalEvents} events
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(pagination.page - 1)}
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
                        onClick={() => handlePageChange(item.value)}
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
                    onClick={() => handlePageChange(pagination.page + 1)}
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
        )}

        {!loading && myEvents.length === 0 && (
          <div className="mt-8 rounded-lg bg-white py-16 text-center shadow-sm">
            <PlusCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-500">
              No events found. Create your first event!
            </p>
            <Link
              to="/event/create"
              onClick={handleLinkClick}
              className="mt-4 inline-block"
            >
              <Button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700">
                <PlusCircleIcon className="h-5 w-5" />
                <span>Create New Event</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(MyOrganizedEvents);