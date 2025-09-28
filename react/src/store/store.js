import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dialogReducer from "./dialogSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    user: userReducer,
  },
});

export default store;
