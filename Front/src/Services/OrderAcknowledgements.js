export const ACK_KEY = 'minghouse.acknowledgedOrders';
export function readAcknowledgements() {
    try {const data = JSON.parse(localStorage.getItem(ACK_KEY) || '[]'); return new Set(Array.isArray(data) ? data.map(String) : []);}
    catch (e) {return new Set();}
}
export function acknowledgeOrders(previous, orders) {
    const next = new Set([...readAcknowledgements(), ...previous, ...orders.map(order => String(order.id))]);
    localStorage.setItem(ACK_KEY, JSON.stringify([...next].slice(-5000)));
    return next;
}
export function waitingOrders(orders, acknowledged) {
    return orders.filter(order => order.orderStatus === 'New' && !acknowledged.has(String(order.id)));
}
