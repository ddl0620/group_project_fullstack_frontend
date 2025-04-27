import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    isAdmin: false,
    role: null,
    user: null,
    id: null
  },

  reducers: {
    login: (state, action) => {
      // alert("Login button clicked");
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAdmin = action.payload.isAdmin;
      state.id = action.payload.user._id;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.isAdmin = false;
      state.id = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
