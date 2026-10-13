
import { useState } from "react";
import { Container, Form, Button, Card, Alert, Spinner,} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
    ...formData,
    [name]: value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
    const response = await fetch(
        "https://fakestoreapi.com/users",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        }
    );

    if (!response.ok) {
        throw new Error("Registration failed");
    }

    const data = await response.json();
    console.log("Registration successful:", data);

    navigate("/login");
    } catch (error) {
    console.error("Registration error:", error);
    setError("Something went wrong. Please try again.");
    } finally {
    setLoading(false);
    }
};

return (
    <div className="register-page">
    <Container>
        <Card className="register-card mx-auto">
        <Card.Body className="register-card-body">
            <div className="register-icon"><i className="bi bi-person-plus"></i></div>

            <h2 className="register-title">Create Account</h2>

            <p className="register-subtitle">Join us and start shopping today</p>

            {error && (
            <Alert variant="danger">{error}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label className="register-label">Username</Form.Label>
                <Form.Control className="register-input" type="text" name="username" placeholder="Enter your username" 
                value={formData.username} 
                onChange={handleChange} autoComplete="username" required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className="register-label">Email Address</Form.Label>

                <Form.Control className="register-input" type="email" name="email" placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange} autoComplete="email" required />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="register-label">Password</Form.Label>

                <Form.Control className="register-input" type="password" name="password" placeholder="Create a password" value={formData.password}
                onChange={handleChange}
                autoComplete="new-password" minLength={6} required/>
                <Form.Text className="register-hint">Use at least 6 characters.</Form.Text>
            </Form.Group>

            <Button
                type="submit"
                className="register-button w-100"
                disabled={loading}
            >
                {loading ? (
                <>
                    <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                    />
                    Creating account...
                </>
                ) : (
                <>
                    <i className="bi bi-person-check me-2"></i>
                    Create Account
                </>
                )}
            </Button>
            </Form>

            <div className="register-login">
            <span>Already have an account?</span>
            <Link to="/login" className="register-login-link">
                Login
                <i className="bi bi-arrow-right ms-2"></i>
            </Link>
            </div>
        </Card.Body>
        </Card>
    </Container>
    </div>
);
}

export default Register;
