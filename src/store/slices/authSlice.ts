import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  publicId: string;
  email: string;
  name: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
