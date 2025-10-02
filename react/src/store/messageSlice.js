import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, formatRelativeTime } from "../main";
import { setDialog } from "./dialogSlice";

export const allMessages = createAsyncThunk("messages/all", async (chatID) => {
  const res = await axios.get(`${BASE_URL}messages/${chatID}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
});

export const sendMessage = createAsyncThunk("messages/send", async (info) => {
  const res = await axios.post(
    `${BASE_URL}messages/send/${info.chatID}`,
    {
      content: info.content,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return res.data;
});

export const deleteMessage = createAsyncThunk(
  "messages/delete",
  async (info, { dispatch }) => {
    const res = await axios.delete(
      `${BASE_URL}messages/delete/${info.chatID}/${info.messageID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setDialog(null));
    return res.data;
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    getAllMessagesLoading: false,
    sendLoading: false,
    deleteLoading: false,
    activeMessage: null,
    messages: [],
  },
  reducers: {
    setActiveMessage: (state, action) => {
      state.activeMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allMessages.pending, (state) => {
        state.getAllMessagesLoading = true;
      })
      .addCase(allMessages.fulfilled, (state, action) => {
        state.getAllMessagesLoading = false;
        console.log(action.payload.messages);
        const updatedMessages = action.payload.messages.map((message) => {
          return {
            ...message,
            created_at: formatRelativeTime(message.created_at),
          };
        });
        state.messages = updatedMessages;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sendLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendLoading = false;
        console.log(action.payload.message);
      })
      .addCase(deleteMessage.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        console.log(action.payload.message);
      });
  },
});

export const { setActiveMessage } = messageSlice.actions;
export default messageSlice.reducer;
