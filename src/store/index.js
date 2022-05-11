import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./features/appState";

export const store = configureStore({
  reducer: {
    pingallery: appReducer,
  },
});
