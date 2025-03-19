import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  try {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  } catch (error) {
    console.warn("Failed to get theme preference:", error);
    return false;
  }
};

const themeSlice = createSlice({
  name: "theme",
  initialState: { isDarkMode: getInitialDarkMode() },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
export const selectIsDarkMode = (state) => state.theme.isDarkMode;
