import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: sessionStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;

      state.token = accessToken;
      sessionStorage.setItem("token", accessToken);
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    logout: (state, action) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
