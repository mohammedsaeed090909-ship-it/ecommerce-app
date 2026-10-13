import { useEffect, useState } from "react";
import { Cleare } from "../rtk/slices/cartSlice";
import {
Container,
Card,
Alert,
Spinner,
Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../rtk/slices/authSlice";

import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
const user = useSelector((state) => state.auth.user);
const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
    dispatch(logout());
    dispatch(Cleare());
    navigate("/login", { replace: true });
};

const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchUser = async () => {
try {
const response = await fetch(
"https://fakestoreapi.com/users"
);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
        }

        const users = await response.json();

        const currentUser = users.find(
        (item) => item.username === user?.username
        );

        if (!currentUser) {
        throw new Error("User not found");
        }

        setProfile(currentUser);
    } catch (err) {
        setError("Could not load profile data.");
    } finally {
        setLoading(false);
    }
    };

    if (user?.username) {
    fetchUser();
    } else {
    setLoading(false);
    }

}, [user]);

if (loading) {
return (
<Container className="profile-page text-center">
<Spinner animation="border" />
</Container>
);
}

const username = profile?.username || user?.username || "User";
const initials = username.slice(0, 2).toUpperCase();

return (
    <div className="profile-page">
    <Container>
    <div className="profile-header">
    <h2>My Profile</h2>
    <p>Manage your account information</p>
    </div>

        <Card className="profile-card">
        <Card.Body className="profile-card-body">
            <div className="profile-avatar">
            {initials}
            </div>

            <h3 className="profile-username">
            {username}
            </h3>

            <p className="profile-role">
            <i className="bi bi-patch-check-fill me-1"></i>
            Store Member
            </p>

            {error && (
            <Alert variant="warning">{error}</Alert>
            )}

            <div className="profile-info">
            <span className="profile-label">Username</span>
            <div className="profile-value">
                {username}
            </div>
            </div>

            <div className="profile-info">
            <span className="profile-label">Email Address</span>
            <div className="profile-value">
                {profile?.email || "Not available"}
            </div>
            </div>

            <div className="profile-info">
            <span className="profile-label">First Name</span>
            <div className="profile-value">
                {profile?.name?.firstname || "Not available"}
            </div>
            </div>

            <div className="profile-info">
            <span className="profile-label">Last Name</span>
            <div className="profile-value">
                {profile?.name?.lastname || "Not available"}
            </div>
            </div>
            <Button
            variant="danger"
            className="w-100 mt-4"
            onClick={handleLogout}
            >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
            </Button>
        </Card.Body>
        </Card>
    </Container>
</div>

);
}

export default Profile;