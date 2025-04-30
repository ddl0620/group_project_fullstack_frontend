// src/store/slices/userStatisSlice.js
import { createSlice } from '@reduxjs/toolkit';


/*
  Quản lý state liên quan đến thống kê người dùng:
  engagementStats: Thống kê tổng quan (số lời mời, RSVP accepted, declined, pending).
  invitationsOverTime: Dữ liệu lời mời qua thời gian (mảng).
  rsvpTrend: Xu hướng RSVP qua thời gian (mảng).
  rsvpDistribution: Phân bố RSVP (mảng).
  recipients: Danh sách người nhận lời mời.
  totalRecipients: Tổng số người nhận.
  loading và error: Trạng thái tải dữ liệu và lỗi.
*/
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
