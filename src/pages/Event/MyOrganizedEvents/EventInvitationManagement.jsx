import React, { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser.js';
import Button from '@/components/shared/SubmitButton.jsx';
import { CustomAvatar } from '@/components/shared/CustomAvatar.jsx';
import {Toast} from "@/helpers/toastService.js";
import useInvitation from "@/hooks/useInvitation.js";
import {AlertDialogUtils} from "@/helpers/AlertDialog.jsx";

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

                const fetchedParticipants = (await Promise.all(participantPromises)).filter(
                    (participant) => participant !== null
                );

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
            title: 'Joined Event?',
            description: 'Are you sure you want to join this event',
            confirmText: 'Join now',
            cancelText: 'Cancel',
        });

        if (!confirmed) {
            Toast.info("Invitation sending cancelled");
            return;
        }

        const invitationData = {
            eventId: event._id,
            inviteeId: participantId,
            content: invitationMessage,
        }

        const response = await sendInvitationToOneUser(invitationData);
        if(response.success){
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
        setSentParticipants((prev) => new Set([...prev, ...participants.map((p) => p._id)]));
        setTimeout(() => {
            setSentParticipants((prev) => new Set());
        }, 2000);
    };

    return (
        <div className="p-6 bg-gray-100 rounded-xl shadow-sm min-h-[300px]">
            {/* Invitation Textarea and Send-All Button */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <textarea
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            placeholder="Enter invitation message..."
            rows={4}
            className="flex-1 px-4 py-3 bg-white rounded-md border border-gray-200 text-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none shadow-sm transition-all resize-none"
        />
                <Button
                    onClick={handleSendAllInvitations}
                    disabled={!invitationMessage.trim() || participants.length === 0}
                    className={`px-6 py-3 text-sm font-medium text-white rounded-md transition-colors shadow-sm ${
                        !invitationMessage.trim() || participants.length === 0
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    Send All
                </Button>
            </div>

            {/* Participant List */}
            {participants.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {participants.map((participant) => (
                        <div
                            key={participant._id}
                            className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <CustomAvatar
                                    className="hidden sm:block h-10 w-10"
                                    src={participant.avatar}
                                    alt={participant.name}
                                    fallbackText={participant.name}
                                />
                                <span className="text-sm font-medium text-gray-900">
                  {participant.name || 'No name'}
                </span>
                                <span
                                    className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                                >
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
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
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
                <p className="text-center text-gray-500 text-sm font-medium">
                    No accepted participants to manage.
                </p>
            )}
        </div>
    );
};

export default EventInvitationManagement;