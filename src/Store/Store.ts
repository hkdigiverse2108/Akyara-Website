import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
