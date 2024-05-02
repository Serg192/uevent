import { apiSlice } from "../../app/api/apiSlice";

export const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: { ...data },
      }),
    }),
    updateCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),
    uploadCompanyLogo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/companies/${id}/logo`,
        method: "POST",
        body: formData,
      }),
    }),
    getAllCompanies: builder.mutation({
      query: ({ page, pageSize, search }) => ({
        url: `/companies?page=${page}&pageSize=${pageSize}${
          search ? "&search=" + search : ""
        }`,
        method: "GET",
      }),
    }),
    getFollowedCompanies: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/companies/followed?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getMyCompanies: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/companies/my?page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getCompany: builder.mutation({
      query: ({ id }) => ({
        url: `/companies/${id}`,
        method: "GET",
      }),
    }),

    setupStripeAccount: builder.mutation({
      query: ({ id }) => ({
        url: `/companies/${id}/stripe-setup`,
        method: "POST",
      }),
    }),
    getStripeDashboard: builder.mutation({
      query: ({ id }) => ({
        url: `/companies/${id}/stripe-account`,
        method: "GET",
      }),
    }),

    followCompany: builder.mutation({
      query: ({ id }) => ({
        url: `/companies/${id}/toggle-follow`,
        method: "POST",
      }),
    }),
    createEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}/event`,
        method: "POST",
        body: { ...data },
      }),
    }),

    getCompanyEvents: builder.mutation({
      query: ({ id, page, pageSize, startDate, endDate }) => ({
        url: `/companies/${id}/events?page=${page}&pageSize=${pageSize}${
          startDate ? "&startDate=" + startDate : ""
        }${endDate ? "&endDate=" + endDate : ""}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useUploadCompanyLogoMutation,
  useGetAllCompaniesMutation,
  useGetFollowedCompaniesMutation,
  useGetMyCompaniesMutation,
  useGetCompanyMutation,
  useSetupStripeAccountMutation,
  useGetStripeDashboardMutation,
  useFollowCompanyMutation,
  useCreateEventMutation,
  useGetCompanyEventsMutation,
} = companyApiSlice;
