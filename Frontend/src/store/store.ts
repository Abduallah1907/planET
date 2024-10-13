import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import sidebarSlice from './sidebarSlice'
import  userSlice  from './userSlice'

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    user: userSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store