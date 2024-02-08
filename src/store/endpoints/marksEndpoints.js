import { apiSlice } from "../apiSlice"

const marksUrl = '/marks'

export const marksEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMarks: builder.query({
      query: ({ subjectId, classId, lessonId }) => {
        let url = marksUrl
        let flag = false
        if (subjectId) {
          url += `?subject_id=${subjectId}`
          flag = true
        }
        if (classId) {
          url += flag ? '&' : '?'
          url += `class_id=${classId}`
          flag = true
        }
        if (lessonId) {
          url += flag ? '&' : '?'
          url += `lesson_id=${lessonId}`
        }
        return { url }
      },
      providesTags: (result = [], error, arg) => [
        'Message',
        ...result?.data.map(({ id }) => ({ type: 'Mark', id }))
      ]
    }),
    getMark: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${marksUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'Mark', id: arg }]
    }),
    addNewMark: builder.mutation({
      query: initial => ({
        url: marksUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['Mark']
    }),
    editMark: builder.mutation({
      query: item => ({
        url: marksUrl,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['Mark']
    }),
    deleteMark: builder.mutation({
      query: id => ({
        url: `${marksUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mark']
    })
  })
})

export const { useGetMarksQuery,
  useGetMarkQuery,
  useAddNewMarkMutation,
  useEditMarkMutation,
  useDeleteMarkMutation
} = marksEndpoints