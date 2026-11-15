import { Navigate, Outlet } from "react-router-dom";
import {useEffect, useState} from "react";
import API from "../api";
import {ADMIN_DEVICE_KEY} from '../Services/AdminDeviceStorage';

const AdminProtectedRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    useEffect(() => {
        let active = true;
        const signedOut = () => {if (active) setIsAdmin(false);};
        const storageChanged = event => {if ((event.key === ADMIN_DEVICE_KEY || event.key === null) && !event.newValue) signedOut();};
        window.addEventListener('admin-session-ended', signedOut);
        window.addEventListener('storage', storageChanged);
        API.adminAPI.session().then(() => { if (active) setIsAdmin(true); })
            .catch(() => { if (active) setIsAdmin(false); });
        return () => { active = false; window.removeEventListener('admin-session-ended', signedOut); window.removeEventListener('storage', storageChanged); };
    }, []);

    if (isAdmin === null) return <p role="status">Checking admin access…</p>;

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
