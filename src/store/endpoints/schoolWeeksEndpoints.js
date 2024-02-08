import { apiSlice } from "../apiSlice"

const schoolWeeksUrl = '/school-weeks'

export const schoolWeeksEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSchoolWeeks: builder.query({
      query: () => ({
        url: schoolWeeksUrl,
      })
    }),
    getSchoolWeek: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${schoolWeeksUrl}/${id}`,
        }
      },
    })
  })
})

export const {
  useGetSchoolWeeksQuery,
  useGetSchoolWeekQuery
} = schoolWeeksEndpoints