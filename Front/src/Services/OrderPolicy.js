import {useEffect, useState} from 'react';

export const lunchMessage = 'Lunch specials are only available before 4:00 PM Eastern. Remove lunch specials or choose a time before 4:00 PM.';

export function lunchClosed(now = new Date(), requestedTime = 'ASAP') {
    const hour = Number(new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York', hour:'numeric', hourCycle:'h23'}).format(now));
    const match = /^(\d{1,2}):(\d{2}) ([AP]M)$/i.exec(requestedTime || '');
    const requestedHour = match ? Number(match[1]) % 12 + (match[3].toUpperCase() === 'PM' ? 12 : 0) : 0;
    return hour >= 16 || requestedHour >= 16;
}

export function checkoutPolicy(cart, subtotal, type, time, now = new Date()) {
    if (cart.some(line => line.item?.category?.trim().toLowerCase() === 'lunch special') && lunchClosed(now, time)) return lunchMessage;
    if (type === 'Delivery' && Math.round(Number(subtotal) * 100) < 1500)
        return 'Delivery requires a $15.00 item subtotal before tax and delivery fees. Add more items or choose pickup.';
    return '';
}

export function useRestaurantTime() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const update = () => setNow(new Date());
        const timer = setInterval(update, 1000);
        window.addEventListener('focus', update);
        return () => {clearInterval(timer); window.removeEventListener('focus', update);};
    }, []);
    return now;
}
