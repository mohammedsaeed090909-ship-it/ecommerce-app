import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,setSearch} from "../rtk/slices/productSlice";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { addToCart } from "../rtk/slices/cartSlice";
import { Link ,useNavigate,useSearchParams} from "react-router-dom";
import "../styles/products.css"

function Products() {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { items, loading, error } = useSelector(
        (state) => state.products
    );
    const search = useSelector((state) => state.products.search);
    // const cart = useSelector((state) => state.cart);
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 8;

    const category = searchParams.get("category");
    const filteredProducts = items.filter((product) => {
        const matchesCategory =
            !category || product.category === category;

        const matchesSearch =
            product.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    useEffect(() => {
    setCurrentPage(1);
}, [category,search]);
    const filterCategories =[...new Set(
    items.map((product)=>product.category))
]
    if (loading) {
        return <Container><p>Loading products...</p></Container>;
    }
    if (error) {
        return <Container><p>{error}</p></Container>;
    }

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const startIndex = (currentPage -1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const displayedProducts = filteredProducts.slice(startIndex, endIndex);
    return (
        <Container className="products-container">
            <div className="products-header">
                <span className="products-eyebrow">OUR COLLECTION</span>
                <h1>Discover Products</h1>
                <p>Explore our collection and find something you'll love.</p>
            </div>
            {search && (
                <div className="active-search">
                    <span>Results for “{search}”</span>
                    <Button
                        className="clear-search-btn"
                        onClick={() => dispatch(setSearch(""))}
                    >
                        Clear ✕
                    </Button>
                </div>
            )}

            <div className="category-filters">
                <Button className={`category-btn ${!category ? "active" : ""}`}
                onClick={() => navigate("/products")}>   
                    All</Button>

                {filterCategories.map((cat)=>
                <Button key={cat} className={`category-btn ${category === cat ? "active" : ""}`} 
                    onClick={()=>{navigate(`/products?category=${cat}`)
                }}>{cat}</Button>
                )}
            </div>
            <Row className="products-grid">
                {displayedProducts.map((product)=>(
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="product-column">
                    <Card className="product-card">
                        <Link to={`/products/${product.id}`} className="product-image-link">
                            <div className="product-image-wrapper">
                                <Card.Img variant="top" src={product.image} alt={product.title} className="product-image"/>
                            </div>
                        </Link>

                        <Card.Body className="product-card-body">
                            <Card.Title className="product-title">{product.title}</Card.Title>
                            <div className="product-card-bottom">
                                <span className="product-price">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                <Button className="add-to-cart-btn" onClick={() => dispatch(addToCart(product))}>
                                    Add to Cart</Button>
                            </div>

                            <Button as={Link} to={`/products/${product.id}`} className="view-details-btn" >
                                View Details →
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                ))}
                
            </Row>
            {filteredProducts.length === 0 && (
                <div className="products-empty">
                    <h3>No products found</h3>
                    <p>Try a different search or category.</p>
                    <Button
                        className="category-btn"
                        onClick={() => {
                            dispatch(setSearch(""));
                            navigate("/products");
                        }}
                    >
                        Reset filters
                    </Button>
                </div>
            )}

            {totalPages > 1 && (
            <div className="pagination">
                <Button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>

                {pages.map((page) => (
                    <Button
                        key={page}
                        className={`pagination-btn ${
                            currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
            )}
        </Container>
    );
}

export default Products;