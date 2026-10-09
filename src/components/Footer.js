import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
    return (
        <footer className="shop-footer">
            <Container>
                <Row className="footer-content">
                    {/* Brand */}
                    <Col lg={4} md={6} className="footer-brand">
                        <Link to="/" className="footer-logo">
                            shop<span>.</span>
                        </Link>

                        <p>
                            Discover products you'll love.
                            Quality, style, and a better shopping
                            experience — all in one place.
                        </p>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={2} md={6} className="footer-links">
                        <h5>Quick Links</h5>
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/categories">Categories</Link>
                        <Link to="/cart">Cart</Link>
                    </Col>

                    {/* Customer Service */}
                    <Col lg={3} md={6} className="footer-links">
                        <h5>Customer Service</h5>
                        <a href="mailto:support@example.com">Contact Us</a>
                        <Link to="/products">Browse Products</Link>
                        <Link to="/categories">Explore Categories</Link>
                    </Col>

                    {/* Newsletter */}
                    <Col lg={3} md={6} className="footer-newsletter">
                        <h5>Stay Connected</h5>
                        <p>
                            Explore our latest products and find
                            something you'll love.
                        </p>

                        <Link
                            to="/products"
                            className="footer-cta"
                        >
                            Start Shopping →
                        </Link>
                    </Col>
                </Row>

                {/* Bottom Footer */}
                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} Shop. All rights reserved.
                    </p>

                    <Link to="/" className="footer-back-top">
                        Back to Home ↑
                    </Link>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
