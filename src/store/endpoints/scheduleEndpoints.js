import { apiSlice } from "../apiSlice"

const scheduleUrl = '/schedule'

export const scheduleEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getScheduleList: builder.query({
      query: ({ classId, teacherId }) => {
        if (!classId && !teacherId) {
          throw new Error('ID is null, cancelling request')
        }
        let url = scheduleUrl
        let flag = false
        if (classId) {
          flag = true
          url += `?class_id=${classId}`
        }
        if (teacherId) {
          url += flag ? '&' : '?'
          url += `teacher_id=${teacherId}`
        }
        return { url }
      },
      providesTags: (result = [], error, arg) => [
        'Lesson',
        ...result?.data.map(({ id }) => ({ type: 'Lesson', id }))
      ]
    }),
    getSchedule: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${scheduleUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'Lesson', id: arg }]
    }),
    getCurrentWeek: builder.query({
      query: () => ({
        url: `${scheduleUrl}/current-week`
      }),
    })
  })
})

export const {
  useGetScheduleListQuery,
  useGetScheduleQuery,
  useGetCurrentWeekQuery
} = scheduleEndpoints