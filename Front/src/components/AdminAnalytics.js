import {useState} from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts';
import useAdminOrders from '../Services/useAdminOrders';
import {money} from '../Services/AdminPresentation';
import {orderDateKey, restaurantDateKey} from '../orderDates';

export function buildAnalytics(orders, start, end) {
    const included = orders.filter(o => {const day = orderDateKey(o.datePlaced); return day && day >= start && day <= end && o.orderStatus !== 'Cancelled';});
    const revenue = included.reduce((sum, o) => sum + Number(o.orderPrice || 0), 0);
    const counts = new Map(), hours = Array.from({length: 24}, (_, hour) => ({hour: `${hour % 12 || 12}${hour < 12 ? 'a' : 'p'}`, orders: 0}));
    included.forEach(o => {
        const hour = Number(String(o.timePlaced || '').split(':')[0]);
        if (o.timePlaced && Number.isInteger(hour) && hour >= 0 && hour < 24) hours[hour].orders++;
        (o.items || []).forEach(line => {
            const name = `${line.item?.number ? `${line.item.number}. ` : ''}${line.item?.name || line.orderName || 'Unknown item'}${line.item?.size ? ` · ${line.item.size}` : ''}`;
            const row = counts.get(name) || {name, quantity: 0, revenue: 0};
            row.quantity += Number(line.quantity || 0);
            // orderPrice is already the entire line total, including quantity.
            row.revenue += Number(line.orderPrice || 0); counts.set(name, row);
        });
    });
    return {orders: included, revenue, hours, top: [...counts.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue).slice(0, 5)};
}
export default function AdminAnalytics() {
    const today = restaurantDateKey();
    const [start, setStart] = useState(today), [end, setEnd] = useState(today), [range, setRange] = useState([today, today]);
    const {orders, error, loading, refresh} = useAdminOrders();
    const report = buildAnalytics(orders, ...range);
    return <div>
        <div className="adminPageHeader"><div><p className="adminEyebrow">Sales reports</p><h1>Analytics</h1><p>Restaurant dates · Sales before tax · Cancelled orders excluded</p></div><button onClick={refresh} disabled={loading}>Refresh report</button></div>
        {error && <p className="adminNotice error" role="alert">{error}</p>}
        <form className="adminFilters" onSubmit={e => {e.preventDefault(); if (start && end && start <= end) setRange([start, end]);}}><label>From<input required type="date" value={start} max={end || today} onChange={e => setStart(e.target.value)}/></label><label>Through<input required type="date" min={start} max={today} value={end} onChange={e => setEnd(e.target.value)}/></label><button>Apply dates</button></form>
        <p className="adminSync" role="status">{loading ? 'Loading sales…' : `Showing ${range[0]} through ${range[1]}`}</p>
        <div className="dashboardStatsGrid">{[['Sales', money(report.revenue)], ['Orders', report.orders.length], ['Average order', money(report.orders.length ? report.revenue / report.orders.length : 0)], ['Pickup / delivery', `${report.orders.filter(o => o.orderType === 'Pickup').length} / ${report.orders.filter(o => o.orderType === 'Delivery').length}`]].map(([label, value]) => <div className="dashboardCard" key={label}><h2>{label}</h2><strong>{loading ? '—' : value}</strong></div>)}</div>
        <section className="adminPanel"><h2>Orders by hour</h2><p>Actual orders placed during the selected dates.</p>{report.orders.length ? <div className="adminChart"><ResponsiveContainer width="100%" height={260}><LineChart data={report.hours} margin={{top: 12, right: 12, left: -20, bottom: 0}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="hour" minTickGap={24}/><YAxis allowDecimals={false}/><Tooltip/><Line type="monotone" dataKey="orders" stroke="#8b3c20" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div> : <div className="adminEmpty"><strong>No orders in this date range</strong><p>Choose another range to see sales activity.</p></div>}</section>
        <section className="adminPanel"><h2>Top selling options</h2>{report.top.map((item, i) => <div className="adminRecentOrder" key={item.name}><span className="adminQuantity">{i + 1}</span><div><strong>{item.name}</strong><small>{item.quantity} sold</small></div><strong>{money(item.revenue)}</strong></div>)}{!report.top.length && <p>No items sold in this date range.</p>}</section>
    </div>;
}
