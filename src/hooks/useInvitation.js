import { useDispatch, useSelector } from 'react-redux';
import {
  addSentInvitation,
  setError,
  setInvitations,
  setLoading,
} from '@/store/slices/invitationSlice.js';
import {
  getSentInvitationsByEventIdAPI,
  getRSVPByInvitationIdAPI,
  sendInvitationToOneUserAPI,
  getReceivedInvitationByEventIdAPI, replyInvitationAPI,
} from '@/services/InvitationService.js';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';
import { useCallback, useRef } from 'react';

export const useInvitation = (callback, deps) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.invitation.loading);
  const error = useSelector((state) => state.invitation.error);
  const invitations = useSelector((state) => state.invitation.invitations);
  const totalInvitations = useSelector((state) => state.invitation.total);

  // Cache để lưu trữ dữ liệu invitations đã fetch
  const invitationCache = useRef({});
  const receivedIntitationCache = useRef({});

  const sendInvitationToOneUser = useCallback(
    async (invitationData) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await sendInvitationToOneUserAPI(invitationData);

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

  const fetchSentInvitationsByEventId = useCallback(
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
        const response = await getSentInvitationsByEventIdAPI(
          eventId,
          page,
          limit,
          sortBy
        );

        if (!response.success) {
          throw new Error('Failed to fetch invitations');
        }

        console.log('Fetched invitations:', response.content.invitations);
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

  const fetchReceivedInvitationsByEventId = useCallback(
    async (eventId, forceRefresh = false) => {
      const cacheKey = `received invitation ${eventId}`;

      // Kiểm tra cache hoặc nếu forceRefresh là true thì fetch lại
      if (!forceRefresh && receivedIntitationCache.current[cacheKey]) {
        // console.log('Using cached invitations for:', cacheKey);
        dispatch(setInvitations(receivedIntitationCache.current[cacheKey]));
        return receivedIntitationCache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));

        checkToken();

        const response = await getReceivedInvitationByEventIdAPI(eventId);

        if (!response.success) {
          throw new Error('Failed to fetch invitations');
        }
        return response;
      } catch (error) {
        Toast.error(
          'Failed to fetch invitations: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
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

  const replyInvitation = useCallback(async (invitationId, option) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      checkToken();
      const response = await replyInvitationAPI(invitationId, option);

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
      Toast.error(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  });

  return {
    sendInvitationToOneUser,
    replyInvitation,
    fetchReceivedInvitationsByEventId,
    fetchInvitationsByEventId: fetchSentInvitationsByEventId,
    fetchRSVPByInvitationId,
    invitations,
    totalInvitations,
    loading,
    error,
  };
};

export default useInvitation;
