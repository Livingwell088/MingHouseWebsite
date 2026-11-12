import "../styles/Admin.css";
import API from "../api";
import React, {useEffect, useState} from "react";
import {orderDateKey, restaurantDateKey} from '../orderDates';

export default function AdminDashboard() {


    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [activeOrder, setActiveOrder] = useState(0);
    const [error, setError] = useState('');



    const loadOrders = async () => {

        try {
            const res = await API.orderAPI.get();

            const latestOrders = [...res.data].sort((a, b) => {
                const dateA = new Date(`${a.datePlaced} ${a.timePlaced}`);
                const dateB = new Date(`${b.datePlaced} ${b.timePlaced}`);
                return dateB - dateA;
            }).filter((item) => {
                // console.log(item.datePlaced);
                return orderDateKey(item.datePlaced) === restaurantDateKey();
            });

            let currentRevenue = 0;
            let currentActiveOrder = 0;


            latestOrders.map((item) => {
                currentRevenue += item.orderPrice;

                if ((item.orderStatus !== "Completed" ) && (item.orderStatus !== "Cancelled")) {
                    currentActiveOrder += 1;
                }
            })




            setOrders(latestOrders);
            setRevenue(currentRevenue);
            setActiveOrder(currentActiveOrder);
            setError('');
        } catch (error) {
            setError('Unable to refresh orders. Please try again.');
        }
    }


    useEffect(() => {
        loadOrders();
        const timer = setInterval(loadOrders, 30000);
        return () => clearInterval(timer);
    }, []);


    return (
        <div>

            <div className="adminPageHeader">
                <h1>Dashboard</h1>
            </div>

            <h4>{restaurantDateKey()}</h4>
            <button onClick={loadOrders}>Refresh dashboard</button>
            <p>Refreshes every 30 seconds. Dates use restaurant time.</p>
            {error && <p role="alert">{error}</p>}

            <div className="dashboardStatsGrid">

                <div className="dashboardCard">
                    <h3>Today's Orders</h3>
                    <p>{orders.length}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Revenue</h3>
                    <p>${API.priceAPI.price(revenue)}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Active Orders</h3>
                    <p>{activeOrder}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Avg Order</h3>
                    ${
                    API.priceAPI.price(
                        orders.length > 0 ? revenue / orders.length : 0
                    )
                }
                </div>

            </div>

            <div className="dashboardQuickActions">

                <button>Orders</button>
                <button>Menu</button>
                <button>Analytics</button>
                <button>Store Settings</button>

            </div>

        </div>
    );
}
