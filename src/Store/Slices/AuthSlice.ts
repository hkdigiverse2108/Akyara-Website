import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../../Constants";
import type { AuthSessionUser } from "../../Types";
import { Storage, Stringify } from "../../Utils";

const parseStoredUser = (): AuthSessionUser | null => {
  try {
    return JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");
  } catch {
    return null;
  }
};

type AuthState = {
  token: string | null;
  user: AuthSessionUser | null;
  isAuthenticated: boolean;
};

const StoredUser = parseStoredUser();
const StoredToken = Storage.getItem(STORAGE_KEYS.TOKEN) || null;

const initialState: AuthState = {
  token: StoredToken,
  user: StoredUser,
  isAuthenticated: !!StoredToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignin: (state, action: PayloadAction<AuthSessionUser>) => {
      state.token = action.payload.token ?? null;
      state.isAuthenticated = !!action.payload.token;
      state.user = action.payload;

      if (action.payload.token) {
        Storage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      }
      Storage.setItem(STORAGE_KEYS.USER, Stringify(action.payload));
    },
    setUser: (state, action: PayloadAction<AuthSessionUser | null>) => {
      state.user = action.payload;

      if (action.payload) {
        Storage.setItem(STORAGE_KEYS.USER, Stringify(action.payload));
      } else {
        Storage.removeItem(STORAGE_KEYS.USER);
      }
    },
    setSignOut: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Storage.removeItem(STORAGE_KEYS.TOKEN);
      Storage.removeItem(STORAGE_KEYS.USER);
    },
  },
});

export const { setSignOut, setUser, setSignin } = authSlice.actions;
export default authSlice.reducer;
