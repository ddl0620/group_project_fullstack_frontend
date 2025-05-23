import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import {
  setPosts,
  setLoading,
  setError,
  addPost,
  updatePost as updatePostAction,
  removePost,
} from '@/store/slices/discussionPostSlice.js';
import {
  createPostAPI,
  getPostsAPI,
  getPostByIdAPI,
  updatePostAPI,
  deletePostAPI,
} from '@/services/DiscussionPostService.js';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';

export const useDiscussionPost = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.discussionPost.loading);
  const error = useSelector((state) => state.discussionPost.error);
  const posts = useSelector((state) => state.discussionPost.posts);
  const pagination = useSelector((state) => state.discussionPost.pagination);

  // Cache to store fetched posts
  const cache = useRef({});

  const createPost = useCallback(
    async (eventId, postData) => {
      const toastId = Toast.loading('Creating post...');
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await createPostAPI(eventId, postData);
        if (!response.success) {
          throw new Error();
        }

        dispatch(addPost(response.content.post));
        Toast.info('Posted', 'Post created successfully');
        return response.content.post;
      } catch (error) {
        dispatch(setError(error.response?.data?.message));
        throw error;
      } finally {
        Toast.dismiss(toastId);
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // src/hooks/useDiscussionPost.js
  const fetchPosts = useCallback(
    async (eventId, page = 1, limit = 10, forceRefresh = false) => {
      // Bao gồm page và limit trong cacheKey để tránh ghi đè dữ liệu của các lần fetch khác
      const cacheKey = `${eventId}-${page}-${limit}`;
      if (
        !forceRefresh &&
        cache.current[cacheKey] &&
        cache.current[cacheKey] !== null
      ) {
        dispatch(setPosts(cache.current[cacheKey]));
        return cache.current[cacheKey];
      }

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getPostsAPI(eventId, { page, limit });

        if (!response.success) {
          throw new Error('Cant fetch posts');
        }

        // Xử lý response.content.posts: nếu là object thì chuyển thành mảng
        const fetchedPosts = Array.isArray(response.content.posts)
          ? response.content.posts
          : response.content.posts && typeof response.content.posts === 'object'
            ? [response.content.posts]
            : [];

        const result = {
          posts: fetchedPosts,
          pagination: response.content.pagination || {
            page: 1,
            limit: 10,
            total: fetchedPosts.length,
          },
        };

        // Chỉ lưu vào cache nếu fetch thành công
        cache.current[cacheKey] = result;
        dispatch(setPosts(result));
        return result;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Error fetching posts';
        dispatch(setError(errorMessage));
        Toast.error('Cant not fetch posts: ', errorMessage);
        // Không lưu lỗi vào cache, giữ cache cũ nếu có
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchPostById = useCallback(
    async (eventId, postId) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await getPostByIdAPI(eventId, postId);

        if (!response.success) {
          throw new Error('Failed to fetch post');
        }

        return response.content.post;
      } catch (error) {
        dispatch(setError(error.message));
        Toast.error(
          'Failed to fetch post: ',
          error.response?.content?.message || error.message
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const updatePost = useCallback(
    async (postId, postData) => {
      const toastId = Toast.loading('Updating post...');

      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await updatePostAPI(postId, postData);

        if (!response.success) {
          throw new Error('Failed to update post');
        }
        dispatch(updatePostAction(response.content.post));
        Toast.info('Updated', 'Post updated successfully');
        return response.content.post;
      } catch (error) {
        dispatch(setError(error.response?.data?.message));
        Toast.error(
          'Failed to update post: ',
          error.response?.data?.message || error.message
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
        Toast.dismiss(toastId);
      }
    },
    [dispatch]
  );

  const deletePost = useCallback(
    async (eventId, postId) => {
      try {
        dispatch(setError(null));
        dispatch(setLoading(true));
        checkToken();
        const response = await deletePostAPI(eventId, postId);

        if (!response.success) {
          throw new Error('Failed to delete post');
        }

        dispatch(removePost({ postId }));
        Toast.success('Deleted', 'Post deleted successfully.');
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
    createPost,
    fetchPosts,
    fetchPostById,
    updatePost,
    deletePost,
    posts,
    pagination,
    loading,
    error,
  };
};

export default useDiscussionPost;
