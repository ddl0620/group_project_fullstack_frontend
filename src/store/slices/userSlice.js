import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    isAdmin: false,
    role: null,
    user: null,
  },

  reducers: {
    login: (state, action) => {
      // alert("Login button clicked");
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.isAdmin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
