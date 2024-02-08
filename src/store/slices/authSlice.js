import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userId: null,
        username: null,
        userRoleId: null,
        classId: null
    },
    reducers: {
        authenticate: (state, action) => {
            const { token, username } = action.payload
            state.username = username
            localStorage.setItem('authToken', token)
        },
        setCredentials: (state, action) => {
            const { id, role_id, username } = action.payload
            state.userId = id
            state.userRoleId = role_id
            state.username = username
        },
        setStudentClass: (state, action) => {
            const { class_id } = action.payload
            state.classId = class_id
        },
        logOut: (state, action) => {
            state.username = null
            state.userId = null
            state.userRoleId = null
            state.classId = null
            localStorage.removeItem('authToken')
        }
    }
})

export const { setCredentials, logOut, authenticate, setStudentClass } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.username
export const selectCurrentUserId = (state) => state.auth.userId
export const selectCurrentUserRoleId = (state) => state.auth.userRoleId
export const selectCurrentUserClassId = (state) => state.auth.classId