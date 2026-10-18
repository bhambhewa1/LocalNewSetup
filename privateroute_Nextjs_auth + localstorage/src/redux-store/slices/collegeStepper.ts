// Third-party Imports
import { createSlice } from '@reduxjs/toolkit'

const initialState: { completedSteps: number[] } = {
  completedSteps: [0]
}

export const collegeStepperSlice = createSlice({
  name: 'collegeStepper',
  initialState,
  reducers: {
    setCompletedSteps: (state, action) => {
        state.completedSteps = action.payload;
    },
  }
})

// Action creators are generated for each case reducer function
export const { setCompletedSteps } = collegeStepperSlice.actions;
export default collegeStepperSlice.reducer;
