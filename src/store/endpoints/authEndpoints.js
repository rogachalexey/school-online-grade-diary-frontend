import { apiSlice } from "../apiSlice"

const authUrl = '/auth'

export const authEndpoints = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: user => ({
                url: `${authUrl}/register`,
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        authenticate: builder.mutation({
            query: initial => ({
                url: `${authUrl}/authenticate`,
                method: 'POST',
                body: { ...initial }
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${authUrl}/logout`,
                method: 'POST'
            })
        }),
        me: builder.query({
            query: () => ({
                url: `${authUrl}/me`,
                method: 'GET'
            })
        })

    })
})

export const {
    useAuthenticateMutation,
    useLogoutMutation,
    useMeQuery,
    useRegisterMutation
    // useRefreshMutation ,
} = authEndpoints