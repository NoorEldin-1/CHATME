import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, FILE_URL } from "../main";
import { setDialog } from "./dialogSlice";

export const allChats = createAsyncThunk("chats/all", async () => {
  const res = await axios.get(`${BASE_URL}chats/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
});

export const chatDelete = createAsyncThunk(
  "chats/delete",
  async (id, { dispatch }) => {
    const res = await axios.delete(`${BASE_URL}chats/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    dispatch(setDialog(null));
    dispatch(setActiveChat(null));
    return res.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    allChatsLoading: false,
    activeChat: null,
    deleteChatLoading: false,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
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
      })
      .addCase(chatDelete.pending, (state) => {
        state.deleteChatLoading = true;
      })
      .addCase(chatDelete.fulfilled, (state, action) => {
        state.deleteChatLoading = false;
        console.log(action.payload);
      });
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
