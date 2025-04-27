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
  getAllRepliesAPI,
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
    async (postId, content) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await createNewReplyAPI(postId, content);
        if (!response.success) {
          throw new Error('Failed to create post');
        }
        dispatch(addReply({ postId, reply: response.content.reply }));
        Toast.success('Reply created successfully');
        return response.content.reply;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to create reply: ' +
            (error.response?.content?.message || error.message)
        );
        throw error;
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
        console.log('Sử dụng dữ liệu từ cache:', cacheKey);
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

        console.log('Dữ liệu replies vừa fetch:', result.replies);
        cache.current[cacheKey] = result;
        dispatch(setReplies(result));
        return result;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Đã xảy ra lỗi khi lấy replies';
        dispatch(setError(errorMessage));
        Toast.error('Không thể lấy replies: ' + errorMessage);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updateReply = useCallback(
    async (replyId, content) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await updateReply(replyId, content);

        if (!response.success) {
          throw new Error('Failed to update reply');
        }

        console.log('Updated reply:', response.content.reply);
        dispatch(
          updateReplyAction({
            postId: response.content.reply.post_id,
            updatedReply: response.content.reply,
          })
        );
        Toast.success('Reply updated successfully');
        return response.content.reply;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to update post: ' +
            (error.response?.content?.message || error.message)
        );
        throw error;
      } finally {
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
        const response = await deleteReply(replyId);

        if (!response.success) {
          throw new Error('Failed to delete reply');
        }

        dispatch(removeReply({ postId, replyId }));
        Toast.success('Reply deleted successfully');
        return response.content;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to delete post: ' +
            (error.response?.content?.message || error.message)
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
