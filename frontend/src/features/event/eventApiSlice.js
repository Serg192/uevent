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
} = eventApiSlice;
