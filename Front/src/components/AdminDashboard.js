import {Link} from 'react-router-dom';
import useAdminOrders from '../Services/useAdminOrders';
import {activeOrder, customerName, money, orderTotal, salesSummary} from '../Services/AdminPresentation';
import {restaurantDateKey} from '../orderDates';
export default function AdminDashboard() {
    const {orders, notifications, error, mailError, loading, updated, refresh} = useAdminOrders();
    const summary = salesSummary(orders), outstanding = orders.filter(activeOrder);
    const mailIssues = notifications.filter(n => ['Failed', 'Retrying'].includes(n.status));
    return <div>
        <div className="adminPageHeader"><div><p className="adminEyebrow">{restaurantDateKey()} · Restaurant time</p><h1>Today at Ming House</h1><p>Your orders and menu, in one place.</p></div><button onClick={refresh} disabled={loading}>Refresh dashboard</button></div>
        {error && <p className="adminNotice error" role="alert">{error}</p>}{mailError && <p className="adminNotice" role="status">{mailError}</p>}
        <p className="adminSync" role="status">{loading ? 'Loading dashboard…' : `Last updated ${updated?.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}) || '—'} · Refreshes every 5 seconds while open`}</p>
        <div className="dashboardStatsGrid">{[['Orders today', summary.count, 'Includes cancelled orders'], ['Sales today', money(summary.revenue), 'Before tax · Excludes cancelled'], ['Active orders', summary.active, 'Across all dates'], ['Average order', money(summary.average), 'Before tax · Excludes cancelled']].map(([label, value, detail]) => <div className="dashboardCard" key={label}><h2>{label}</h2><strong>{loading ? '—' : value}</strong><small>{detail}</small></div>)}</div>
        <div className="dashboardQuickActions"><Link to="/admin/orders">Manage orders →</Link><Link to="/admin/menu">Update prices & availability →</Link><Link to="/admin/analytics">View sales reports →</Link></div>
        {mailIssues.length > 0 && <div className="adminNotice" role="status">{mailIssues.length} email{mailIssues.length !== 1 ? 's need' : ' needs'} attention. <Link to="/admin/orders">Review delivery status</Link></div>}
        <section className="adminPanel"><div className="adminSectionHeading"><h2>Orders to work on</h2><Link to="/admin/orders">See all orders →</Link></div>
            {!loading && !outstanding.length && <div className="adminEmpty"><strong>You’re all caught up</strong><p>New orders will appear here automatically.</p></div>}
            {outstanding.slice(0, 6).map(o => <Link className="adminRecentOrder" key={o.id} to={`/admin/orders?order=${encodeURIComponent(o.id)}`}><div><strong>{o.orderName}</strong><small>{customerName(o)} · {o.orderType} · {o.orderTime || 'ASAP'}</small></div><span className={`statusBadge status${o.orderStatus}`}>{o.orderStatus || 'New'}</span><strong>{money(orderTotal(o))}</strong></Link>)}
        </section>
    </div>;
}
