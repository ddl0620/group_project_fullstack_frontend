import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import eventReducer from './slices/eventSlice.js';
import invitationReducer from './slices/invitationSlice.js';
import userStatisReducer from './slices/userStatisSlice.js';
import discussionPostReducer from './slices/DiscussionPostSlice.js';
import discussionReplySlice from './slices/DiscussionReplySlice.js';
import AdminManagementSlice from './slices/adminManagementSlice.js';

// Create a Redux store
export const store = configureStore({
  reducer: {
    // Add your slices here
    event: eventReducer,
    //Manage user-related states ( authentication, roles, ... )
    user: userReducer,
    invitation: invitationReducer,
    userStatis: userStatisReducer,
    discussionPost: discussionPostReducer,
    discussionReply: discussionReplySlice,
    adminManagement: AdminManagementSlice,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra serializable nếu cần (ví dụ: khi lưu Promise hoặc function)
    }),
});
