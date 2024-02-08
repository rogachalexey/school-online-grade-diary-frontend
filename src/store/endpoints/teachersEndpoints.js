import { apiSlice } from "../apiSlice"

const teachersUrl = '/teachers'

export const teachersEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTeachers: builder.query({
      query: ({ search = '' }) => ({
        url: `${teachersUrl}/?search=${search}`
      }),
      providesTags: (result = [], error, arg) => [
        'User',
        ...result?.data.map(({ id }) => ({ type: 'User', id }))
      ]
    }),
    getTeacher: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${teachersUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }]
    })
  })
})

export const {
  useGetTeachersQuery,
  useGetTeacherQuery,
} = teachersEndpoints