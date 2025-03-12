import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  } catch (error) {
    console.warn("Failed to get theme preference:", error);
    return false;
  }
};

const applyThemeClass = (isDark) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", isDark);
  }
};

const initialState = { isDarkMode: getInitialDarkMode() };
applyThemeClass(initialState.isDarkMode);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
      applyThemeClass(state.isDarkMode);
      window.dispatchEvent(new Event("theme-change"));
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
export const selectIsDarkMode = (state) => state.theme.isDarkMode;
