import {useCallback, useEffect, useRef, useState} from 'react';
import API from '../api';

export const PAUSED_MESSAGE = 'Online ordering is temporarily paused. Please call (508) 756-6888 to place an order.';
export default function useOrderingStatus() {
    const [status, setStatus] = useState({enabled: false, loading: true, message: 'Checking online ordering availability…'});
    const active = useRef(false);
    const revision = useRef(0);
    const refresh = useCallback(async () => {
        const current = ++revision.current;
        try {
            const {data} = await API.storeAPI.ordering();
            if (active.current && current === revision.current) setStatus({enabled: data.enabled === true, loading: false, message: data.enabled === true ? '' : PAUSED_MESSAGE});
        } catch (error) {
            if (active.current && current === revision.current) setStatus({enabled: false, loading: false, message: 'Online ordering availability could not be checked. Please try again or call (508) 756-6888.'});
        }
    }, []);
    useEffect(() => {
        active.current = true; refresh();
        const timer = setInterval(refresh, 30000);
        window.addEventListener('focus', refresh);
        return () => {active.current = false; clearInterval(timer); window.removeEventListener('focus', refresh);};
    }, [refresh]);
    return {...status, refresh, markPaused: () => {revision.current++; setStatus({enabled: false, loading: false, message: PAUSED_MESSAGE});}};
}
