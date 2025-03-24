import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    role: "",
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.name = "";
      state.role = "";
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
