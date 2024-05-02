import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: sessionStorage.getItem("user"),
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;

      state.token = accessToken;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("user", action.payload);
    },

    logout: (state, action) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("user");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
