import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    const isAdmin = sessionStorage.getItem("adminLoggedIn") === "true";

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;