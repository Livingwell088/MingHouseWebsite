import {useCallback, useEffect, useRef, useState} from 'react';
import API from '../api';

export default function AdminOrderingControl() {
    const [enabled, setEnabled] = useState(null), [busy, setBusy] = useState(false);
    const [error, setError] = useState(''), [message, setMessage] = useState('');
    const mounted = useRef(false), saving = useRef(false);
    const revision = useRef(0);
    const load = useCallback(async () => {
        if (saving.current) return;
        const current = ++revision.current;
        try {const {data} = await API.adminAPI.ordering(); if (mounted.current && current === revision.current && !saving.current) {setEnabled(data.enabled === true); setError('');}}
        catch (e) {if (mounted.current && current === revision.current && !saving.current) setError('Could not check ordering status. Refresh before changing it.');}
    }, []);
    useEffect(() => {
        mounted.current = true; load(); const timer = setInterval(load, 30000);
        window.addEventListener('focus', load);
        return () => {mounted.current = false; clearInterval(timer); window.removeEventListener('focus', load);};
    }, [load]);
    const toggle = async () => {
        if (saving.current || enabled === null) return;
        revision.current++;
        saving.current = true; setBusy(true); setError(''); setMessage('');
        try {
            const {data} = await API.adminAPI.setOrdering(!enabled);
            if (mounted.current) {setEnabled(data.enabled === true); setMessage(data.enabled ? 'Online ordering is on.' : 'Online ordering is paused. Customers can still view the menu.');}
        } catch (e) {
            if (mounted.current) {setEnabled(null); setError('The change could not be confirmed. Refresh status to check whether it saved.');}
        } finally {saving.current = false; if (mounted.current) setBusy(false);}
    };
    return <section className={`adminOrderingControl ${enabled === false ? 'isPaused' : ''}`} aria-label="Online ordering controls">
        <div><strong>Online ordering {enabled === null ? '· Checking status' : enabled ? '· On' : '· Paused'}</strong><p>{enabled === false ? 'Pickup and delivery orders are paused until you turn ordering back on.' : 'Pause website orders when the kitchen is busy. The menu stays available.'}</p>{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}</div>
        <div className="adminOrderingActions"><button role="switch" aria-label="Online ordering" aria-checked={enabled === true} disabled={busy || enabled === null || !!error} onClick={toggle}>{busy ? 'Saving…' : enabled === false ? 'Turn ordering on' : 'Pause online ordering'}</button><button disabled={busy} onClick={load}>Refresh status</button></div>
    </section>;
}
