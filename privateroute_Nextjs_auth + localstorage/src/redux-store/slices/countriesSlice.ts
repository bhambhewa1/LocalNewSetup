import { countryAPI } from '@/API/API'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Define the initial state for countries
const initialState = {
  countriesList: [],
  loading: false,
  error: null
}

// Create an asynchronous thunk to fetch countries
export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await makeApiCall(HttpVerb.GET, countryAPI.get_all_countries)
  if (response.status) {
    return response.data // Return the countries data to be used in the slice
  } else {
    return []
  }
})

// Create the slice
const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCountries.pending, state => {
        state.loading = true // Set loading state to true when the API call starts
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false // Set loading to false when the data is fetched successfully
        state.countriesList = action.payload // Assign the fetched countries to the state
      })
  }
})

export default countriesSlice.reducer
