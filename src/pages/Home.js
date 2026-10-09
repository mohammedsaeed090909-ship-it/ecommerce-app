import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/home.css"

function Home (){
    return(
        <Container className="home-container">
            <Row className="home-hero align-items-center">
                <Col md={7} className="home-content">
                    <span className="home-eyebrow">YOUR NEXT FAVORITE FIND</span>
                    <h1>Discover Products<br />You'll <span>Love.</span></h1>
                    <p>Explore our collection of amazing Products, and inspiration waiting for you.</p>
                    <div className="home-actions">
                        <Button as={Link} to="/products" className="home-primary-btn">
                            Browse Products<span>→</span>
                        </Button>
                        <Button as={Link} to="/categories" className="home-secondary-btn">
                            Explore Categories
                        </Button>
                    </div>
                </Col>
                <Col md={5}>
                <div className="home-image-wrapper">
                    <img src="hero.jpg"
                    className="home-image"
                    alt="ecommerce store collection"></img>

                </div>
                </Col>
            </Row>
        </Container>
    )
}


export default Home;