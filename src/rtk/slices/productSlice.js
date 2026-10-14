import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
    },
    {
        condition: (_, { getState }) => {
            const { items, loading } = getState().products;
            return items.length === 0 && !loading;
        },
    }
);

export const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
        error: null,
        search:""
    },
    reducers:{
        setSearch:(state, action)=>{
            state.search = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to load products";
            });
    }
});

export const {setSearch} = productSlice.actions;
export default productSlice.reducer;