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

export const addFriend = createAsyncThunk("user/addFriend", async (userID) => {
  const res = await axios.post(
    `${BASE_URL}users/add/friend/${userID}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
});

export const notifications = createAsyncThunk(
  "user/notifications",
  async () => {
    const res = await axios.get(`${BASE_URL}users/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }
);

export const removeNotification = createAsyncThunk(
  "user/remove/notifications",
  async (id) => {
    const res = await axios.get(`${BASE_URL}users/remove/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }
);

export const acceptNotification = createAsyncThunk(
  "user/accept/notifications",
  async (id) => {
    const res = await axios.get(`${BASE_URL}users/accept/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    searchLoading: false,
    searchUsers: [],
    addFriendLoading: false,
    notifications: [],
    notificationsLoading: false,
    handleNotificationLoading: false,
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
      })
      .addCase(addFriend.pending, (state) => {
        state.addFriendLoading = true;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.addFriendLoading = false;
        console.log(action.payload);
      })
      .addCase(notifications.pending, (state) => {
        state.notificationsLoading = true;
      })
      .addCase(notifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notifications = action.payload.notifications;
        console.log(action.payload.notifications);
      })
      .addCase(removeNotification.pending, (state) => {
        state.handleNotificationLoading = true;
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        state.handleNotificationLoading = false;
        console.log(action.payload);
      })
      .addCase(acceptNotification.pending, (state) => {
        state.handleNotificationLoading = true;
      })
      .addCase(acceptNotification.fulfilled, (state, action) => {
        state.handleNotificationLoading = false;
        console.log(action.payload);
      });
  },
});

export default userSlice.reducer;
