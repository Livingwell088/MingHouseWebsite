import { Outlet, NavLink } from "react-router-dom";
import "../styles/Admin.css";

const AdminLayout = (props) => {
    return (
        <div className="adminPage">
            <aside className="adminSidebar">
                <h2>Ming House Admin</h2>

                <nav>
                    <NavLink to="/admin">Dashboard</NavLink>
                    <NavLink to="/admin/orders">Orders</NavLink>
                    <NavLink to="/admin/menu">Menu</NavLink>
                    <NavLink to="/admin/analytics">Analytics</NavLink>
                    <NavLink to="/admin/store">Store Settings</NavLink>
                </nav>
            </aside>

            <main className="adminContent">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;