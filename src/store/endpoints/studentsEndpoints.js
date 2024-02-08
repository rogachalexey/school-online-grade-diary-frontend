import { apiSlice } from "../apiSlice"

const studentsUrl = '/students'

export const studentsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getStudents: builder.query({
      query: ({ search = null, classId = null }) => {
        let url = studentsUrl
        let flag = false
        // if (!search && !classId) {
        //   throw new Error('ID is null, cancelling request');
        // }
        if(search){
          url += `?search=${search}`
          flag = true
        }
        if(classId){
          url += flag ? '&' : '?'
          url += `class_id=${classId}`
        }
        return {
          url
        }
      },
      providesTags: (result = [], error, arg) => [
        'User',
        ...result?.data.map(({ id }) => ({ type: 'User', id }))
      ]
    }),
    getStudent: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${studentsUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }]
    })
  })
})

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
} = studentsEndpoints