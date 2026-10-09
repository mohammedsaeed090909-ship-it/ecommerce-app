import { Button, Container, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteFromCart, Cleare, increaseQuantity, decreaseQuantity } from "../rtk/slices/cartSlice";
import "../styles/cart.css"

function Cart(){

    const cart =useSelector((state)=>state.cart)
    const dispatch =useDispatch()
    const totalPrice = cart.reduce((total, product) => {
    return total + product.price * product.quantity;
}, 0);
    return(
        <Container className="cart-page"> 
            <div className="cart-header">
                <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
                <h1>Shopping Cart</h1>
                <p>Review your items before checkout.</p>
            </div>
            <div className="cart-table-wrapper">
                <Table responsive className="cart-table align-middle">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="cart-product-info">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="cart-product-image"
                                        />
                                        <span className="cart-product-title">
                                            {product.title}
                                        </span>
                                    </div>
                                </td>

                                <td className="cart-price">
                                    ${Number(product.price).toFixed(2)}
                                </td>

                                <td>
                                    <div className="quantity-control">
                                        <Button
                                            className="quantity-btn"
                                            aria-label="Decrease quantity"
                                            disabled={product.quantity <= 1}
                                            onClick={() =>
                                                dispatch(decreaseQuantity(product))
                                            }
                                        >
                                            −
                                        </Button>

                                        <span className="quantity-value">
                                            {product.quantity}
                                        </span>

                                        <Button
                                            className="quantity-btn"
                                            aria-label="Increase quantity"
                                            onClick={() =>
                                                dispatch(increaseQuantity(product))
                                            }
                                        >
                                            +
                                        </Button>
                                    </div>
                                </td>

                                <td className="cart-price">
                                    ${(product.price * product.quantity).toFixed(2)}
                                </td>

                                <td>
                                    <Button
                                        className="delete-btn"
                                        onClick={() =>
                                            dispatch(deleteFromCart(product))
                                        }
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="cart-summary">
                <div>
                    <span className="cart-summary-label">Total Price</span>
                    <h2>${totalPrice.toFixed(2)}</h2>
                </div>

                <div className="cart-summary-actions">
                    <Button
                        className="clear-cart-btn"
                        onClick={() => dispatch(Cleare())}
                    >
                        Clear Cart
                    </Button>

                    <Button className="checkout-btn">
                        Proceed to Checkout →
                    </Button>
                </div>
            </div>

            <Link to="/products" className="continue-shopping-link">
                ← Continue Shopping
            </Link>
        
        </Container>
    )
}


export default Cart