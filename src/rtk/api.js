const BASE_URL = "https://fakestoreapi.com";

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Registered from store.js, so api.js never imports the store (avoids a circular import)
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
    onUnauthorized = fn;
};

export const getToken = () => sessionStorage.getItem("token");

// Rejects empty tokens and expired JWTs. Non-JWT tokens are accepted if non-empty.
export function isTokenValid(token) {
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return true;

    try {
        const payload = JSON.parse(
            atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        return !payload.exp || payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const token = getToken();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
        // Only authenticated calls trigger a forced logout (a wrong password on /auth/login is also a 401)
        if (auth && onUnauthorized) onUnauthorized();
        throw new ApiError("Unauthorized", 401);
    }

    if (!res.ok) {
        throw new ApiError(`Request failed (${res.status})`, res.status);
    }

    return res.json();
}