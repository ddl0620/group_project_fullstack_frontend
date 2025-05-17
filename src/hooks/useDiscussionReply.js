// src/hooks/useDiscussionReply.js
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';

import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';
import {
  addReply,
  removeReply,
  setError,
  setLoading,
  setReplies,
  updateReply as updateReplyAction,
} from '@/store/slices/DiscussionReplySlice.js';
import {
  createNewReplyAPI,
  deleteReplyAPI,
  getAllRepliesAPI,
  updateReplyAPI,
} from '@/services/DiscussionReplyService.js';
export const useDiscussionReply = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.discussionReply.loading);
  const error = useSelector((state) => state.discussionReply.error);
  const repliesByPostId = useSelector(
    (state) => state.discussionReply.repliesByPostId
  );

  // Cache to store fetched posts
  const cache = useRef({});

  const createNewReply = useCallback(
    async (postId, formData) => {
      const toastId = Toast.loading('Posting...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        console.log(formData.getAll('parent_reply_id'));
        const response = await createNewReplyAPI(postId, formData);
        if (!response.success) {
          throw new Error('Failed to create post');
        }
        dispatch(addReply({ postId, reply: response.content.reply }));
        // Toast.info('Posted', 'Reply created successfully');
        return response.content.reply;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to create reply: ',
          error.response?.data?.message || error.message
        );
        throw error;
      } finally {
        Toast.dismiss(toastId);
      }
    },
    [dispatch]
  );

  const fetchReplies = useCallback(
    async (postId, page = 1, limit = 10, forceRefresh = false) => {
      const cacheKey = `${postId}-${page}-${limit}`;
      if (
        !forceRefresh &&
        cache.current[cacheKey] &&
        cache.current[cacheKey] !== null
      ) {
        dispatch(setReplies({ postId, ...cache.current[cacheKey] }));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getAllRepliesAPI(postId, { page, limit });

        if (!response.success) {
          throw new Error('Can not fetch replies');
        }

        const fetchedReplies = Array.isArray(response.content.replies)
          ? response.content.replies
          : response.content.replies &&
              typeof response.content.replies === 'object'
            ? [response.content.replies]
            : [];

        const result = {
          postId,
          replies: fetchedReplies,
          pagination: response.content.pagination || {
            page: page || 1,
            limit: limit || 10,
            total: fetchedReplies.length,
          },
        };

        cache.current[cacheKey] = result;
        dispatch(setReplies(result));
        return result;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Error fetching replies';
        dispatch(setError(errorMessage));
        Toast.error('Cant get replies', errorMessage);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateReply = useCallback(
    async (replyId, content) => {
      const toastId = Toast.loading('Updating reply...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await updateReplyAPI(replyId, content);

        if (!response.success) {
          throw new Error('Failed to update reply');
        }
        dispatch(
          updateReplyAction({
            postId: response.content.reply.post_id,
            updatedReply: response.content.reply,
          })
        );
        Toast.info('Updated', 'Reply updated successfully');
        return response.content.reply;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to update post: ',
          error.response?.content?.message || error.message
        );
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const deleteReply = useCallback(
    async (postId, replyId) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await deleteReplyAPI(replyId);

        if (!response.success) {
          throw new Error('Failed to delete reply');
        }

        dispatch(removeReply({ postId, replyId }));
        Toast.success('Deleted', 'Reply deleted successfully.');
        return response.content;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to delete post: ',
          error.response?.content?.message || error.message
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  return {
    loading,
    error,
    repliesByPostId,
    createNewReply,
    fetchReplies,
    updateReply,
    deleteReply,
  };
};

export default useDiscussionReply;
