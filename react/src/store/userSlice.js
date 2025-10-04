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

export const addFriend = createAsyncThunk(
  "user/addFriend",
  async (userID, { dispatch }) => {
    const res = await axios.post(
      `${BASE_URL}users/add/friend/${userID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch(makeUserPending(userID));
    return res.data;
  }
);

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
  async (id, { dispatch }) => {
    const res = await axios.get(`${BASE_URL}users/remove/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(clearNotification(id));
    return res.data;
  }
);

export const acceptNotification = createAsyncThunk(
  "user/accept/notifications",
  async (id, { dispatch }) => {
    const res = await axios.get(`${BASE_URL}users/accept/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(clearNotification(id));
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
  reducers: {
    addNotification(state, action) {
      action.payload.from_user.image = action.payload.from_user.image
        ? `${FILE_URL}/storage/${action.payload.from_user.image}`
        : null;
      state.notifications.push(action.payload);
    },
    clearNotification(state, action) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    makeUserPending(state, action) {
      state.searchUsers = state.searchUsers.map((user) => {
        if (user.id === action.payload) {
          user.is_pending = true;
        }
        return user;
      });
    },

    clearSearchUsers(state) {
      state.searchUsers = [];
    },
  },
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
      })
      .addCase(addFriend.pending, (state) => {
        state.addFriendLoading = true;
      })
      .addCase(addFriend.fulfilled, (state) => {
        state.addFriendLoading = false;
      })
      .addCase(notifications.pending, (state) => {
        state.notificationsLoading = true;
      })
      .addCase(notifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;
        state.notifications = action.payload.notifications.map(
          (notification) => {
            if (notification.from_user.image) {
              notification.from_user.image = `${FILE_URL}/storage/${notification.from_user.image}`;
            }
            return notification;
          }
        );
      })
      .addCase(removeNotification.pending, (state) => {
        state.handleNotificationLoading = true;
      })
      .addCase(removeNotification.fulfilled, (state) => {
        state.handleNotificationLoading = false;
      })
      .addCase(acceptNotification.pending, (state) => {
        state.handleNotificationLoading = true;
      })
      .addCase(acceptNotification.fulfilled, (state) => {
        state.handleNotificationLoading = false;
      });
  },
});

export const {
  addNotification,
  clearNotification,
  makeUserPending,
  clearSearchUsers,
} = userSlice.actions;
export default userSlice.reducer;
