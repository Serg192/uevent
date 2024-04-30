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
    getAllCompanies: builder.mutation({
      query: ({ page, pageSize }) => ({
        url: `/companies?page=${page}&pageSize=${pageSize}`,
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
  }),
});

export const {
  useCreateCompanyMutation,
  useGetAllCompaniesMutation,
  useGetFollowedCompaniesMutation,
  useGetMyCompaniesMutation,
} = companyApiSlice;
