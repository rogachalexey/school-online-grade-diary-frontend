import { apiSlice } from "../apiSlice"

const subjectsUrl = '/subjects'

export const subjectsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSubjects: builder.query({
      query: () => ({
        url: subjectsUrl,
      })
    }),
    getSubject: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${subjectsUrl}/${id}`,
        }
      },
    }),
    addNewSubject: builder.mutation({
      query: initial => ({
        url: subjectsUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['Subject']
    }),
    editSubject: builder.mutation({
      query: item => ({
        url: subjectsUrl,
        method: 'PUT',
        body: item,
      })
    }),
    deleteSubject: builder.mutation({
      query: id => ({
        url: `${subjectsUrl}/${id}`,
        method: 'DELETE',
      })
    })
  })
})

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useAddNewSubjectMutation,
  useEditSubjectMutation,
  useDeleteSubjectMutation
} = subjectsEndpoints