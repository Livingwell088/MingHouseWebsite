import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAdminOrders from '../Services/useAdminOrders';
import {createOrderAlarmAudio} from '../Services/OrderAlarmAudio';
import {ACK_KEY, acknowledgeOrders, readAcknowledgements, waitingOrders} from '../Services/OrderAcknowledgements';

export default function AdminOrderAlarm() {
    const {orders, updated, error, loading, refresh} = useAdminOrders();
    const navigate = useNavigate();
    const [enabled, setEnabled] = useState(false), [soundError, setSoundError] = useState('');
    const [acknowledged, setAcknowledged] = useState(readAcknowledgements), [volume, setVolume] = useState(80);
    const [now, setNow] = useState(Date.now()), [keepAwake, setKeepAwake] = useState(false), [awake, setAwake] = useState(false);
    const audio = useRef(null), volumeRef = useRef(volume), alive = useRef(false);
    if (!audio.current) audio.current = createOrderAlarmAudio();
    volumeRef.current = volume;
    const pending = waitingOrders(orders, acknowledged), pendingKey = pending.map(o => o.id).join(',');
    const stale = !loading && (!updated || now - updated.getTime() > 15000 || !!error);
    const play = () => {
        try {audio.current.play(volumeRef.current);}
        catch (e) {setEnabled(false); setSoundError(e.message || 'Sound could not play. Tap Enable sound again.');}
    };
    useEffect(() => {
        alive.current = true;
        const timer = setInterval(() => {
            setNow(Date.now());
            if (audio.current.state !== 'running') setEnabled(false);
        }, 1000);
        const storage = event => {if (event.key === ACK_KEY || event.key === null) setAcknowledged(readAcknowledgements());};
        window.addEventListener('storage', storage);
        return () => {alive.current = false; clearInterval(timer); window.removeEventListener('storage', storage); audio.current.dispose();};
    }, []);
    useEffect(() => {
        if (!enabled || !pendingKey) return;
        const burst = () => {
            try {audio.current.play(volumeRef.current);}
            catch (e) {setEnabled(false); setSoundError(e.message || 'Sound could not play. Tap Enable sound again.');}
        };
        burst(); const timer = setInterval(burst, 5000);
        return () => {clearInterval(timer); audio.current.stop();};
    }, [enabled, pendingKey]);
    useEffect(() => {
        if (!pending.length) return;
        const oldTitle = document.title;
        document.title = `(${pending.length}) NEW ORDER — Ming House`;
        return () => {document.title = oldTitle;};
    }, [pending.length]);
    useEffect(() => {
        let lock, active = true;
        if (!keepAwake) setAwake(false);
        const acquire = async () => {
            if (!keepAwake || document.visibilityState !== 'visible' || !navigator.wakeLock || lock) return;
            try {
                const result = await navigator.wakeLock.request('screen');
                if (!active) {await result.release(); return;}
                lock = result; setAwake(true);
                result.addEventListener('release', () => {lock = null; if (active) setAwake(false);});
            } catch (e) {if (active) setAwake(false);}
        };
        acquire(); document.addEventListener('visibilitychange', acquire);
        return () => {active = false; document.removeEventListener('visibilitychange', acquire); if (lock) lock.release().catch(() => {});};
    }, [keepAwake]);
    const enable = async () => {
        setSoundError('');
        try {await audio.current.enable(); if (alive.current) {setEnabled(true); if (!pending.length) play();}}
        catch (e) {if (alive.current) {setEnabled(false); setSoundError(e.message || 'Sound is blocked. Try enabling it again.');}}
    };
    const acknowledge = () => {
        setAcknowledged(new Set([...acknowledged, ...pending.map(order => String(order.id))]));
        audio.current.stop();
        try {setAcknowledged(acknowledgeOrders(acknowledged, pending)); setSoundError(''); audio.current.stop();}
        catch (e) {setSoundError('Acknowledged for this visit only. This browser could not save it for reloads.');}
    };
    return <section className={`adminOrderAlarm ${pending.length ? 'hasOrders' : ''}`} aria-label="New order sound alerts">
        <div className="adminAlarmHeading"><div><strong>{pending.length ? `${pending.length} new order${pending.length === 1 ? '' : 's'} waiting` : 'New order alerts'}</strong><p>{enabled ? 'Sound is on. The bell repeats every 5 seconds until acknowledged.' : 'Sound is off. Enable it on the device you use to receive orders.'}</p></div><span className={`adminConnection ${stale ? 'isOffline' : ''}`}>{loading ? 'Connecting…' : stale ? 'Connection problem' : 'Live · checks every 5 seconds'}</span></div>
        {pending.length > 0 && <div className="adminAlarmIncoming" role="alert"><strong>New order received: {pending.map(o => o.orderName).join(', ')}</strong><div><button onClick={() => navigate(`/admin/orders?order=${encodeURIComponent(pending[0].id)}`)}>View order</button><button onClick={acknowledge}>Acknowledge & stop sound</button></div><small>Acknowledges this browser only. Order status stays unchanged.</small></div>}
        <div className="adminAlarmControls">{!enabled ? <button onClick={enable}>Enable sound</button> : <><button onClick={play}>Test sound</button><button onClick={() => {setEnabled(false); audio.current.stop();}}>Mute sound</button></>}<label>Alert volume <input aria-label="Alert volume" type="range" min="20" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))}/><span>{volume}%</span></label></div>
        {soundError && <p role="alert" className="adminAlarmWarning">{soundError}</p>}
        {stale && <div className="adminAlarmWarning" role="alert">Order checks are delayed. New-order alerts may be delayed too. Last successful check: {updated ? updated.toLocaleTimeString() : 'none'}. <button onClick={refresh}>Reconnect now</button></div>}
        <label className="adminAwakeChoice"><input type="checkbox" checked={keepAwake} disabled={!navigator.wakeLock} onChange={e => setKeepAwake(e.target.checked)}/> Keep screen awake {keepAwake ? (awake ? '· Active' : '· Not active; keep device awake manually') : !navigator.wakeLock ? '· Not supported in this browser' : ''}</label>
        <p className="adminAlarmHelp">Keep this admin page open, your device awake, and its media volume up. Locked screens, muted devices, and suspended browsers can prevent alerts. Enable sound again after reloading or reopening the page.</p>
    </section>;
}
