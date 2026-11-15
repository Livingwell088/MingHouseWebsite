import {orderDateKey, restaurantDateKey} from '../orderDates';
export const statuses = ['New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
export const money = value => Number.isFinite(Number(value || 0)) ? Number(value || 0).toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Invalid price';
export const customerName = order => [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || 'Guest';
export const activeOrder = order => !['Completed', 'Cancelled'].includes(order.orderStatus);
export const orderTotal = order => Number(order.total ?? ((Number(order.orderPrice) + (order.orderType === 'Delivery' ? 2 : 0)) * 1.07));
export const newestFirst = orders => [...orders].sort((a, b) => {
    const key = o => `${orderDateKey(o.datePlaced)} ${String(o.timePlaced || '').split(':').map(n => n.padStart(2, '0')).join(':')}`;
    return key(b).localeCompare(key(a)) || String(b.id).localeCompare(String(a.id), undefined, {numeric: true});
});
export function salesSummary(orders, day = restaurantDateKey()) {
    const today = orders.filter(o => orderDateKey(o.datePlaced) === day);
    const sales = today.filter(o => o.orderStatus !== 'Cancelled');
    const revenue = sales.reduce((sum, o) => sum + Number(o.orderPrice || 0), 0);
    return {count: today.length, revenue, average: sales.length ? revenue / sales.length : 0, active: orders.filter(activeOrder).length};
}
export function adjustedPrice(price, type, value) {
    if (String(value).trim() === '' || !Number.isFinite(Number(value))) return null;
    const next = type === 'set' ? Number(value) : type === 'percent' ? Number(price) * (1 + Number(value) / 100) : Number(price) + Number(value);
    return Number.isFinite(next) && next >= 0 && next <= 10000 ? Math.round((next + Number.EPSILON) * 100) / 100 : null;
}
