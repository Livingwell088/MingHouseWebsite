import { Outlet } from "react-router-dom";
import Appbar from "./components/Appbar";
import Footer from "./components/Footer";
import MingBot from "./components/MingBot";

import { useEffect, useState, useCallback } from 'react';
import { ensureCustomerSession } from './api';

const MainLayout = () => {
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const start = useCallback(() => { setError(false); ensureCustomerSession().then(() => setReady(true)).catch(() => setError(true)); }, []);
    useEffect(() => { start(); }, [start]);
    return (
        <>
            <Appbar />
            {ready ? <Outlet /> : <main style={{padding:'3rem', textAlign:'center'}} role="status">
                {error ? <>Unable to connect. <button onClick={start}>Try again</button></> : 'Connecting to Ming House…'}
            </main>}
            <Footer />
            <MingBot />
        </>
    );
};

export default MainLayout;
