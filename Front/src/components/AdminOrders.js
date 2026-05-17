import "../styles/Admin.css";
import API from "../api";
import { useEffect, useState } from "react";



export default function AdminOrders() {

    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {

        try {
            const res = await API.orderAPI.get();
            setOrders(res.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            <p>View incoming and past customer orders.</p>




        <div className="adminTableCard">
            <table className="adminTable">
                <thead>
                <tr>
                    <th>Order #</th>
                    <th>Type</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time Placed</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>

                </tr>
                </thead>

                <tbody>
                {orders.map((order) => (
                    <tr key={order.id || order.orderName}>
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
                        <td>${API.priceAPI.price(order.orderPrice * 1.07)}</td>
                        <td>
                            <span className="statusBadge">New</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

