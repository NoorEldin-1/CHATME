import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dialogReducer from "./dialogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
  },
});

export default store;
