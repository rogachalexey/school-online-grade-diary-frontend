import { apiSlice } from "../apiSlice"

const usersUrl = '/users'

export const usersEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: ({ roleId = 2, search = '' }) => ({
        url: `${usersUrl}/?role_id=${roleId}&search=${search}`
      }),
      providesTags: (result = [], error, arg) => [
        'User',
        ...result?.data.map(({ id }) => ({ type: 'User', id }))
      ]
    }),
    getUser: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${usersUrl}/${id}`,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'User', id: arg }]
    }),
    editUser: builder.mutation({
      query: item => ({
        url: usersUrl,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: id => ({
        url: `${usersUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User']
    })
  })
})

export const { useGetUsersQuery,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation
} = usersEndpoints