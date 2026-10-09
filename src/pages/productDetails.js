import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect } from "react";
import { fetchProducts } from "../rtk/slices/productSlice";
import { addToCart } from "../rtk/slices/cartSlice";
import "../styles/productDetails.css"


function ProductDetails(){
    const {id} = useParams();
    const { items, loading, error } = useSelector(
        (state) => state.products
    );    const dispatch = useDispatch()
    const product = items.find((item) => item.id === Number(id));
    useEffect(()=>{
            dispatch(fetchProducts())
    },[dispatch])
    if (loading) {
    return <Container><p>Loading...</p></Container>;
    }
    if (error) {
        return <Container><p>{error}</p></Container>;
    }
    if(!product){
        return(
        <Container className="product-details-page">
            <div className="product-loading">
                <h2>Loading...</h2>
            </div>
        </Container>)
    }

    return(
        <Container className="product-details-page">
            <Row className="product-details align-items-center">
                <Col lg={5} className="product-details-image-col">
                <div className="product-details-image-wrapper">
                    <img className="product-details-image" src={product.image} alt={product.title}/>
                </div>
                </Col>
                <Col lg={7} className="product-details-content">
                    <span className="product-details-category"> {product.category} </span>
                    <h1 className="product-details-title">{product.title}</h1>
                    {/* <h4 className="text-muted"> {product.author}</h4> */}
                    <p className="product-details-author"> {product.description}</p>
                    <div className="product-details-rating">
                        <span>★</span>
                        <strong>{product.rating.rate}</strong>
                        <span className="rating-count">({product.rating.count} reviews)</span>
                    </div>
                    <p className="product-details-description"> {product.description} </p>
                    <div className="product-details-price"> ${product.price}</div>

                    <div className="product-details-actions">
                        <Button className="add-cart-btn" onClick={() => dispatch(addToCart(product))} variant="primary" >Add to Cart</Button>
                        <Button className="back-products-btn" as={Link} to="/products" variant="secondary"> ← Back to products</Button>

                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ProductDetails;