import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Async Thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials, {
        headers: {
          "X-App-Secret": `${SECRET_KEY}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("jwtToken");

    await axios.post(`${API_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-App-Secret": `${SECRET_KEY}`,
      },
    });
    localStorage.removeItem("jwtToken");
    dispatch(authSlice.actions.clearAuth());
  }
);

export const validateAuthToken = createAsyncThunk(
  "auth/validateAuthToken",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem("jwtToken");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn(
          "Token expired client-side. Will attempt server validation."
        );
        return rejectWithValue("Token expired");
      }

      const response = await axios.get(`${API_URL}/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        return { token, user: state.auth.user || decoded.data };
      } else {
        return rejectWithValue("Server token validation failed");
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Token validation failed"
      );
    }
  }
);

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("jwtToken", action.payload.token);
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("jwtToken");
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        console.warn(
          "Attempted to set user data, but no user currently exists in state."
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("jwtToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("jwtToken");
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Validate Token (for re-hydration or periodic checks)
      .addCase(validateAuthToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(validateAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("jwtToken", action.payload.token);
      })
      .addCase(validateAuthToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Token validation failed";
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("jwtToken");
      });
  },
});

export const { setAuth, clearAuth, setAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
