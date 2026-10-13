
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk("auth/loginUser",
    async (userData, thunkAPI) => {
        try {
        const response = await fetch(
            "https://fakestoreapi.com/auth/login",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            }
        );

        if (!response.ok) {
            return thunkAPI.rejectWithValue("Login failed");
        }

        const data = await response.json();
        return data;
        } catch (error) {
        return thunkAPI.rejectWithValue("Something went wrong");
        }
    }
    );

    const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:localStorage.getItem("username")? {
            username: localStorage.getItem("username"),
            email: localStorage.getItem("email"),
        }: null,
        token: localStorage.getItem("token"),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
        state.user = null;
        state.token = null;

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
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

            state.user = {
                username: action.meta.arg.username,
                email: action.meta.arg.email,
            };

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.meta.arg.username);
            localStorage.setItem("email", action.meta.arg.email);
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
    });

export const { logout } = authSlice.actions;
export default authSlice.reducer;
