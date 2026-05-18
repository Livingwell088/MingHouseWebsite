import "../styles/Admin.css";
import API from "../api";
import React, {useEffect, useState} from "react";

export default function AdminDashboard() {


    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [activeOrder, setActiveOrder] = useState(0);
    const [averageOrder, setAverageOrder] = useState(0);



    const loadOrders = async () => {

        try {
            const res = await API.orderAPI.get();

            const latestOrders = [...res.data].sort((a, b) => {
                const dateA = new Date(`${a.datePlaced} ${a.timePlaced}`);
                const dateB = new Date(`${b.datePlaced} ${b.timePlaced}`);
                return dateB - dateA;
            }).filter((item) => {
                console.log(item.datePlaced);
                return item.datePlaced == API.timeAPI.getDate()
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
        } catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        loadOrders();
    }, []);


    return (
        <div>

            <div className="adminPageHeader">
                <h1>Dashboard</h1>
            </div>

            <h4>{API.timeAPI.getDate()}</h4>

            <div className="dashboardStatsGrid">

                <div className="dashboardCard">
                    <h3>Today's Orders</h3>
                    <p>{orders.length}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Revenue</h3>
                    <p>${revenue}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Active Orders</h3>
                    <p>{activeOrder}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Avg Order</h3>
                    <p>${revenue / orders.length}</p>
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