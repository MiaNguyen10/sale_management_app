import { createSlice } from "@reduxjs/toolkit";
import { login, signupOrganization } from "../hook/auth";

interface AuthState {
  organization_id: number;
  token: string;
  message: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  organization_id: 0,
  token: "",
  message: "",
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.organization_id = 0;
      state.message = "";
      state.loading = "idle";
      state.error = null;
      sessionStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupOrganization.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(signupOrganization.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.organization_id = action.payload.organization_id;
        state.message = action.payload.message;
      })
      .addCase(signupOrganization.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(login.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.token = action.payload.token;
        state.message = action.payload.message;
        sessionStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
