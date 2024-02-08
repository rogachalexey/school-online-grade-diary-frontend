import { apiSlice } from "../apiSlice"

const lessonsUrl = '/lessons'

export const lessonsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getLessons: builder.query({
      query: ({ classId, subjectId }) => {
        let url = lessonsUrl
        let flag = false
        if (classId) {
          flag = true
          url += `?class_id=${classId}`
        }
        if (subjectId) {
          url += flag ? '&' : '?'
          url += `subject_id=${subjectId}`
        }
        return { url }
      },
      providesTags: (result = [], error, arg) => [
        'Lesson',
        ...result?.data.map(({ id }) => ({ type: 'Lesson', id }))
      ]
    }),
    getLesson: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${lessonsUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'Lesson', id: arg }]
    }),
    addNewLesson: builder.mutation({
      query: initial => ({
        url: lessonsUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['Lesson']
    }),
    editLesson: builder.mutation({
      query: item => ({
        url: lessonsUrl,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['Lesson']
    }),
    deleteLesson: builder.mutation({
      query: id => ({
        url: `${lessonsUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson']
    })
  })
})

export const {
  useGetLessonsQuery,
  useGetLessonQuery,
  useAddNewLessonMutation,
  useEditLessonMutation,
  useDeleteLessonMutation
} = lessonsEndpoints