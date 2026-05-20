import "../styles/Admin.css";
import {useEffect, useState} from "react";
import API from "../api";
import {isCompositeComponentWithType} from "react-dom/test-utils";



export default function AdminAnalytics() {

    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [orders, setOrders] = useState([]);

    const [orderItems, setOrderItems] = useState([]);

    const [revenue, setRevenue] = useState([]);
    const [pickUpOrders, setPickUpOrders] = useState([]);
    const [deliveryOrders, setDeliveryOrders] = useState([]);


    const loadOrders = async () => {

        try {
            const res = await API.orderAPI.get();

            const latestOrders = [...res.data].sort((a, b) => {
                const dateA = new Date(`${a.datePlaced} ${a.timePlaced}`);
                const dateB = new Date(`${b.datePlaced} ${b.timePlaced}`);
                return dateB - dateA;
            });

            const parseInputDateLocal = (dateString, endOfDay = false) => {
                const [year, month, day] = dateString.split("-").map(Number);

                return endOfDay
                    ? new Date(year, month - 1, day, 23, 59, 59, 999)
                    : new Date(year, month - 1, day, 0, 0, 0, 0);
            };

            const filteredOrders = latestOrders.filter(order => {
                const orderDate = new Date(order.datePlaced);
                orderDate.setHours(0, 0, 0, 0);

                const start = parseInputDateLocal(startDate);
                const end = parseInputDateLocal(endDate, true);

                return orderDate >= start && orderDate <= end;
            });

            let currentRevenue = 0;
            let items = []

            let itemCounts = {}


            filteredOrders.forEach((order) => {
                currentRevenue += parseFloat(order.orderPrice);
                items.push(... order.items);
            })

            items.forEach(item => {

                if (!itemCounts[item.item.name]) {
                    itemCounts[item.item.name] = {
                        quantity: 0,
                        revenue: 0
                    };
                }

                console.log(item)

                itemCounts[item.item.name].quantity += item.quantity;
                itemCounts[item.item.name].revenue +=
                    item.quantity * parseFloat(item.orderPrice);
            });

            const sortedItems = Object.entries(itemCounts)
                .sort((a, b) => {
                    // First sort by quantity
                    if (b[1].quantity !== a[1].quantity) {
                        return b[1].quantity - a[1].quantity;
                    }

                    // Then sort by revenue
                    return b[1].revenue - a[1].revenue;
                }).slice(0, 5);

            console.log(sortedItems);

            setOrders(filteredOrders);
            setRevenue(currentRevenue);
            setPickUpOrders(filteredOrders.filter(order => { return order.orderType === "Pickup"}));
            setDeliveryOrders(filteredOrders.filter(order => {return order.orderType === "Delivery"}));
            setOrderItems(sortedItems)
        } catch (error) {
            console.log(error.message);
        }
    }


    const loadAnalytics = async () => {
        console.log("Load analytics");
        loadOrders();
    }


    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div>
            <div className="adminPageHeader">
                <h1>Analytics</h1>
            </div>

            <div className="analyticsFilters">

                <input
                    type="date"
                    value={startDate}
                    max={endDate || today}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    max={today}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button onClick={loadAnalytics}>
                    Apply
                </button>

            </div>

            <div className="dashboardStatsGrid">
                <div className="dashboardCard">
                    <h3>Revenue</h3>
                    <p>${API.priceAPI.price(revenue)}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Orders</h3>
                    <p>{orders.length}</p>
                </div>

                <div className="dashboardCard">
                    <h3>Avg Order</h3>
                    <p>${
                    API.priceAPI.price(
                        orders.length > 0 ? revenue / orders.length : 0
                    )
                }
                    </p>
                </div>

                <div className="dashboardCard">
                    <h3>Pickup / Delivery</h3>
                    <p>{pickUpOrders.length} / {deliveryOrders.length}</p>
                </div>
            </div>

            <div className="dashboardChartCard">
                <h2>Orders by Hour</h2>
                <div className="analyticsPlaceholder">Chart goes here</div>
            </div>

            <div className="adminTableCard analyticsTable">
                <h2>Top Selling Items</h2>

                <table className="adminTable">
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty Sold</th>
                        <th>Revenue</th>
                    </tr>
                    </thead>

                    <tbody>

                    {orderItems.map(([name, data]) => {
                        return (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{data.quantity}</td>
                                <td>${API.priceAPI.price(data.revenue)}</td>
                            </tr>
                        )
                    })}

                    </tbody>
                </table>

            </div>
        </div>
    );
}