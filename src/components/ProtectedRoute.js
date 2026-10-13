import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
    const token = useSelector((state) => state.auth.token);
    const location = useLocation();

    return token ? (
        <Outlet />
    ) : (
        <Navigate
        to="/login"
        state={{ from: location }}
        replace
        />
    );
}

export default ProtectedRoute;
