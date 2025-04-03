import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";

// Create a Redux store
export const store = configureStore({
    reducer: {
        // Add your slices here

        //Manage user-related states ( authentication, roles, ... )
        user: userReducer,

    }
});