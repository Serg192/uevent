import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4545/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    console.log("Sending refresh token");
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
