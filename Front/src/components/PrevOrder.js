import {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import API from "../api";
import * as React from "react";
import '../styles/orders.css';
import ConfirmationModal from "./ConfirmationModal";


const PrevOrder = (props) => {

    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => {
        setShowPopup(false);
    }

    let test = 0;

     // const currentOrder = useState(props.order)
    //
    // useEffect(() => {
    //     console.log(props.order)
    // }, []);

    return <div className={"prevOrders"} onClick={handleShow}>
        {
            props.order.items.map((item) => {
                test++
            })
        }

        <Row>
            <Col xs={3}>
                <h5 style={{textAlign: "left"}}>#{props.order.orderName} <span style={{fontSize: "15px"}}> ({props.order.orderType})</span></h5>
            </Col>
            <Col xs={7}></Col>
            <Col xs={2} style={{textAlign: "right"}}>{test} Items</Col>

        </Row>

        <Row>
            <Col xs={3}>
                {props.order.datePlaced} {props.order.timePlaced}
            </Col>
            <Col xs={7}>

            </Col>
            <Col xs={2} style={{textAlign: "right"}}>
                {props.order.orderType === "Pickup" && <p>Total: ${API.priceAPI.price(props.order.orderPrice * 1.07)}</p>}
                {props.order.orderType === "Delivery" && <p>Total: ${API.priceAPI.price((props.order.orderPrice + 2) * 1.07)}</p>}
                {/*Total: ${props.order.orderPrice}*/}
            </Col>
        </Row>

        <ConfirmationModal order={props.order} show={showPopup} onClose={handleClose} />

        {/*<p>Testing</p>*/}
    </div>



}

export default PrevOrder;