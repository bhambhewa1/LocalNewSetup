// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

const formatDate = (date: Date | null): string | null => {
  if (date) {
    const myUTCAddedDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000) // Add 5 hours 30 minutes to IST so do not go back date in payload of api
    return myUTCAddedDate.toISOString()
  }
  return null
}

const initialState: { candidateFromDate: string | null; candidateToDate: string | null } = {
  candidateFromDate: null,
  candidateToDate: null
}

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCandidateFromDate: (state, action) => {
      state.candidateFromDate = formatDate(action.payload)
    },
    setCandidateToDate: (state, action) => {
      state.candidateToDate = formatDate(action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { setCandidateFromDate, setCandidateToDate } = calendarSlice.actions
export default calendarSlice.reducer
