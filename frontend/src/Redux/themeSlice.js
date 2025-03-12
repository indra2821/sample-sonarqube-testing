import { createSlice } from "@reduxjs/toolkit";

// Get initial dark mode state from localStorage
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

// Apply theme class immediately
const applyThemeClass = (isDark) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", isDark);
  }
};

// Initial state
const initialState = { isDarkMode: getInitialDarkMode() };

// Apply initial theme class
applyThemeClass(initialState.isDarkMode);

export const ThemeSlice = createSlice({
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

// Export correct reducer and actions
export const { toggleDarkMode } = ThemeSlice.actions;
export default ThemeSlice.reducer;

// Selector
export const selectIsDarkMode = (state) => state.theme.isDarkMode;
