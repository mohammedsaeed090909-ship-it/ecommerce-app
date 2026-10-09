
import { useSelector } from "react-redux";
import { Container, Row, Card, Button, Col, Spinner ,Alert} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/categories.css"

function Categories(){
    const navigate = useNavigate()
    const { items, loading, error } = useSelector(
    (state) => state.products
);
    const filterCategories = [...new Set(
        items.map((product)=>product.category)
    )]

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-3">Loading categories...</p>
            </Container>
        );
    }
    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    Failed to load categories: {error}
                </Alert>
            </Container>
        );
    }
    return(
        <Container className="categories-page">
            <div className="categories-header">
                <span className="categories-eyebrow">EXPLORE OUR STORE</span>
                <h1 className="categories-heading">Shop by Category</h1>
                <p>Explore our collection and find products you'll love.</p>
            </div>
        <Row className="categories-grid g-4">
        {filterCategories.map((cat)=>{
            const catProduct = items.filter(
                (product) => product.category === cat
            )
            return(
                <Col key={cat} xs={12} sm={6} md={4} lg={3}>
                    <Card className="category-card">
                        <div className="category-image-wrapper">
                            <Card.Img className="category-image" variant="top" src={catProduct[0]?.image} />
                        </div>
                        <Card.Body className="category-card-body">
                            <Card.Title className="category-title">{cat}</Card.Title>
                            <Card.Text className="category-count">{catProduct.length} Products</Card.Text>
                            <Button className="category-view-btn" 
                            onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}>
                                View Products <span>→</span></Button>
                        </Card.Body>
                    </Card>
                </Col>
            )
        })}
        </Row>
        </Container>
    )
}


export default Categories;