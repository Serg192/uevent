import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.mutation({
      query: (credentials) => ({
        url: "/users/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMeMutation } = userApiSlice;
