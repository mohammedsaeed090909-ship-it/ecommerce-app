import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { apiFetch } from "../rtk/api";
import "../styles/register.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

const INITIAL_VALUES = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

// Fictional fixture values for the fields the form does not collect
// (the API user schema requires them). Documented in the README.
const FIXTURE = {
    address: {
        city: "Springfield",
        street: "Demo Street",
        number: 1,
        zipcode: "00000-0000",
        geolocation: { lat: "0.0000", long: "0.0000" },
    },
    phone: "000-000-0000",
};

function validate(v) {
    const errors = {};

    const first = v.firstName.trim();
    if (!first) errors.firstName = "First name is required.";
    else if (first.length < 2)
        errors.firstName = "First name must be at least 2 characters.";

    const last = v.lastName.trim();
    if (!last) errors.lastName = "Last name is required.";
    else if (last.length < 2)
        errors.lastName = "Last name must be at least 2 characters.";

    const username = v.username.trim();
    if (!username) errors.username = "Username is required.";
    else if (!USERNAME_RE.test(username))
        errors.username =
            "Username must be 3–20 characters: letters, digits and underscores only.";

    const email = v.email.trim();
    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(email))
        errors.email = "Enter a valid email address.";

    // Passwords are never trimmed or altered
    if (!v.password) errors.password = "Password is required.";
    else if (v.password.length < 8)
        errors.password = "Password must be at least 8 characters.";

    if (!v.confirmPassword)
        errors.confirmPassword = "Please confirm your password.";
    else if (v.confirmPassword !== v.password)
        errors.confirmPassword = "Passwords do not match.";

    return errors;
}

function FieldError({ name, message }) {
    if (!message) return null;
    return (
        <p id={`reg-${name}-error`} className="register-error">
            <span aria-hidden="true">⚠ </span>
            {message}
        </p>
    );
}

function Register() {
    const token = useSelector((state) => state.auth.token);

    const [values, setValues] = useState(INITIAL_VALUES);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formMessage, setFormMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const submittingRef = useRef(false);

    // Derived value: always computed from the current inputs
    const errors = validate(values);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const visibleError = (name) =>
        (touched[name] || submitted) && errors[name] ? errors[name] : "";

    const inputProps = (name, extraDescribedBy) => {
        const hasError = Boolean(visibleError(name));
        const describedBy = [extraDescribedBy, hasError && `reg-${name}-error`]
            .filter(Boolean)
            .join(" ");

        return {
            id: `reg-${name}`,
            name,
            value: values[name],
            onChange: handleChange,
            onBlur: handleBlur,
            className: "register-input",
            "aria-required": "true",
            "aria-invalid": hasError ? "true" : "false",
            "aria-describedby": describedBy || undefined,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submittingRef.current) return; // blocks double submission

        setSubmitted(true);
        setFormMessage("");

        if (Object.keys(errors).length > 0) {
            setFormMessage("Please fix the errors highlighted below.");
            return; // no request is sent for an invalid form
        }

        submittingRef.current = true;
        setLoading(true);

        try {
            // confirmPassword is intentionally not part of the payload
            const payload = {
                email: values.email.trim(),
                username: values.username.trim(),
                password: values.password,
                name: {
                    firstname: values.firstName.trim(),
                    lastname: values.lastName.trim(),
                },
                ...FIXTURE,
            };

            const data = await apiFetch("/users", {
                method: "POST",
                body: payload,
            });

            if (data?.id === undefined || data?.id === null) {
                throw new Error("Invalid response");
            }

            // Drop the passwords from memory; nothing is persisted
            setValues(INITIAL_VALUES);
            setTouched({});
            setSubmitted(false);
            setSuccess(true);
        } catch (err) {
            setFormMessage(
                "We couldn't create the account. Check your connection and try again."
            );
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    if (token) return <Navigate to="/products" replace />;

    if (success) {
        return (
            <main className="register-page">
                <div className="register-card">
                    <div className="register-card-body register-success" role="status">
                        <div className="register-icon">
                            <i className="bi bi-check-lg" aria-hidden="true"></i>
                        </div>
                        <h1 className="register-title">Account created</h1>
                        <p>
                            Account creation was simulated. To test login, use an
                            existing demo account.
                        </p>
                        <Link to="/login" className="register-button register-cta">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="register-page">
            <div className="register-card">
                <div className="register-card-body">
                    <div className="register-icon">
                        <i className="bi bi-person-plus" aria-hidden="true"></i>
                    </div>

                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join us and start shopping today</p>

                    {formMessage && (
                        <div className="register-alert" role="alert">
                            {formMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
                        <div className="register-row">
                            <div className="register-field">
                                <label htmlFor="reg-firstName" className="register-label">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    autoComplete="given-name"
                                    {...inputProps("firstName")}
                                />
                                <FieldError name="firstName" message={visibleError("firstName")} />
                            </div>

                            <div className="register-field">
                                <label htmlFor="reg-lastName" className="register-label">
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    autoComplete="family-name"
                                    {...inputProps("lastName")}
                                />
                                <FieldError name="lastName" message={visibleError("lastName")} />
                            </div>
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-username" className="register-label">
                                Username
                            </label>
                            <input
                                type="text"
                                autoComplete="username"
                                {...inputProps("username")}
                            />
                            <FieldError name="username" message={visibleError("username")} />
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-email" className="register-label">
                                Email address
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                {...inputProps("email")}
                            />
                            <FieldError name="email" message={visibleError("email")} />
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-password" className="register-label">
                                Password
                            </label>
                            <div className="register-password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    {...inputProps("password", "reg-password-hint")}
                                />
                                <button
                                    type="button"
                                    className="register-toggle"
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword((s) => !s)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <p id="reg-password-hint" className="register-hint">
                                Use at least 8 characters.
                            </p>
                            <FieldError name="password" message={visibleError("password")} />
                        </div>

                        <div className="register-field">
                            <label htmlFor="reg-confirmPassword" className="register-label">
                                Confirm password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                {...inputProps("confirmPassword")}
                            />
                            <FieldError
                                name="confirmPassword"
                                message={visibleError("confirmPassword")}
                            />
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="register-spinner" aria-hidden="true"></span>
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="visually-hidden" role="status">
                        {loading ? "Creating account, please wait." : ""}
                    </p>

                    <div className="register-login">
                        <span>Already have an account?</span>
                        <Link to="/login" className="register-login-link">
                            Login
                            <i className="bi bi-arrow-right" aria-hidden="true"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Register;