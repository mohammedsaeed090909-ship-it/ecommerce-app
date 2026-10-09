import { Navbar, Container, Nav ,Form,Button} from "react-bootstrap";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../rtk/slices/productSlice";
import "../styles/navbar.css"

function AppNavbar(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

        const [search, setSearchInput] = useState("");


    const cart = useSelector((state) => state.cart || []);
    const cartCount = cart.reduce((total, product) => {
    return total + product.quantity;
}, 0);
    return(
        <Navbar expand="lg" className="shop-navbar">
        <Container className="shop-navbar-container">
            <Navbar.Brand className="shop-brand" href="/">shop<span>.</span></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" >
            <Nav className="shop-nav-links">
                <Nav.Link as={NavLink} to="/"end>Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                <Nav.Link as={NavLink} to="/categories">Categories</Nav.Link>
                <Nav.Link as={NavLink} to="/cart">Cart<span className="cart-count">{cartCount}</span></Nav.Link>
            </Nav>
            <Form className="shop-search"
            onSubmit={(e) => {e.preventDefault();
            dispatch(setSearch(search));
            navigate("/products");
            }}>
                <Form.Control type="search" placeholder="What are you looking for?"aria-label="Search" value={search}
                onChange={(e)=>setSearchInput(e.target.value)}/>
                <Button type='submit' variant="outline-success"><i className="bi bi-arrow-right"></i></Button>
            </Form>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}

export default AppNavbar;