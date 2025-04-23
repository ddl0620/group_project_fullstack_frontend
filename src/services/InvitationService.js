import APIServices from '@/services/APIServices.js';

export const sendInvitationToOneUserAPI = async (invitationData) => {
    const response = await APIServices.post(
        `/api/v1/invitation/invitations`,
        invitationData
    );
    return response.data;
};

export const getInvitationsByEventIdAPI = async (eventId, page = 1, limit = 10, sortBy = 'desc') => {
    const response = await APIServices.get(`/api/v1/invitation/invitations/event`, {
        params: { eventId, page, limit, sortBy },
    });
    return response.data;
};

export const getRSVPByInvitationIdAPI = async (invitationId) => {
    const response = await APIServices.get(`/api/v1/invitation/invitations/${invitationId}/rsvp`);
    return response.data;
};