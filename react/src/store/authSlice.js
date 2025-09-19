import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../main";

export const handleSignup = createAsyncThunk(
  "auth/signup",
  async ({ info }) => {
    const res = await axios.post(`${BASE_URL}auth/signup`, {
      username: info.username,
      fullName: info.fullName,
      password: info.password,
      password_confirmation: info.confirmPassword,
    });
    return res.data;
  }
);

export const handleLogin = createAsyncThunk("auth/login", async ({ info }) => {
  const res = await axios.post(`${BASE_URL}auth/login`, {
    username: info.username,
    password: info.password,
  });
  return res.data;
});

export const handleLogout = createAsyncThunk("auth/logout", async () => {
  const res = await axios.post(
    `${BASE_URL}auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loginLoading: false,
    signupLoading: false,
    logoutLoading: false,
    signupErrorMsg: null,
    loginErrorMsg: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loginLoading = false;
        if (action.payload.message) {
          state.loginErrorMsg = action.payload.message;
        }
        if (action.payload.token && action.payload.user) {
          window.localStorage.setItem("token", action.payload.token);
          window.localStorage.setItem("userId", action.payload.user.id);
          window.localStorage.setItem("username", action.payload.user.username);
          window.localStorage.setItem("fullName", action.payload.user.fullName);
          window.location.href = "/";
        }
      })
      .addCase(handleSignup.pending, (state) => {
        state.signupLoading = true;
      })
      .addCase(handleSignup.fulfilled, (state, action) => {
        state.signupLoading = false;
        if (action.payload.errors) {
          if (action.payload.errors.username[0]) {
            state.signupErrorMsg = action.payload.errors.username[0];
          }
        }
        if (action.payload.token && action.payload.user) {
          window.localStorage.setItem("token", action.payload.token);
          window.localStorage.setItem("userId", action.payload.user.id);
          window.localStorage.setItem("username", action.payload.user.username);
          window.localStorage.setItem("fullName", action.payload.user.fullName);
          window.location.href = "/";
        }
      })
      .addCase(handleLogout.pending, (state) => {
        state.logoutLoading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.logoutLoading = false;
        window.localStorage.clear();
        window.location.href = "/";
      });
  },
});

// export const {} = authSlice.actions;
export default authSlice.reducer;
