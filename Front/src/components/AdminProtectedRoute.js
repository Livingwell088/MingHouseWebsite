import { Navigate, Outlet } from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../api";

const AdminProtectedRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
        let active = true;
        API.adminAPI.session().then(() => { if (active) setIsAdmin(true); })
            .catch(() => { if (active) setIsAdmin(false); });
        return () => { active = false; };
    }, []);

    if (isAdmin === null) return <p role="status">Checking admin access…</p>;

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
