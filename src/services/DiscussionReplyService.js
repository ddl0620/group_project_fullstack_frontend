// src/services/DiscussionPostService.js
import APIServices from '@/services/APIServices.js';

export const createNewReplyAPI = async (postId, content) => {
  const response = await APIServices.post(
    `/api/v1/discussion-replies/${postId}`,
    content
  );
  return response.data;
};

export const getAllRepliesAPI = async (postId, params = {}) => {
  const response = await APIServices.get(
    `/api/v1/discussion-replies/${postId}`,
    { params }
  );
  return response.data;
};

export const getRepliedBy = async (replyId) => {
  const response = await APIServices.get(
    `/api/v1/discussion-replies/${replyId}/details`
  );
  return response.data;
};

export const updateReplyAPI = async (replyId, content) => {
  const response = await APIServices.put(
    `/api/v1/discussion-replies/${replyId}`,
    content
  );
  return response.data;
};

export const deleteReplyAPI = async (replyId) => {
  const response = await APIServices.delete(
    `/api/v1/discussion-replies/${replyId}`
  );
  return response.data;
};
