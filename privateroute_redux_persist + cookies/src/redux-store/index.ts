// redux-store/index.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Slice Imports
import emailReducer from './slices/email'
import countriesList from './slices/countriesSlice'
import calendarReducer from './slices/calendarSlice'
import collegeStepper from './slices/collegeStepper'
import loggedUserReducer from './slices/loggedInUserSlice'

// Persist config for loggedUser
const persistConfig = {
  key: 'loggedUser',
  storage,
  // whitelist: ['role'] // optional: persist only specific keys in the slice
}

// Combine reducers
const rootReducer = combineReducers({
  calendarReducer,
  countriesList,
  collegeStepper,
  emailReducer,
  loggedUserReducer: persistReducer(persistConfig, loggedUserReducer)
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false // required for redux-persist
    })
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// // Third-party Imports
// import { configureStore } from '@reduxjs/toolkit'

// // Slice Imports
// import emailReducer from '@/redux-store/slices/email'
// import countriesList from '@/redux-store/slices/countriesSlice'
// import calendarReducer from '@/redux-store/slices/calendarSlice'
// import collegeStepper from '@/redux-store/slices/collegeStepper'
// import loggedUserReducer from '@/redux-store/slices/loggedInUserSlice'

// export const store = configureStore({
//   reducer: {
//     calendarReducer,
//     countriesList,
//     collegeStepper,
//     emailReducer,
//     loggedUserReducer
//   }
//   // middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
