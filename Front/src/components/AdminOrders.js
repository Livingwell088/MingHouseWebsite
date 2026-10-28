import "../styles/Admin.css";
import API from "../api";
import { useEffect, useState } from "react";
import React from 'react';



export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const loadNotifications = async () => { try { const res=await API.adminAPI.notifications(); setNotifications(res.data); } catch(e) { setError('Unable to refresh email delivery status.'); } };
    const retry = async id => { try { await API.adminAPI.retryNotification(id); await loadNotifications(); } catch(e) { setError('Unable to retry this email. Refresh and try again.'); } };
    const [openOrder, setOpenOrder] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    const loadOrders = async () => {

        try {
            const res = await API.orderAPI.get();

            const latestOrders = [...res.data].sort((a, b) => {
                const dateA = new Date(`${a.datePlaced} ${a.timePlaced}`);
                const dateB = new Date(`${b.datePlaced} ${b.timePlaced}`);
                return dateB - dateA;
            });

            setOrders(latestOrders);
        } catch (error) {
            setError('Unable to refresh orders. Please try again.');
        }
    }


    useEffect(() => {
        loadOrders(); loadNotifications();
        const timer=setInterval(() => {loadOrders(); loadNotifications();},30000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            <p>View incoming and past customer orders. Refreshes every 30 seconds.</p>
            {error && <p role="alert">{error}</p>}
            <button onClick={() => {setError('');loadOrders();loadNotifications();}}>Refresh orders</button>
            <div aria-label="Email delivery">
                {notifications.filter(n => n.status !== 'Sent').map(n => <p key={n.id}>
                    Order {orders.find(o => o.id === n.orderId)?.orderName || n.orderId}: {n.audience} email — {n.status} (attempts: {n.attempts}). {n.error}
                    {(n.status === 'Failed' || n.status === 'Retrying') && <button onClick={() => retry(n.id)}>Retry email</button>}
                </p>)}
            </div>




        <div className="adminTableCard">
            <table className="adminTable">
                <thead>
                <tr>
                    <th>Order #</th>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Date </th>
                    <th>Time Placed </th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>

                </tr>
                </thead>

                <tbody>
                {orders.map((order) => (
                    <React.Fragment key={order.id || order.orderName}>
                    <tr className={"adminOrderRow"}
                    onClick={() => setOpenOrder(openOrder === order.orderName ? null : order.orderName)}>
                        <td>{order.orderName}</td>
                        <td>{order.orderType}</td>
                        <td>{order.orderTime}</td>
                        <td>
                            {order.user
                                ? `${order.user.firstName || ""} ${order.user.lastName || ""}`
                                : "Guest"}
                        </td>

                        <td>{order.datePlaced}</td>
                        <td>{order.timePlaced}</td>
                        <td>{order.items?.length || 0}</td>
                        <td>${API.priceAPI.price(order.total ?? (order.orderPrice + (order.orderType === "Delivery" ? 2 : 0)) * 1.07)}</td>
                        <td>
                            <span className="statusBadge">{order.orderStatus}</span>
                        </td>
                    </tr>

                        {openOrder === order.orderName && (
                            <tr>
                                <td colSpan="9">
                                    <div className="orderDetailsBox">
                                        <h3>Order Details</h3>

                                        {order.orderType === "Delivery" && (
                                            <p><strong>Address:</strong> {order.address}</p>
                                        )}

                                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                        <p><strong>Instructions:</strong> {order.specialInstructions || "None"}</p>

                                        <div className="orderItemsList">
                                            {order.items?.map((item) => (
                                                <div key={item.id} className="orderDetailItem">
                  <span>
                    {item.quantity}x {item.item.name} {item.item.size}
                  </span>
                                                    <span>${API.priceAPI.price(item.orderPrice)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

