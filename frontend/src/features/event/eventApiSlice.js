import { apiSlice } from "../../app/api/apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/events?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getSubscribedEvents: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/events/subscribed?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),

    getEvent: builder.mutation({
      query: ({ id, uid }) => ({
        url: `/events/${id}${uid ? "?uid=" + uid : ""}`,
        method: "GET",
      }),
    }),

    getSubscribedToEventUsers: builder.mutation({
      query: ({ id }) => ({
        url: `/events/${id}/subscribed-users`,
        method: "GET",
      }),
    }),

    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/events/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),

    uploadBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/events/${id}/poster`,
        method: "POST",
        body: formData,
      }),
    }),
    // getMyEvents: builder.mutation({
    //   query: ({ page, pageSize }) => ({
    //     url: `/events/my?page=${page}&pageSize=${pageSize}`,
    //     method: "GET",
    //   }),
    // }),
    // getEvent: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/events/${id}`,
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const {
  useGetAllEventsMutation,
  useGetSubscribedEventsMutation,
  useGetEventMutation,
  useGetSubscribedToEventUsersMutation,
  useUpdateEventMutation,
  useUploadBannerMutation,
} = eventApiSlice;
