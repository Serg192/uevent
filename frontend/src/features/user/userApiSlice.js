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
      query: ({ id, formData }) => ({
        url: `/users/${id}/avatar`,
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
