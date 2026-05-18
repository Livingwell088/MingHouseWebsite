import "../styles/Admin.css";
import API from "../api";
import { useEffect, useState } from "react";
import React from 'react';



export default function AdminOrders() {

    const [orders, setOrders] = useState([]);
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
                        <td>${API.priceAPI.price(order.orderPrice * 1.07)}</td>
                        <td>
                            <span className="statusBadge">New</span>
                        </td>
                    </tr>

                        {openOrder === order.orderName && (
                            <tr>
                                <td colSpan="7">
                                    <div className="orderDetailsBox">
                                        <h3>Order Details</h3>

                                        {order.orderType === "Delivery" && (
                                            <p><strong>Address:</strong> {order.address}</p>
                                        )}

                                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                        <p><strong>Instructions:</strong> {order.specialInstruction || "None"}</p>

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

