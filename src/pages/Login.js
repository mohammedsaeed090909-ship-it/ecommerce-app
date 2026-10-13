
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../rtk/slices/authSlice";
import { Container, Form, Button, Alert, Card,} from "react-bootstrap";
import { Link, useLocation ,useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
const dispatch = useDispatch();
const location = useLocation();
const navigate = useNavigate();
const { loading, error } = useSelector(
(state) => state.auth
);

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await dispatch(
            loginUser({ username, password })
        ).unwrap();
        const from = location.state?.from;
        navigate(from?.pathname || "/", { replace: true });
    } catch (err) {
    }
};

return (
    <div className="login-page">
    <Container>
    <Card className="login-card mx-auto">
    <Card.Body className="login-card-body">
        <div className="login-icon"><i className="bi bi-person-lock"></i></div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue shopping</p>

            {error && (<Alert variant="danger">{error}</Alert>)}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="login-label">Username</Form.Label>
                    <Form.Control className="login-input" type="text" placeholder="Enter your username" value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    } autoComplete="username" required />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label className="login-label"> Password </Form.Label>

                    <Form.Control className="login-input" type="password" placeholder="Enter your password" value={password} 
                    onChange={(e) =>
                        setPassword(e.target.value)}
                    autoComplete="current-password" required/>
                </Form.Group>

                <Button type="submit" className="login-button w-100" disabled={loading} >
                    {loading ? (
                    "Logging in..."
                    ) : (
                    <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                    </>
                    )}
                </Button>
                <div className="login-register">
                <span>Don't have an account?</span>
                <Link to="/register" className="register-link">
                    Create an account<i className="bi bi-arrow-right ms-2"></i>
                </Link>
                </div>
            </Form>
        </Card.Body>
        </Card>
    </Container>
</div>
);
}

export default Login;
