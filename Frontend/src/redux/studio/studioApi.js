

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studioApi = createApi({
  reducerPath: "studioApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getAllStudios: builder.query({
      query: () => ({
        url: "api/studios/getstudios",
      }),
    }),
  }),
});

export const { useGetAllStudiosQuery } = studioApi;
