import { createSlice } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name:"cartSlice",
    initialState:[],
    reducers:{
        addToCart:(state, action)=>{
            const findProduct = state.find((product)=> product.id === action.payload.id);
            if (findProduct){
                findProduct.quantity += 1;
            }else{
                const productClone = {...action.payload,quantity:1}
                state.push(productClone)
            }
        },
        increaseQuantity:(state, action)=>{
            const product = state.find((product)=> product.id ===action.payload.id)

            if(product){
                product.quantity += 1;
            }
        },
        decreaseQuantity:(state, action)=>{
            const product = state.find((product)=> product.id ===action.payload.id)

            if(product && product.quantity >1){
                product.quantity -= 1;
            }
        },
        deleteFromCart:(state, action)=>{
            return state.filter((product)=> product.id !== action.payload.id )
        },
        Cleare:(state, action)=>{
            return []
        }

    }
})



export const { addToCart, increaseQuantity, decreaseQuantity, deleteFromCart, Cleare} = cartSlice.actions;
export default cartSlice.reducer;