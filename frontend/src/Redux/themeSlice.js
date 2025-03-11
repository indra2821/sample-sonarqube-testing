import { createSlice } from "@reduxjs/toolkit";

// Get initial dark mode state from localStorage
const getInitialDarkMode = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme === "dark";
  }

  // If no saved preference, check system preference
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

// Apply initial theme class immediately
const applyThemeClass = (isDark) => {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

// Initial state
const initialState = {
  isDarkMode: getInitialDarkMode(),
};

// Apply initial theme class right away
applyThemeClass(initialState.isDarkMode);

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;

      // Update localStorage
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");

      // Apply theme class
      applyThemeClass(state.isDarkMode);

      // Dispatch event for theme change
      window.dispatchEvent(new Event("theme-change"));
    },
  },
});

// Export actions and reducer
export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;

// Selector
export const selectIsDarkMode = (state) => state.theme.isDarkMode;
