import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/shared/CustomAvatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function EventInvitationsList({
  invitations,
  onAccept,
  onDecline,
  onStatusChange,
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [action, setAction] = useState(null);

  console.log(invitations);
  // Update the EventInvitationsList component to allow changing RSVP status

  // First, add a new function to handle changing the RSVP status
  const handleChangeStatus = (invitation, newStatus) => {
    // Don't do anything if the status is already the same
    if (invitation.status === newStatus) return;

    setSelectedInvitation(invitation);
    setAction(newStatus.toLowerCase());
    setConfirmDialogOpen(true);
  };

  // Update the confirmAction function to handle all status changes
  const confirmAction = () => {
    if (action === 'accept') {
      onAccept(selectedInvitation._id);
    } else if (action === 'decline') {
      onDecline(selectedInvitation._id);
    } else if (action === 'pending') {
      // Add handling for setting status back to pending
      // In a real app, you would call an API endpoint
      // await setPendingEventInvitation(selectedInvitation._id)

      // Update local state for demo
      onStatusChange(selectedInvitation._id, 'PENDING');
    }
    setConfirmDialogOpen(false);
  };

  const handleAction = (invitation, actionType) => {
    setSelectedInvitation(invitation);
    setAction(actionType);
    setConfirmDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-amber-50 text-amber-700"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
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
      default:
        return null;
    }
  };

  if (!invitations || invitations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <p className="text-gray-500">No invitations found</p>
      </div>
    );
  }

  // Replace the existing invitation card rendering with this updated version that includes status change options
  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <div
          key={invitation._id}
          className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <CustomAvatar
              src={invitation.invitedBy.avatar}
              fallbackText={invitation.invitedBy.name.charAt(0)}
              alt={invitation.invitedBy.name}
              className="h-10 w-10"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{`${invitation.invitedBy.name} (Host)`}</p>
                  <p className="text-xs text-gray-500">
                    {format(
                      new Date(invitation.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                {getStatusBadge(invitation.status)}
              </div>

              <p className="mt-2 text-sm text-gray-600">{invitation.content}</p>

              <div className="mt-4 flex justify-end gap-2">
                {/* Show different button sets based on current status */}
                {invitation.status === 'PENDING' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(invitation, 'decline')}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(invitation, 'accept')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                  </>
                ) : invitation.status === 'ACCEPTED' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeStatus(invitation, 'PENDING')}
                    >
                      Mark as Pending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeStatus(invitation, 'DECLINED')}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Decline
                    </Button>
                  </>
                ) : invitation.status === 'DECLINED' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeStatus(invitation, 'PENDING')}
                    >
                      Mark as Pending
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleChangeStatus(invitation, 'ACCEPTED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'accept'
                ? 'Accept Invitation?'
                : action === 'decline'
                  ? 'Decline Invitation?'
                  : 'Change to Pending?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'accept'
                ? 'You will be added to the event participants. This action can be changed later.'
                : action === 'decline'
                  ? 'You will decline this invitation. This action can be changed later.'
                  : 'You will change your response to pending. This action can be changed later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                action === 'accept'
                  ? 'bg-green-600 hover:bg-green-700'
                  : action === 'decline'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {action === 'accept'
                ? 'Accept'
                : action === 'decline'
                  ? 'Decline'
                  : 'Set to Pending'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
