import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
// import calendarReducer from "../features/calendars/calendarSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    // calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
