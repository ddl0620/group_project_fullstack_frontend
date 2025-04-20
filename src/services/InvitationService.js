import APIServices from "@/services/APIServices.js";

export const sendInvitationToOneUserAPI = async (invitationData) => {
    const response = await APIServices.post(
        `/api/v1/invitation/invitations`,
        invitationData
    );
    return response.data;
};
