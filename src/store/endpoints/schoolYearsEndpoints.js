import { apiSlice } from "../apiSlice"

const schoolYearsUrl = '/school-years'

export const schoolWeeksEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSchoolYears: builder.query({
      query: () => ({
        url: schoolYearsUrl,
      })
    }),
    getSchoolYear: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${schoolYearsUrl}/${id}`,
        }
      },
    })
  })
})

export const {
  useGetSchoolYearsQuery,
  useGetSchoolYearQuery
} = schoolWeeksEndpoints