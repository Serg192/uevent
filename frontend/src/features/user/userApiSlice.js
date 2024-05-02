import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.mutation({
      query: (credentials) => ({
        url: "/users/me",
        method: "GET",
      }),
    }),

    uploadAvatar: builder.mutation({
      query: ({ formData }) => ({
        url: `/users/avatar`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { 
  useGetMeMutation,
  useUploadAvatarMutation
} = userApiSlice;
