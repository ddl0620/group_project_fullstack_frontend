// src/store/slices/userStatisSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  engagementStats: null,
  invitationsOverTime: [],
  rsvpTrend: [],
  rsvpDistribution: [],
  recipients: [],
  totalRecipients: 0,
  loading: false,
  error: null,
};

const userStatisSlice = createSlice({
  name: 'userStatis',
  initialState,
  reducers: {
    setEngagementStats(state, action) {
      state.engagementStats = action.payload;
    },
    setInvitationsOverTime(state, action) {
      state.invitationsOverTime = action.payload;
    },
    setRsvpTrend(state, action) {
      state.rsvpTrend = action.payload;
    },
    setRsvpDistribution(state, action) {
      console.log("Setting RSVP Distribution in Redux:", action.payload) // Kiểm tra dữ liệu được lưu vào Redux
      state.rsvpDistribution = action.payload;
    },
    setRecipients(state, action) {
      state.recipients = action.payload.recipients;
      state.totalRecipients = action.payload.total;
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
  setEngagementStats,
  setInvitationsOverTime,
  setRsvpTrend,
  setRsvpDistribution,
  setRecipients,
  setLoading,
  setError,
} = userStatisSlice.actions;

export default userStatisSlice.reducer;
