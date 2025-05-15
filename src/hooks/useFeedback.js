'use client';
import { useCallback, useRef } from 'react';
import { checkToken } from '@/helpers/checkToken.js';
import { Toast } from '@/helpers/toastService.js';
import {
  getAllFeedbackAPI,
  submitFeedbackAPI,
} from '@/services/FeedbackService.js';

export const useFeedback = () => {
  const cache = useRef({});

  const createFeedback = async (userData) => {
    const toastId = Toast.loading('Submiting...');
    try {
      checkToken();
      const response = await submitFeedbackAPI(userData);
      if (!response.success) {
         new Error(response.message || 'Failed to create feedback');
      }
      Toast.success(
        'Feedback sent!',
        'Your feedback has been sent successfully.'
      );
      return response.content.feedback;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Toast.error(`Failed to submit feedback: ${errorMessage}`);
      throw error;
    } finally {
      Toast.dismiss(toastId);
    }
  };

  const fetchAllFeedbacks = useCallback(async (forceRefresh = false) => {
    const cacheKey = `feedback`;
    if (!forceRefresh && cache.current[cacheKey]) {
      return cache.current[cacheKey];
    }
    try {
      checkToken();
      const response = await getAllFeedbackAPI();
      if (!response.success) {
         new Error(response.message || 'Failed to fetch users');
      }

      const result = response.content.feedbacks;
      cache.current[cacheKey] = result;
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Toast.error(`Failed to fetch users: ${errorMessage}`);
      throw error;
    }
  });

  return {
    createFeedback,
    fetchAllFeedbacks,
  };
};

export default useFeedback;
