import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, FILE_URL } from "../main";

export const search = createAsyncThunk("user/search", async (username) => {
  const res = await axios.get(`${BASE_URL}users/search/${username}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    searchLoading: false,
    searchUsers: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.searchLoading = false;
        const users = action.payload.users.map((user) => {
          if (user.image) {
            user.image = `${FILE_URL}${user.image}`;
          }
          return user;
        });
        state.searchUsers = users;
        console.log(action.payload);
      });
  },
});

export default userSlice.reducer;
