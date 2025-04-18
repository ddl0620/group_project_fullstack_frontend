import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser.js';
import Button from '@/components/shared/SubmitButton.jsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {useEvent} from "@/hooks/useEvent.js";

const EventRequestManagement = ({ event }) => {
    const [participants, setParticipants] = useState([]);
    const { getUserById } = useUser();
    const {respondJoinEvent} = useEvent();

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
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
                setParticipants([]);
            }
        };

        if (event?.participants?.length > 0) {
            fetchParticipants();
        } else {
            setParticipants([]);
        }
    }, []);

    const handleAccept = async (participantId, status) => {
        const confirmed = await AlertDialogUtils.info({
            title: 'Do you want to accept this request?',
            description: 'This action cannot be undone.',
            confirmText: 'Accept',
            cancelText: 'Cancel',
            variant: 'warning',
        });
        if (!confirmed) return;
        const data = {
            userId: participantId,
            status: 'ACCEPTED',
        }
        const respond =  await respondJoinEvent(event._id, data)
        if(!respond.success) return;
        setParticipants((prev) =>
            prev.map((p) =>
                p._id === participantId ? { ...p, status: 'ACCEPTED' } : p
            )
        );
    };

    const handleDeny = async (participantId) => {
        const confirmed = await AlertDialogUtils.info({
            title: 'Do you want to denied this request?',
            description: 'This action cannot be undone.',
            confirmText: 'Continue',
            cancelText: 'Cancel',
            variant: 'warning',
        });

        if (!confirmed) return;
        const data = {
            userId: participantId,
            status: 'DENIED',
        }
        const respond =  await respondJoinEvent(event._id, data)
        if(!respond.success) return;

        setParticipants((prev) =>
            prev.map((p) =>
                p._id === participantId ? { ...p, status: 'DENIED' } : p
            )
        );
    };

    const handleRemove = async (participantId) => {
        const confirmed = await AlertDialogUtils.warning({
            title: 'Do you want to delete this participant?',
            description: 'This action cannot be undone.',
            confirmText: 'Continue',
            cancelText: 'Cancel',
            variant: 'warning',
        });

        if (!confirmed) return;

        setParticipants((prev) => prev.filter((p) => p._id !== participantId));
    };

    return (
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
            {participants.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {participants.map((participant) => (
                        <div
                            key={participant._id}
                            className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900"></span>
                                <div
                                    className={
                                        'flex flex-row items-center justify-start gap-3 text-gray-900'
                                    }
                                >
                                    <CustomAvatar
                                        _classname={"hidden sm:block"}
                                        src={'participant.avatar'}
                                        alt={participant.name}
                                        fallbackText={participant.name}
                                    />
                                    {participant.name ||
                                        'No name'}
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
                                        <button
                                            className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                                            onClick={() =>
                                                handleAccept(participant._id)
                                            }
                                            aria-label={`Accept ${participant.name || 'participant'}`}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                                            onClick={() =>
                                                handleDeny(participant._id)
                                            }
                                            aria-label={`Deny ${participant.name || 'participant'}`}
                                        >
                                            Deny
                                        </button>
                                    </>
                                ) : participant.status === 'ACCEPTED' ? (
                                    // <button
                                    //     className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                                    //     onClick={() =>
                                    //         handleRemove(participant._id)
                                    //     }
                                    //     aria-label={`Remove ${participant.name || 'participant'}`}
                                    // >
                                    //     ✕
                                    // </button>

                                    <Button
                                        onClick={() =>
                                            handleRemove(participant._id)
                                        }
                                        className={
                                            'rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600'
                                        }
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    No participants to manage.
                </p>
            )}
        </div>
    );
};

export default EventRequestManagement;
