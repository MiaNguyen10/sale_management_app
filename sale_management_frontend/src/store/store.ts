import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import auth from './slices/authSlice'
import product from './slices/productSlice'
import organization from './slices/organizationSlice'

export const store = configureStore({
  reducer: {
    auth,
    product,
    organization
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()