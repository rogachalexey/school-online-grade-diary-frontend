import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { authenticate, logOut } from './slices/authSlice'

const baseUrl = 'http://localhost:5000/api/v1'

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: headers => {
    const token = localStorage.getItem('authToken')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401) {
    await baseQuery('/logout', api, extraOptions)
    api.dispatch(logOut())

    // console.log('sending refresh token')
    // const refreshResult = await baseQuery('/refresh', api, extraOptions)
    // if (refreshResult?.data) {
    //   const user = api.getState().auth.user
    //   api.dispatch(authenticate({ ...refreshResult.data, user }))
    //   result = await baseQuery(args, api, extraOptions)
    // } else {
    //   await baseQuery('/logout', api, extraOptions)
    //   api.dispatch(logOut())
    // }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  tagTypes: ['Message','Lesson','User','Mark'],
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})