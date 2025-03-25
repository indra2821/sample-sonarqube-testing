import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Async thunk for checking authentication status
export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/check-auth",
        {
          credentials: "include", // Important for cookies
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication check failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Logout failed");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    _id: null,
    name: "",
    email: "",
    role: "",
    bookmarked_courses: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    tokenChecked: false, // To track if we've checked auth status
  },
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.bookmarked_courses = action.payload.bookmarked_courses || [];
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser: (state, action) => {
      // For partial updates (like bookmarks)
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      state._id = null;
      state.name = "";
      state.email = "";
      state.role = "";
      state.bookmarked_courses = [];
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokenChecked = true;
        if (action.payload.isAuthenticated) {
          state._id = action.payload.user._id;
          state.name = action.payload.user.name;
          state.email = action.payload.user.email;
          state.role = action.payload.user.role;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.tokenChecked = true;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state._id = null;
        state.name = "";
        state.email = "";
        state.role = "";
        state.bookmarked_courses = [];
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCurrentUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserRole = (state) => state.user.role;
export const selectUserId = (state) => state.user._id;
export const selectTokenChecked = (state) => state.user.tokenChecked;
export const selectBookmarkedCourses = (state) => state.user.bookmarked_courses;

export const { setUser, clearUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
