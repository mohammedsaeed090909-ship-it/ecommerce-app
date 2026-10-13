
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";

const loadCart = () => {
    try {
        const savedCart = localStorage.getItem("cart");
        if(!savedCart){
            return [];
        }
        const parsedCart =JSON.parse(savedCart);
        if(!Array.isArray(parsedCart)){
            return [];
        }
        return parsedCart;

    } catch (error) {
        console.error("Error loading cart:", error);
        return [];
    }
};

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart:cartReducer,
        auth: authReducer,
    },
    preloadedState: {
        cart: loadCart(),
    },
});
store.subscribe(() => {
    try {
        localStorage.setItem(
            "cart",
            JSON.stringify(store.getState().cart)
        );
    } catch (error) {
        console.error("Error saving cart:", error);
    }
});
export default store;