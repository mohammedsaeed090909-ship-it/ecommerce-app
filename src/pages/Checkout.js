import { useDispatch, useSelector } from "react-redux";
import {  Navigate, useLocation } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { useState } from "react";
import { Cleare} from "../rtk/slices/cartSlice"
import { apiFetch } from "../rtk/api";
import "../styles/checkout.css"

function Checkout(){
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const dispatch = useDispatch();

    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    const cart = useSelector((state)=>
    state.cart);

    const totalItems = cart.reduce((total, product) => {
        return total + product.quantity
    }, 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (fullName.trim().length < 3) {
        setError("Full name must be at least 3 characters");
        setLoading(false);
        return;
    }
        if (!email.trim()) {
        setError("Email is required");
        setLoading(false);
        return;
    }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
    }

    if (address.trim().length < 10) {
        setError("Address must be at least 10 characters");
        setLoading(false);
        return;
    }
    try {
        const orderData = {
            userId: user.id,
            date: new Date().toISOString(),
            products: cart.map((p) => ({
                productId: p.id,
                quantity: p.quantity,
            })),
        };

        const result = await apiFetch("/carts", {
            method: "POST",
            body: orderData,
            auth: true,
        });

        dispatch(Cleare());
        alert(`Order placed successfully! Order ID: ${result.id}`);
    } catch (error) {
        setError(error.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};

if (!token) {
    return (
        <Navigate
            to="/login"
            state={{ from: location }}
            replace
        />
    );
    }
    if (cart.length === 0) {
        return <Navigate to="/products" replace />;
    }


    return(
    <Container className="checkout-page">
        <div className="checkout-header">
            <h2>Checkout</h2>
            <p className="checkout-subtitle">Complete your details and get your order ready.</p>
            {user && (
                <p className="checkout-welcome">Welcome back, {user.username}</p>
            )}
        </div>
        <div className="checkout-layout">
            <section className="checkout-card">
                    <h3>Delivery Details</h3>
                    <p className="checkout-description">
                        Enter your information to complete your order.
                    </p>
            <Form onSubmit={handleSubmit}>
                {error && (<p className="checkout-error">{error}</p>)}

                <Form.Group className="checkout-field">
                    <label htmlFor="fullName" className="form-label"> Full Name </label>
                    <input type="text" id="fullName" className="form-control" value={fullName}
                        onChange={(e) => setFullName(e.target.value)}placeholder="Enter your full name" required/>
                </Form.Group>
                <Form.Group className="checkout-field">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input type="email" id="email" className="form-control" value={email}
                        onChange={(e) => setEmail(e.target.value)}placeholder="Enter your email" required/>
                </Form.Group>
                <Form.Group className="checkout-field">
                    <label htmlFor="address" className="form-label">Your Address</label>
                    <input type="text" id="address" className="form-control" value={address}
                        onChange={(e) => setAddress(e.target.value)}placeholder="Enter your address" required/>
                </Form.Group>
                <button type="submit" className="checkout-submit" disabled={loading}>
                {loading ? "Placing order..." : "Place Order"}
                </button>
            </Form>
            </section>

                <aside className="checkout-card checkout-summary">
                <h3>Order Summary</h3>
                <div className="checkout-summary-row">
                    <span>Total Items</span>
                    <span>{totalItems}</span>
                </div>
                <div className="checkout-summary-row checkout-total">
                    <span>Total Price</span>
                    <span>
                        $
                        {cart.reduce(
                            (total, product) =>
                                total + product.price * product.quantity,
                            0
                        ).toFixed(2)}
                    </span>
                </div>

                <p className="checkout-summary-note">
                    Review your order before placing it.
                </p>
            </aside>
            </div>
    </Container>)
}


export default Checkout;