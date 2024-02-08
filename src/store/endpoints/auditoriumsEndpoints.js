import { apiSlice } from "../apiSlice"

const auditoriumsUrl = '/auditoriums'

export const auditoriumsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAuditoriums: builder.query({
      query: () => ({
        url: auditoriumsUrl
      })
    }),
    getAuditorium: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${auditoriumsUrl}/${id}`,
        }
      },
    }),
    addNewAudigetAuditorium: builder.mutation({
      query: initial => ({
        url: auditoriumsUrl,
        method: 'POST',
        body: initial
      }),
      invalidatesTags: ['Auditorium']
    }),
    editAudigetAuditorium: builder.mutation({
      query: item => ({
        url: auditoriumsUrl,
        method: 'PUT',
        body: item
      })
    }),
    deleteAudigetAuditorium: builder.mutation({
      query: id => ({
        url: `${auditoriumsUrl}/${id}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetAuditoriumsQuery,
  useGetAuditoriumQuery,
  useAddNewAudigetAuditoriumMutation,
  useEditAudigetAuditoriumMutation,
  useDeleteAudigetAuditoriumMutation
} = auditoriumsEndpoints