import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authReducer,{logout} from "./slices/authSlice";
import { setUnauthorizedHandler } from "./api";

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

// Any 401 on an authenticated request logs the user out
setUnauthorizedHandler(() => store.dispatch(logout()));


// Persist only when the value actually changed
let prevCart = store.getState().cart;
let prevAuth = store.getState().auth;

store.subscribe(() => {
    const { cart, auth } = store.getState();

    if (cart !== prevCart) {
        prevCart = cart;
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }

    if (auth.token !== prevAuth.token || auth.user !== prevAuth.user) {
        prevAuth = auth;
        try {
            if (auth.token && auth.user) {
                sessionStorage.setItem("token", auth.token);
                sessionStorage.setItem("user", JSON.stringify(auth.user));
            } else {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
            }
        } catch (error) {
            console.error("Error saving session:", error);
        }
    }
});

export default store;





// store.subscribe(() => {
//     try {
//         localStorage.setItem(
//             "cart",
//             JSON.stringify(store.getState().cart)
//         );
//     } catch (error) {
//         console.error("Error saving cart:", error);
//     }
// });
// export default store;