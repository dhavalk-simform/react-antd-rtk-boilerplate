// this file just for demo. you can delete it.

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

import axiosInstance from '../utils/api'

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}
export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}
export interface Geo {
  lat: string
  lng: string
}
export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export const getUser = createAsyncThunk('users', async () => {
  try {
    const response = await axiosInstance.get('/users', { withoutAuth: true })
    return response?.data
  } catch (err) {
    // you can create util functon to handle errors.
    return Promise.reject(err)
  }
})

export interface UserState {
  loading: boolean
  error: any // eslint-disable-line
  users: User[] | []
}

const initialState: UserState = { users: [], loading: false, error: '' }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getUser.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.loading = false
        state.users = action.payload
        state.error = ''
      }
    )
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
    })
  }
})

export default userSlice.reducer
