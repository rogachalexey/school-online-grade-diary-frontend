import { apiSlice } from "../apiSlice"

const messagesUrl = '/messages'

export const messagesEndpoints = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMessages: builder.query({
      query: ({ chatId = null }) => {
        if (!chatId) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${messagesUrl}?chat_id=${chatId}`,
        }
      },
      // providesTags: (result = [], error, arg) => [
      //   'Message',
      //   ...result?.data.map(({ id }) => ({ type: 'Message', id }))
      // ]
    }),
    getMessage: builder.query({
      query: id => {
        if (id === null) {
          throw new Error('ID is null, cancelling request');
        }
        return {
          url: `${messagesUrl}/${id}`,
        }
      },
      // providesTags: (result, error, arg) => [{ type: 'Message', id: arg }]
    }),
    addNewMessage: builder.mutation({
      query: initial => ({
        url: messagesUrl,
        method: 'POST',
        body: initial,
      }),
      invalidatesTags: ['Message']
    }),
    editMessage: builder.mutation({
      query: item => ({
        url: messagesUrl,
        method: 'PUT',
        body: item,
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Message', id: arg.item.id }]
    }),
    deleteMessage: builder.mutation({
      query: id => ({
        url: `${messagesUrl}/${id}`,
        method: 'DELETE',
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Message', id: arg.id }]
    })
  })
})

export const { useGetMessagesQuery,
  useGetMessageQuery,
  useAddNewMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation
} = messagesEndpoints