import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overview: null,
  eventsByDate: [],
  usersByDate: [],
  deletedUsersByDate: [],
  publicAndPrivateEvents: null,
  loading: false,
  error: null,
};

const adminStatisticsSlice = createSlice({
  name: 'adminStatistics',
  initialState,
  reducers: {
    setOverview(state, action) {
      state.overview = action.payload;
    },
    setEventsByDate(state, action) {
      state.eventsByDate = action.payload;
    },
    setUsersByDate(state, action) {
      state.usersByDate = action.payload;
    },
    setDeletedUsersByDate(state, action) {
      state.deletedUsersByDate = action.payload;
    },
    setPublicAndPrivateEvents(state, action) {
      state.publicAndPrivateEvents = action.payload;
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
  setOverview,
  setEventsByDate,
  setUsersByDate,
  setDeletedUsersByDate,
  setPublicAndPrivateEvents,
  setLoading,
  setError,
} = adminStatisticsSlice.actions;

export default adminStatisticsSlice.reducer;