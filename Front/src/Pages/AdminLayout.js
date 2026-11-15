import {Outlet, NavLink, Link, useNavigate} from 'react-router-dom';
import API from '../api';
import {useState} from 'react';
import {Modal} from 'react-bootstrap';
import AdminOrderingControl from '../components/AdminOrderingControl';
import AdminOrderAlarm from '../components/AdminOrderAlarm';
import {AdminOrdersProvider} from '../Services/useAdminOrders';
import '../styles/Admin.css';
export default function AdminLayout() {
    return <AdminOrdersProvider><AdminLayoutContent/></AdminOrdersProvider>;
}
function AdminLayoutContent() {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false), [error, setError] = useState('');
    const [confirmAll, setConfirmAll] = useState(false);
    const logout = async (all = false) => {
        setBusy(true); setError('');
        try {
            await (all ? API.adminAPI.revokeDevices() : API.adminAPI.logout());
            navigate('/admin/login', {replace: true, state: {message: all ? 'All remembered devices have been signed out.' : 'You have been signed out.'}});
        } catch (e) {
            if (all) setError('Unable to sign out remembered devices. Check your connection and try again.');
            else navigate('/admin/login', {replace: true, state: {message: 'Signed out of this browser. The server could not revoke this device token; sign in and use Sign out all remembered devices to revoke it.'}});
        } finally {setBusy(false);}
    };
    return <div className="adminPage"><aside className="adminSidebar">
        <div className="adminBrand"><span>MH</span><div><strong>Ming House</strong><small>Restaurant admin</small></div></div>
        <nav aria-label="Admin navigation">{[['', 'Overview'], ['/orders', 'Orders'], ['/menu', 'Menu'], ['/analytics', 'Analytics']].map(([path, label]) => <NavLink key={label} end={!path} to={`/admin${path}`}>{label}</NavLink>)}</nav>
        <div className="adminSidebarActions"><Link to="/">View website ↗</Link><button disabled={busy} onClick={() => logout()}>Log out</button><button disabled={busy} onClick={() => setConfirmAll(true)}>Sign out all remembered devices</button></div>
        {error && <p className="adminLogoutError" role="alert">{error}</p>}
    </aside><main className="adminContent"><AdminOrderAlarm/><AdminOrderingControl/><Outlet/></main>
        <Modal show={confirmAll} onHide={() => !busy && setConfirmAll(false)} centered contentClassName="adminDialog" aria-labelledby="revoke-devices-title" backdrop={busy ? 'static' : true} keyboard={!busy}>
            <Modal.Header closeButton={!busy}><Modal.Title id="revoke-devices-title">Sign out remembered devices?</Modal.Title></Modal.Header>
            <Modal.Body>You will also be signed out here. Every remembered device will need the admin password to sign in again.{error && <p role="alert">{error}</p>}</Modal.Body>
            <Modal.Footer><button disabled={busy} onClick={() => setConfirmAll(false)}>Cancel</button><button disabled={busy} onClick={() => logout(true)}>{busy ? 'Signing out…' : 'Sign out all devices'}</button></Modal.Footer>
        </Modal>
    </div>;
}
