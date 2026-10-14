import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main style={{ padding: "120px 24px", textAlign: "center" }}>
            <h1>Page not found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/products">← Back to products</Link>
        </main>
    );
}

export default NotFound;