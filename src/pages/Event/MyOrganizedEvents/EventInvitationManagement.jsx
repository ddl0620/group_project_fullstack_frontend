import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser.js';
import Button from '@/components/shared/SubmitButton.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { Toast } from '@/helpers/toastService.js';
import { AlertDialogUtils } from '@/helpers/AlertDialog.jsx';
import useInvitation from '@/hooks/useInvitation.js';

const EventInvitationManagement = ({ event }) => {
  const [participants, setParticipants] = useState([]);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [sentParticipants, setSentParticipants] = useState(new Set());
  const { getUserById } = useUser();
  const { sendInvitationToOneUser } = useInvitation();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantPromises =
          event?.participants?.map((participantInfo) =>
            getUserById(participantInfo.userId)
              .then((res) => {
                if (res?.content && participantInfo.status === 'ACCEPTED') {
                  return {
                    ...res.content,
                    status: participantInfo.status,
                  };
                }
                return null;
              })
              .catch((error) => {
                console.warn(
                  `Failed to fetch user with ID ${participantInfo.userId}:`,
                  error
                );
                return null;
              })
          ) || [];

        const fetchedParticipants = (
          await Promise.all(participantPromises)
        ).filter((participant) => participant !== null);

        setParticipants(fetchedParticipants);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setParticipants([]);
      }
    };

    if (event?.participants?.length > 0) {
      fetchParticipants();
    } else {
      setParticipants([]);
    }
  }, []);

  const handleSendInvitation = async (participantId) => {
    if (!invitationMessage.trim()) {
      Toast.warning('Invitation message is empty');
      return;
    }
    const confirmed = await AlertDialogUtils.info({
      title: 'Sent Invitation to this user?',
      description: 'Send to make sure they can join the event.',
      confirmText: 'Join now',
      cancelText: 'Cancel',
    });

    if (!confirmed) {
      Toast.info('Invitation sending cancelled');
      return;
    }

    const invitationData = {
      eventId: event._id,
      inviteeId: participantId,
      content: invitationMessage,
    };

    const response = await sendInvitationToOneUser(invitationData);
    if (response.success) {
      Toast.success('Invitation sent successfully');
    }

    setSentParticipants((prev) => new Set(prev).add(participantId));
    setTimeout(() => {
      setSentParticipants((prev) => {
        const newSet = new Set(prev);
        newSet.delete(participantId);
        return newSet;
      });
    }, 2000);
  };

  const handleSendAllInvitations = () => {
    if (!invitationMessage.trim()) {
      console.warn('Invitation message is empty');
      return;
    }
    if (participants.length === 0) {
      console.warn('No accepted participants to send invitations to');
      return;
    }
    console.log(
      `Sending invitations to ${participants.map((p) => p._id).join(', ')}: ${
        invitationMessage
      }`
    );
    setSentParticipants(
      (prev) => new Set([...prev, ...participants.map((p) => p._id)])
    );
    setTimeout(() => {
      setSentParticipants((prev) => new Set());
    }, 2000);
  };

  return (
    <div className="min-h-[300px] rounded-xl bg-gray-100 p-6 shadow-sm">
      {/* Invitation Textarea and Send-All Button */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
        <textarea
          value={invitationMessage}
          onChange={(e) => setInvitationMessage(e.target.value)}
          placeholder="Enter invitation message..."
          rows={4}
          className="flex-1 resize-none rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Participant List */}
      {participants.length > 0 ? (
        <div className="flex flex-col gap-4">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <CustomAvatar
                  className="hidden h-10 w-10 sm:block"
                  src={participant.avatar}
                  alt={participant.name}
                  fallbackText={participant.name}
                />
                <span className="text-sm font-medium text-gray-900">
                  {participant.name || 'No name'}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                  ACCEPTED
                </span>
              </div>
              <div className="flex items-center gap-2">
                {sentParticipants.has(participant._id) ? (
                  <span className="px-4 py-2 text-sm font-medium text-green-600">
                    Sent
                  </span>
                ) : (
                  <Button
                    onClick={() => handleSendInvitation(participant._id)}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    aria-label={`Send invitation to ${participant.name || 'participant'}`}
                  >
                    Send
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm font-medium text-gray-500">
          No accepted participants to manage.
        </p>
      )}
    </div>
  );
};

export default EventInvitationManagement;
