import { apiSlice } from "../apiSlice"

const classesUrl = '/classes'

export const classesEndpoints = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClasses: builder.query({
            query: ({ classLetter, classNumber }) => {
                let url = classesUrl
                let flag = false
                if (classLetter) {
                    url += `?class_letter=${classLetter}`
                    flag = true
                }
                if (classNumber) {
                    url += flag ? '&' : '?'
                    url += `class_number=${classNumber}`
                }
                return {
                    url
                }
            }
        }),
        getClass: builder.query({
            query: id => {
                if (id === null) {
                    throw new Error('ID is null, cancelling request');
                }
                return {
                    url: `${classesUrl}/${id}`,
                }
            },
        }),
        addNewClass: builder.mutation({
            query: initial => ({
                url: classesUrl,
                method: 'POST',
                body: initial,
            }),
            invalidatesTags: ['Class']
        }),
        editClass: builder.mutation({
            query: item => ({
                url: classesUrl,
                method: 'PUT',
                body: item,
            })
        }),
        deleteClass: builder.mutation({
            query: id => ({
                url: `${classesUrl}/${id}`,
                method: 'DELETE',
            })
        })
    })
})

export const {
    useGetClassesQuery,
    useGetClassQuery,
    useAddNewClassMutation,
    useEditClassMutation,
    useDeleteClassMutation
} = classesEndpoints