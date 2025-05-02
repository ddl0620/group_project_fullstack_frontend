// src/store/slices/discussionPostSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  pagination: { page: 1, limit: 10, total: 0 },
  loading: false,
  error: null,
};

const discussionPostSlice = createSlice({
  name: 'discussionPost',
  initialState,
  reducers: {
    setPosts(state, action) {
      console.log('Setting posts:', action.payload.posts);
      state.posts = action.payload.posts;
      state.pagination = action.payload.pagination;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
      state.pagination.total += 1;
    },
    updatePost(state, action) {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(
        (post) => post._id === updatedPost._id
      );
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
    removePost(state, action) {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId);
      state.pagination.total -= 1;
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
  setPosts,
  addPost,
  updatePost,
  removePost,
  setLoading,
  setError,
} = discussionPostSlice.actions;

export default discussionPostSlice.reducer;
