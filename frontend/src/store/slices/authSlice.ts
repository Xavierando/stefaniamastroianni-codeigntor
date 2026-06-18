import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

// Guard via `window` so the store can also be imported during server-side
// prerendering (Node may expose a non-functional global localStorage, but never window).
const storedToken =
  typeof window !== 'undefined' ? window.localStorage.getItem('adminToken') : null;

const initialState: AuthState = {
  isAuthenticated: !!storedToken,
  token: storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem('adminToken', action.payload);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('adminToken');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
