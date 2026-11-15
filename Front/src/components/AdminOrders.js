import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import API from '../api';
import useAdminOrders from '../Services/useAdminOrders';
import {activeOrder, customerName, money, orderTotal, statuses} from '../Services/AdminPresentation';
export default function AdminOrders() {
    const {orders, notifications, error, mailError, loading, updated, newIds, dismissNew, refresh} = useAdminOrders();
    const [params] = useSearchParams();
    const [open, setOpen] = useState(params.get('order')), [filter, setFilter] = useState('All'), [search, setSearch] = useState('');
    const requestedOrder = params.get('order');
    useEffect(() => {if (requestedOrder) {setOpen(requestedOrder); setFilter('All'); setSearch('');}}, [requestedOrder]);
    const [busy, setBusy] = useState(false), [actionError, setActionError] = useState(''), [message, setMessage] = useState('');
    const run = async (action, success) => {
        setBusy(true); setActionError(''); setMessage('');
        try {await action(); setMessage(success); await refresh({forceMail: true});}
        catch (e) {setActionError('The change could not be saved. Refresh and try again.');}
        finally {setBusy(false);}
    };
    const visible = orders.filter(o => (filter === 'All' || (filter === 'Active' ? activeOrder(o) : o.orderStatus === filter)) && `${o.orderName} ${customerName(o)} ${o.phoneNumber || ''}`.toLowerCase().includes(search.toLowerCase().trim()));
    const failed = notifications.filter(n => ['Failed', 'Retrying'].includes(n.status));
    const emailRow = n => <div className="adminEmailRow" key={n.id}><span><strong>{n.audience} email</strong> · {n.status}<small>{n.attempts} attempt{n.attempts === 1 ? '' : 's'}{n.sentAt ? ` · Sent ${new Date(n.sentAt).toLocaleString()}` : ''}</small>{n.error && <small className="adminMailError">{n.error}</small>}</span>{['Failed', 'Retrying'].includes(n.status) && <button disabled={busy} onClick={() => run(() => API.adminAPI.retryNotification(n.id), 'Email queued for another delivery attempt.')}>Retry email</button>}</div>;
    return <div>
        <div className="adminPageHeader"><div><p className="adminEyebrow">Order desk</p><h1>Orders</h1><p>Customer details, kitchen notes, and email delivery.</p></div><button disabled={loading || busy} onClick={refresh}>Refresh orders</button></div>
        <p className="adminSync">{loading ? 'Loading orders…' : `Last updated ${updated?.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}) || '—'} · Checks every 5 seconds while open`}</p>
        {(error || actionError) && <p role="alert" className="adminNotice error">{error || actionError}</p>}{mailError && <p role="status" className="adminNotice">{mailError}</p>}{message && <p role="status" className="adminNotice success">{message}</p>}
        {newIds.length > 0 && <div role="status" className="adminNotice success"><strong>{newIds.length} new order{newIds.length === 1 ? '' : 's'} received.</strong><button onClick={() => {setFilter('All'); setSearch(''); setOpen(String(newIds[0])); dismissNew();}}>View new order</button><button onClick={dismissNew}>Dismiss</button></div>}
        {failed.length > 0 && <details className="adminPanel adminMailPanel"><summary>{failed.length} email{failed.length === 1 ? '' : 's'} needing attention</summary>{failed.map(n => <div key={n.id}><strong>{orders.find(o => o.id === n.orderId)?.orderName || `Order ${n.orderId}`}</strong>{emailRow(n)}</div>)}</details>}
        <div className="adminFilters"><label>Find an order<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Order #, customer, or phone"/></label><label>Show<select value={filter} onChange={e => setFilter(e.target.value)}>{['All', 'Active', ...statuses].map(s => <option key={s}>{s}</option>)}</select></label><span>{visible.length} order{visible.length === 1 ? '' : 's'}</span></div>
        <div className="adminOrderList">{visible.map(o => {
            const expanded = String(o.id) === String(open), emails = notifications.filter(n => n.orderId === o.id);
            return <article className="adminOrderCard" key={o.id}>
                <button className="adminOrderSummary" aria-expanded={expanded} aria-controls={`order-${o.id}`} onClick={() => setOpen(expanded ? null : String(o.id))}>
                    <div><strong>{o.orderName}</strong><small>{customerName(o)}</small></div><div><strong>{o.orderType} · {o.orderTime || 'ASAP'}</strong><small>Placed {o.datePlaced} at {o.timePlaced}</small></div><span className={`statusBadge status${o.orderStatus}`}>{o.orderStatus || 'New'}</span><div><strong>{money(orderTotal(o))}</strong><small>{(o.items || []).reduce((sum, i) => sum + Number(i.quantity || 0), 0)} items · {expanded ? 'Hide details −' : 'View details +'}</small></div>
                </button>
                {expanded && <div className="adminOrderDetails" id={`order-${o.id}`}>
                    <div className="adminOrderContact"><div><h2>Customer</h2><strong>{customerName(o)}</strong><p>{o.phoneNumber ? <a href={`tel:${o.phoneNumber}`}>{o.phoneNumber}</a> : 'No phone provided'}</p>{o.orderType === 'Delivery' && <p><strong>Deliver to:</strong> {o.address || 'No address provided'}</p>}</div><label>Order status<select aria-label={`Status for ${o.orderName}`} value={o.orderStatus || 'New'} disabled={busy} onChange={e => {const next = e.target.value; if (next !== 'Cancelled' || window.confirm(`Cancel order ${o.orderName}? This changes its status only.`)) run(() => API.orderAPI.updateStatus(o.id, next), `${o.orderName} updated to ${next}.`);}}>{statuses.map(s => <option key={s}>{s}</option>)}</select><small>Updates the dashboard. Does not send an email.</small></label></div>
                    {o.specialInstructions && <div className="adminKitchenNote"><strong>Order instructions</strong><p>{o.specialInstructions}</p></div>}
                    <h2>Items & instructions</h2><ul className="adminOrderItems">{(o.items || []).map((line, i) => <li key={line.id || i}><span className="adminQuantity">{line.quantity}×</span><div><strong>{line.item?.number ? `${line.item.number}. ` : ''}{line.item?.name || line.orderName}</strong>{line.item?.size && <small>{line.item.size}</small>}{line.specialInstruction && <p className="adminKitchenNote">{line.specialInstruction}</p>}</div><strong>{money(line.orderPrice)}</strong></li>)}</ul>
                    <div className="adminOrderTotal"><span>Total including tax{o.orderType === 'Delivery' ? ' & delivery' : ''}</span><strong>{money(orderTotal(o))}</strong></div>
                    <h2>Email delivery</h2>{emails.length ? emails.map(emailRow) : <p>{mailError ? 'Delivery status unavailable.' : 'No email delivery records for this order.'}</p>}
                </div>}
            </article>;
        })}</div>
        {!loading && !visible.length && <div className="adminPanel adminEmpty"><strong>{orders.length ? 'No matching orders' : 'No orders yet'}</strong><p>{orders.length ? 'Try another search or status.' : 'Orders will appear here when customers place them.'}</p></div>}
    </div>;
}
