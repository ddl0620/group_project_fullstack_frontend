// src/services/DiscussionPostService.js
import APIServices from '@/services/APIServices.js';

export const createPostAPI = async (eventId, postData) => {
  console.log("PostData2: ", postData.getAll("images"));
  const response = await APIServices.post(
    `/api/v1/discussion-posts/${eventId}`,
    postData
  );
  return response.data;
};

export const getPostsAPI = async (eventId, params = {}) => {
  const response = await APIServices.get(
    `/api/v1/discussion-posts/${eventId}`,
    { params }
  );
  return response.data;
};

export const getPostByIdAPI = async (eventId, postId) => {
  const response = await APIServices.get(
    `/api/v1/discussion-posts/${eventId}/posts/${postId}`
  );
  return response.data;
};

export const updatePostAPI = async (postId, postData) => {
  const response = await APIServices.put(
    `/api/v1/discussion-posts/${postId}`,
    postData
  );
  return response.data;
};

export const deletePostAPI = async (eventId, postId) => {
  const response = await APIServices.delete(
    `/api/v1/discussion-posts/${eventId}/posts/${postId}`
  );
  return response.data;
};
