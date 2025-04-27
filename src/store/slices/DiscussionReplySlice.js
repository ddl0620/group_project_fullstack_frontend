// src/store/slices/discussionReplySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repliesByPostId: {}, // Lưu replies theo postId: { [postId]: { replies: [], pagination: {} } }
  loading: false,
  error: null,
};

const discussionReplySlice = createSlice({
  name: 'discussionReply',
  initialState,
  reducers: {
    setReplies(state, action) {
      const { postId, replies, pagination } = action.payload;
      state.repliesByPostId[postId] = { replies, pagination };
    },
    addReply(state, action) {
      const { postId, reply } = action.payload;
      if (!state.repliesByPostId[postId]) {
        state.repliesByPostId[postId] = {
          replies: [],
          pagination: { page: 1, limit: 10, total: 0 },
        };
      }
      state.repliesByPostId[postId].replies.unshift(reply);
      state.repliesByPostId[postId].pagination.total += 1;
    },
    updateReply(state, action) {
      const { postId, updatedReply } = action.payload;
      if (state.repliesByPostId[postId]) {
        const index = state.repliesByPostId[postId].replies.findIndex(
          (reply) => reply._id === updatedReply._id
        );
        if (index !== -1) {
          state.repliesByPostId[postId].replies[index] = updatedReply;
        }
      }
    },
    removeReply(state, action) {
      const { postId, replyId } = action.payload;
      if (state.repliesByPostId[postId]) {
        state.repliesByPostId[postId].replies = state.repliesByPostId[
          postId
        ].replies.filter((reply) => reply._id !== replyId);
        state.repliesByPostId[postId].pagination.total -= 1;
      }
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
  setReplies,
  addReply,
  updateReply,
  removeReply,
  setLoading,
  setError,
} = discussionReplySlice.actions;

export default discussionReplySlice.reducer;
