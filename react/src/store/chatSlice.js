import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, FILE_URL } from "../main";

export const allChats = createAsyncThunk("chats/all", async () => {
  const res = await axios.get(`${BASE_URL}chats/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    allChatsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allChats.pending, (state) => {
        state.allChatsLoading = true;
      })
      .addCase(allChats.fulfilled, (state, action) => {
        state.allChatsLoading = false;
        state.chats = action.payload.chats.map((chat) => {
          const updatedChat = { ...chat };

          if (updatedChat.other_user?.image) {
            updatedChat.other_user.image = `${FILE_URL}${updatedChat.other_user.image}`;
          }

          return updatedChat;
        });
        console.log(state.chats);
      });
  },
});

export default chatSlice.reducer;
