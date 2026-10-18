// Third-party Imports
import { loginusersType } from '@/types/loginUser/loginuserTypes';
import { createSlice } from '@reduxjs/toolkit'

const initialState: { loggedUser: loginusersType | null; role: string | null } = {
  loggedUser: null,
  role: null
}

export const loggedUserSlice = createSlice({
  name: 'LoggedUser',
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload
      state.role = action.payload?.role
    },
    clearLoggedUser: state => {
      state.loggedUser = null
      state.role = null
    }
  }
})

// Action creators are generated for each case reducer function
export const { setLoggedUser, clearLoggedUser } = loggedUserSlice.actions
export default loggedUserSlice.reducer
