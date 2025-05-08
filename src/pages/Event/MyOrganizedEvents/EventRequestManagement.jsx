import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/hooks/useUser.js';
import Button from '@/components/shared/SubmitButton.jsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import { useEvent } from '@/hooks/useEvent.js';
import { Toast } from '@/helpers/toastService.js';

const EventRequestManagement = React.memo(({ event }) => {
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [error, setError] = useState(null);
  const { getUserById } = useUser();
  const { respondJoinEvent } = useEvent();

  // Memoize fetchParticipants to avoid redefinition
  const fetchParticipants = useCallback(async () => {
    try {
      setLoadingParticipants(true);
      setError(null);
      const participantPromises =
        event?.participants?.map((participantInfo) =>
          getUserById(participantInfo.userId)
            .then((res) => {
              if (res?.content) {
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
      setError('Failed to load participants');
      setParticipants([]);
      Toast.error('Failed to load participants');
    } finally {
      setLoadingParticipants(false);
    }
  }, [getUserById]); // Chỉ phụ thuộc vào getUserById

  useEffect(() => {
    let isMounted = true;
    if (event?.participants?.length > 0) {
      console.log('Fetching participants for event:', event._id);
      const fetchData = async () => {
        if (isMounted) {
          await fetchParticipants();
        }
      };
      fetchData();
    } else if (isMounted) {
      setParticipants([]);
    }

    return () => {
      isMounted = false;
    };
  }, []); // Chỉ phụ thuộc vào event._id và fetchParticipants

  const handleAccept = async (participantId) => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Accept Request?',
      description:
        'Do you want to accept this request? This action cannot be undone.',
      confirmText: 'Accept',
      cancelText: 'Cancel',
      variant: 'warning',
    });
    if (!confirmed) return;

    const data = {
      userId: participantId,
      status: 'ACCEPTED',
    };
    try {
      const respond = await respondJoinEvent(event._id, data);
      if (!respond.success) {
        Toast.error('Failed to accept request');
        return;
      }
      Toast.success('Request accepted successfully');
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === participantId ? { ...p, status: 'ACCEPTED' } : p
        )
      );
    } catch (error) {
      Toast.error('Failed to accept request');
    }
  };

  const handleDeny = async (participantId) => {
    const confirmed = await AlertDialogUtils.info({
      title: 'Deny Request?',
      description:
        'Do you want to deny this request? This action cannot be undone.',
      confirmText: 'Deny',
      cancelText: 'Cancel',
      variant: 'warning',
    });

    if (!confirmed) return;

    const data = {
      userId: participantId,
      status: 'DENIED',
    };
    try {
      const respond = await respondJoinEvent(event._id, data);
      if (!respond.success) {
        Toast.error('Failed to deny request');
        return;
      }
      Toast.success('Request denied successfully');
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === participantId ? { ...p, status: 'DENIED' } : p
        )
      );
    } catch (error) {
      Toast.error('Failed to deny request');
    }
  };

  const handleRemove = async (participantId) => {
    const confirmed = await AlertDialogUtils.warning({
      title: 'Remove Participant?',
      description:
        'Do you want to remove this participant? This action cannot be undone.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'warning',
    });

    if (!confirmed) return;

    const data = {
      userId: participantId,
      status: 'REMOVED',
    };
    try {
      const respond = await respondJoinEvent(event._id, data);
      if (!respond.success) {
        Toast.error('Failed to remove participant');
        return;
      }
      Toast.success('Participant removed successfully');
      setParticipants((prev) => prev.filter((p) => p._id !== participantId));
    } catch (error) {
      Toast.error('Failed to remove participant');
    }
  };

  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
      {loadingParticipants ? (
        <p className="text-center text-gray-500">Loading participants...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : participants.length > 0 ? (
        <div className="flex flex-col gap-4">
          {participants.map((participant) => (
            <div
              key={participant._id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-row items-center justify-start gap-3 text-gray-900">
                  <CustomAvatar
                    className="hidden h-10 w-10 sm:block"
                    src={participant.avatar}
                    alt={participant.name}
                    fallbackText={participant.name}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {participant.name || 'No name'}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    participant.status === 'ACCEPTED'
                      ? 'bg-green-100 text-green-800'
                      : participant.status === 'DENIED'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {participant.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {participant.status === 'PENDING' ? (
                  <>
                    <Button
                      onClick={() => handleAccept(participant._id)}
                      className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                      aria-label={`Accept ${participant.name || 'participant'}`}
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDeny(participant._id)}
                      className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                      aria-label={`Deny ${participant.name || 'participant'}`}
                    >
                      Deny
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No participants to manage.</p>
      )}
    </div>
  );
});

export default EventRequestManagement;
