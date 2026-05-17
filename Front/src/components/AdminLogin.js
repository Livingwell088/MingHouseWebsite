import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "../styles/Admin.css";





const AdminLogin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const login = () => {
        if (password === "your-temp-password") {
            sessionStorage.setItem("adminLoggedIn", "true");
            navigate("/admin");
        }
    };

    return (
        <div className="adminLoginPage">
            <div className="adminLoginCard">
                <h1>Admin Login</h1>

                <input
                    type="password"
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={login}>Login</button>
            </div>
        </div>
    );
};

export default AdminLogin;