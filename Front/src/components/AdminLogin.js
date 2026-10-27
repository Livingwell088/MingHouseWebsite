import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "../styles/Admin.css";
import API from "../api";





const AdminLogin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("admin");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const login = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            await API.adminAPI.login(username, password);
            setPassword("");
            navigate("/admin", {replace: true});
        } catch (error) {
            setError(error.response?.status === 401 ? "Incorrect username or password." : "Unable to sign in. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="adminLoginPage">
            <form className="adminLoginCard" onSubmit={login}>
                <h1>Admin Login</h1>
                <input aria-label="Admin username" autoComplete="username" value={username}
                       onChange={(e) => setUsername(e.target.value)} required />

                <input
                    type="password"
                    aria-label="Admin password"
                    autoComplete="current-password"
                    required
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p role="alert">{error}</p>}
                <button type="submit" disabled={busy}>{busy ? "Signing in…" : "Login"}</button>
            </form>
        </div>
    );
};

export default AdminLogin;
