import { apiSlice } from "../apiSlice"

const chatsUrl = '/chats'

export const chatsEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getChats: builder.query({
      query: ({classId = null, teacherId = null}) => {
        if(!classId && !teacherId){
          throw new Error('Cancelling request');
        }
        let url = chatsUrl
        let flag = false
        if (classId) {
          url += `?class_id=${classId}`
          flag = true
        }
        if (teacherId) {
          url += flag ? '&' : '?'
          url += `teacher_id=${teacherId}`
        }
        return {
          url
        }
      }
    }),
    getChat: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${chatsUrl}/${id}`,
        }
      },
    })
  })
})

export const {
  useGetChatsQuery,
  useGetChatQuery
} = chatsEndpoints