
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch, getToken, isTokenValid  } from "../api";

const loadSession = () => {
    // Remove the old localStorage keys left by the previous version
    ["token", "username", "email"].forEach((k) => localStorage.removeItem(k));

    try {
        const token = getToken();
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (isTokenValid(token) && user?.id && user?.username) {
            return { token, user: { id: user.id, username: user.username } };
        }
    } catch (e) {
        // fall through to a clean state
    }

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return { token: null, user: null };
};


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ username, password }, thunkAPI) => {
        try {
            const { token } = await apiFetch("/auth/login", {
                method: "POST",
                body: { username, password },
            });

            // The login endpoint returns only a token, so look up the user's id
            const users = await apiFetch("/users");
            const found = users.find((u) => u.username === username);
            if (!found) return thunkAPI.rejectWithValue("User not found");

            return { token, user: { id: found.id, username: found.username } };
        } catch (err) {
            if (err.status === 401) {
                return thunkAPI.rejectWithValue("Invalid username or password");
            }
            return thunkAPI.rejectWithValue("Something went wrong");
        }
    }
);


    const authSlice = createSlice({
    name: "auth",
    initialState: { ...loadSession(), loading: false, error: null },
    reducers: {
        logout: (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.user =action.payload.user;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong"
        });
    },
    });

export const { logout } = authSlice.actions;
export default authSlice.reducer;
