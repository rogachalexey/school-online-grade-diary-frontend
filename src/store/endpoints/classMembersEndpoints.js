import { apiSlice } from "../apiSlice"

const classMembersUrl = '/class-members'

export const classMembersEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getClassMembers: builder.query({
      query: ({ classId = null, studentId = null }) => {
        let url = classMembersUrl
        let flag = false
        if (classId) {
          flag = true
          url += `?class_id=${classId}`
        }
        if (studentId) {
          url += flag ? '&' : '?'
          url += `student_id=${studentId}`
        }
        return {
          url
        }
      }
    }),
    getClassMember: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${classMembersUrl}/${id}`,
        }
      },
    }),
    addNewClassMember: builder.mutation({
      query: initial => ({
        url: classMembersUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['ClassMember']
    }),
    editClassMember: builder.mutation({
      query: item => ({
        url: classMembersUrl,
        method: 'PUT',
        body: item,
      })
    }),
    deleteClassMember: builder.mutation({
      query: id => ({
        url: `${classMembersUrl}/${id}`,
        method: 'DELETE',
      })
    })
  })
})

export const {
  useGetClassMembersQuery,
  useGetClassMemberQuery,
  useAddNewClassMemberMutation,
  useEditClassMemberMutation,
  useDeleteClassMemberMutation
} = classMembersEndpoints