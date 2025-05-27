import API from "../api";
import {Button} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import PrevOrder from "../components/PrevOrder";


const OrdersPage = (props) => {

    const [orders, setOrders] = useState([])



    useEffect(() => {
        const test = () => {
            API.orderAPI.getOrderByUser(window.sessionStorage.getItem("username"))
                .then(r => {
                    setOrders(r.data.reverse())
                    console.log(r.data)
                })
                .catch(error => console.log(error))
        }

        test()
    }, []);

    return <div className="App teko">
        <main>
            <h1 className={"dancing-script fontDark"} style={{marginBottom: "2%"}}>Your Orders</h1>
            {/*<Button onClick={() => {console.log(orders)}}>Testing</Button>*/}
            <div style={{alignItems: "center", alignContent: "center", alignSelf: "center"}}>
                {orders.map((item, index) => {
                    return <PrevOrder order={item} />
                })}
            </div>

        </main>
    </div>

}

export default OrdersPage;

