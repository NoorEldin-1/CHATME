import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const handleLogin = createAsyncThunk("auth/login", async ({ info }) => {
  // TODO: Implement login logic
});

export const handleSignup = createAsyncThunk(
  "auth/signup",
  async ({ info }) => {
    // TODO: Implement signup logic
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loginLoading: true,
    signupLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(handleLogin.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(handleSignup.pending, (state) => {
        state.signupLoading = true;
      })
      .addCase(handleSignup.fulfilled, (state) => {
        state.signupLoading = false;
      });
  },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
