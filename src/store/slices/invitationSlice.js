import { createSlice } from '@reduxjs/toolkit';

const invitationSlice = createSlice({
    name: 'invitation',
    initialState: {
        sentInvitations: [],
        receivedInvitations: [],
        currentInvitation: null,
        invitations: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        error: null,
    },
    reducers: {
        addSentInvitation(state, action) {
            state.invitations.push(action.payload);
        },
        addReceivedInvitation(state, action) {
            state.receivedInvitations.push(action.payload);
        },
        updateSentInvitation(state, action) {
            const updatedInvitation = action.payload;
            state.sentInvitations = state.sentInvitations.map((invitation) =>
                invitation._id === updatedInvitation._id
                    ? updatedInvitation
                    : invitation
            );
        },
        setInvitations(state, action) {
            state.invitations = action.payload.invitations;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            console.log('Updated invitations state:', state.invitations); // Debug
        },
        updateReceivedInvitation(state, action) {
            const updatedInvitation = action.payload;
            state.receivedInvitations = state.receivedInvitations.map(
                (invitation) =>
                    invitation._id === updatedInvitation._id
                        ? updatedInvitation
                        : invitation
            );
        },
        removeSentInvitation(state, action) {
            const id = action.payload;
            state.sentInvitations = state.sentInvitations.filter(
                (invitation) => invitation._id !== id
            );
        },
        removeReceivedInvitation(state, action) {
            const id = action.payload;
            state.receivedInvitations = state.receivedInvitations.filter(
                (invitation) => invitation._id !== id
            );
        },
        setCurrentInvitation(state, action) {
            state.currentInvitation = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setInvitations,
    addSentInvitation,
    addReceivedInvitation,
    updateSentInvitation,
    updateReceivedInvitation,
    removeSentInvitation,
    removeReceivedInvitation,
    setCurrentInvitation,
    setLoading,
    setError,
} = invitationSlice.actions;

export default invitationSlice.reducer;
