import {createContext, useContext, useCallback, useEffect, useRef, useState} from 'react';
import API from '../api';
import {newestFirst} from './AdminPresentation';
const AdminOrdersContext = createContext(null);
function useAdminOrdersData(enabled = true, interval = 30000) {
    const [orders, setOrders] = useState([]), [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(''), [mailError, setMailError] = useState('');
    const [loading, setLoading] = useState(true), [updated, setUpdated] = useState(null), [newIds, setNewIds] = useState([]);
    const seen = useRef(null), mounted = useRef(false), pending = useRef(false), mailPending = useRef(false), mailChecked = useRef(0);
    const refresh = useCallback(async (options = {}) => {
        if (pending.current) return;
        pending.current = true;
        // Email failures must never delay the incoming-order feed.
        if (!mailPending.current && (options.forceMail === true || Date.now() - mailChecked.current >= 30000)) {
            mailPending.current = true; mailChecked.current = Date.now();
            API.adminAPI.notifications().then(({data}) => {if (mounted.current) {setNotifications(data); setMailError('');}})
                .catch(() => {if (mounted.current) setMailError('Email delivery status is unavailable. This does not mean the order failed.');})
                .finally(() => {mailPending.current = false;});
        }
        try {
            const result = await API.orderAPI.get();
            if (mounted.current) {
                const data = newestFirst(result.data);
                if (seen.current) {const incoming = data.filter(o => !seen.current.has(o.id)).map(o => o.id); setNewIds(ids => [...new Set([...ids, ...incoming])]);}
                seen.current = new Set(data.map(o => o.id)); setOrders(data); setUpdated(new Date()); setError('');
            }
        } catch (e) {if (mounted.current) setError('Orders could not be refreshed. The last loaded orders are still shown. Try refreshing again.');}
        finally {if (mounted.current) setLoading(false); pending.current = false;}
    }, []);
    useEffect(() => {
        if (!enabled) return;
        mounted.current = true; refresh(); const timer = setInterval(refresh, interval);
        window.addEventListener('focus', refresh);
        const visible = () => {if (document.visibilityState === 'visible') refresh();};
        document.addEventListener('visibilitychange', visible);
        return () => {mounted.current = false; clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', visible);};
    }, [refresh, enabled, interval]);
    return {orders, notifications, error, mailError, loading, updated, newIds, refresh, dismissNew: () => setNewIds([])};
}
export function AdminOrdersProvider({children}) {
    const data = useAdminOrdersData(true, 5000);
    return <AdminOrdersContext.Provider value={data}>{children}</AdminOrdersContext.Provider>;
}
export default function useAdminOrders() {
    const shared = useContext(AdminOrdersContext);
    const local = useAdminOrdersData(!shared);
    return shared || local;
}
