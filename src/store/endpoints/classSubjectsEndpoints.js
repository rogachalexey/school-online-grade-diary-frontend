import { apiSlice } from "../apiSlice"

const classSubjectsUrl = '/class-subjects'

export const classSubjectsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getClassSubjects: builder.query({
      query: () => ({
        url: classSubjectsUrl,
      })
    }),
    getClassSubject: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${classSubjectsUrl}/${id}`,
        }
      },
    }),
    addNewClassSubject: builder.mutation({
      query: initial => ({
        url: classSubjectsUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['ClassSubject']
    }),
    editClassSubject: builder.mutation({
      query: item => ({
        url: classSubjectsUrl,
        method: 'PUT',
        body: item,
      })
    }),
    deleteClassSubject: builder.mutation({
      query: id => ({
        url: `${classSubjectsUrl}/${id}`,
        method: 'DELETE',
      })
    })
  })
})

export const {
  useGetClassSubjectsQuery,
  useGetClassSubjectQuery,
  useAddNewClassSubjectMutation,
  useEditClassSubjectMutation,
  useDeleteClassSubjectMutation
} = classSubjectsEndpoints