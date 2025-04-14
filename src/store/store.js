import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import eventReducer from './slices/eventSlice.js';

// Create a Redux store
export const store = configureStore({
    reducer: {
        // Add your slices here
        event: eventReducer,
        //Manage user-related states ( authentication, roles, ... )
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Tắt kiểm tra serializable nếu cần (ví dụ: khi lưu Promise hoặc function)
        }),
});
