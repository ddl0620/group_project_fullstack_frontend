import { useDispatch, useSelector } from 'react-redux';
import {
    addSentInvitation,
    setError,
    setInvitations,
    setLoading,
} from '@/store/slices/invitationSlice.js';
import {
    getInvitationsByEventIdAPI,
    getRSVPByInvitationIdAPI,
    sendInvitationToOneUserAPI,
} from '@/services/InvitationService.js';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';
import { useCallback, useRef } from 'react';

export const useInvitation = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.invitation.loading);
    const error = useSelector((state) => state.invitation.error);
    const invitations = useSelector((state) => state.invitation.invitations);
    const totalInvitations = useSelector((state) => state.invitation.total);

    // Cache để lưu trữ dữ liệu invitations đã fetch
    const invitationCache = useRef({});

    const sendInvitationToOneUser = useCallback(
        async (invitationData) => {
            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response =
                    await sendInvitationToOneUserAPI(invitationData);

                if (!response.success) {
                    throw new Error('Failed to send invitation');
                }
                dispatch(addSentInvitation(response.content.invitation));
                return response;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to send invitation: ' +
                        (error.response?.data?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchInvitationsByEventId = useCallback(
        async (
            eventId,
            page = 1,
            limit = 10,
            sortBy = 'desc',
            forceRefresh = false
        ) => {
            const cacheKey = `${eventId}-${page}-${limit}-${sortBy}`;

            // Kiểm tra cache hoặc nếu forceRefresh là true thì fetch lại
            if (!forceRefresh && invitationCache.current[cacheKey]) {
                console.log('Using cached invitations for:', cacheKey);
                dispatch(setInvitations(invitationCache.current[cacheKey]));
                return invitationCache.current[cacheKey];
            }

            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getInvitationsByEventIdAPI(
                    eventId,
                    page,
                    limit,
                    sortBy
                );

                if (!response.success) {
                    throw new Error('Failed to fetch invitations');
                }

                console.log(
                    'Fetched invitations:',
                    response.content.invitations
                );
                console.log('Total invitations:', response.content.total);
                const total = Number(response.content.total) || 0;
                const result = {
                    invitations: response.content.invitations || [],
                    total,
                };
                invitationCache.current[cacheKey] = result;
                dispatch(setInvitations(result));
                return response;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch invitations: ' +
                        (error.response?.data?.message || error.message)
                );
                throw error;
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    const fetchRSVPByInvitationId = useCallback(
        async (invitationId) => {
            try {
                dispatch(setError(null));
                dispatch(setLoading(true));
                checkToken();
                const response = await getRSVPByInvitationIdAPI(invitationId);

                if (!response.success) {
                    throw new Error('Failed to fetch RSVP');
                }

                console.log(
                    'Fetched RSVP for invitation',
                    invitationId,
                    ':',
                    response.content.rsvp
                );
                return response.content.rsvp;
            } catch (error) {
                dispatch(setError(error.message));
                Toast.error(
                    'Failed to fetch RSVP: ' +
                        (error.response?.data?.message || error.message)
                );
                return { invitationId, response: 'PENDING' };
            } finally {
                dispatch(setLoading(false));
            }
        },
        [dispatch]
    );

    return {
        sendInvitationToOneUser,
        fetchInvitationsByEventId,
        fetchRSVPByInvitationId,
        invitations,
        totalInvitations,
        loading,
        error,
    };
};

export default useInvitation;
