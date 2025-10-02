import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dialogReducer from "./dialogSlice";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import messageReducer from "./messageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    user: userReducer,
    chat: chatReducer,
    message: messageReducer,
  },
});

export default store;
