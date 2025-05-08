import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useInvitation } from '@/hooks/useInvitation.js';
import { Loader2 } from 'lucide-react';
import { formatDateTime } from '@/helpers/format.js';

const EventRSVP = ({ event }) => {
  const {
    fetchRSVPByInvitationId,
    invitations,
    totalInvitations,
    loading,
    error,
  } = useInvitation();

  const [invitationsWithRSVP, setInvitationsWithRSVP] = useState([]);
  const [fetchingRSVPs, setFetchingRSVPs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch RSVP for each invitation when invitations change
  useEffect(() => {
    console.log('Invitations state in EventRSVP:', invitations);
    const loadRSVPs = async () => {
      if (!invitations || invitations.length === 0) {
        setInvitationsWithRSVP([]);
        console.log('No invitations, resetting invitationsWithRSVP');
        return;
      }

      setFetchingRSVPs(true);
      try {
        const invitationsWithRSVPData = await Promise.all(
          invitations.map(async (invitation) => {
            const rsvp = await fetchRSVPByInvitationId(invitation._id);
            console.log(
              'Processed invitation:',
              invitation._id,
              'with RSVP:',
              rsvp
            );
            return {
              ...invitation,
              rsvpStatus: rsvp.response || 'PENDING',
              invitee: invitation.inviteeId || {
                _id: invitation.inviteeId,
                name: 'Unknown User',
                avatar: '',
              },
            };
          })
        );

        console.log('Setting invitationsWithRSVP:', invitationsWithRSVPData);
        setInvitationsWithRSVP(invitationsWithRSVPData);
      } catch (err) {
        console.error('Error fetching RSVPs:', err);
        setInvitationsWithRSVP([]);
      } finally {
        setFetchingRSVPs(false);
      }
    };

    loadRSVPs();
  }, [invitations, fetchRSVPByInvitationId]);

  const handlePageChange = (newPage) => {
    console.log('Changing to page:', newPage);
    setCurrentPage(newPage);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-green-100 text-green-800">Accepted</Badge>
        );
      case 'DENIED':
        return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
      case 'PENDING':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">Undefined</Badge>
        );
    }
  };


  const totalPages =
    Math.ceil(Number(totalInvitations) / Number(itemsPerPage)) || 1;

  return (
    <div className="max-w-full overflow-x-auto rounded-lg bg-gray-50 p-4 shadow-sm sm:p-6">
      {(loading || fetchingRSVPs) && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {error && <p className="py-4 text-center text-red-500">Lỗi: {error}</p>}
      {!loading && !fetchingRSVPs && invitationsWithRSVP.length > 0 ? (
        <>
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Participant</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">RSVP Status</TableHead>
                <TableHead className="w-[150px]">Time sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitationsWithRSVP.map((invitation) => (
                <TableRow key={invitation._id}>
                  <TableCell className="flex items-center gap-3">
                    <CustomAvatar
                      className="h-8 w-8"
                      src={invitation.invitee.avatar}
                      alt={invitation.invitee.name}
                      fallbackText={invitation.invitee.name || 'N/A'}
                    />
                    <span className="truncate">{invitation.invitee.name}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate sm:max-w-[300px]">
                    {invitation.content || 'No message provided'}
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.rsvpStatus)}</TableCell>
                  <TableCell>{formatDateTime(invitation.sentAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className={
                        currentPage === index + 1
                          ? 'bg-blue-100'
                          : 'cursor-pointer'
                      }
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        !loading &&
        !fetchingRSVPs && (
          <p className="py-4 text-center text-gray-500">
            No RSVPs found for this event.
          </p>
        )
      )}
    </div>
  );
};

export default EventRSVP;
