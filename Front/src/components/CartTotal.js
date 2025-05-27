import {useEffect, useState} from "react";
import API from "../api";
import "../styles/cartTotal.css"
import Card from "react-bootstrap/Card";
import OrderTypePopup from "./OrderTypePopup";
import {Button, Col, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import LoginModal from "./LoginModal";
import TimePickerDropdown from "./TimePickerDropdown";



const CartTotal = (props) => {

    // console.log(props.orderType)


    const [orderType, setOrderType] = useState(props.orderType)
    const [deliverAddress, setAddress] = useState(" Enter Your Address")
    const [selectedTime, setSelectedTime] = useState(props.orderTime)
    // const [orderTime, setOrderTime] = useState(" Time")

    // const handleSelectedTimeChange = (event) => {
    //     setSelectedTime(event.target.value)
    //     props.handleChangeTime()
    // }

    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);


    // useEffect(() => {
    //     const neededHours = API.timeAPI.get()
    //     setHours(neededHours)
    //         // .then(r => setHours(r))
    //         // .catch((error) => console.log(error))
    // }, []);

    useEffect(() => {
        setOrderType(props.orderType)
    }, [props.orderType]);

    useEffect(() => {
        setSelectedTime(props.orderTime)
    }, [props.orderTime]);

    return <div className={"cartTotal"}>



        <Card className={"totalCard"}>

            <div>
                Ming House:
                217A Chandler St, Worcester MA 01609
            </div>

            {/*<br />*/}

            <div>
                Order Type: &nbsp;
                <a className={"orderTypeLink"} onClick={handleShow}>
                    {orderType}
                </a>
            </div>


            <OrderTypePopup show={showPopup} onClose={handleClose} test={(type) => props.onChange(type)}></OrderTypePopup>

            <div style={{display: "flex", gridTemplateColumns: "auto auto", alignItems: "center"}}>
                {/*<Row>*/}
                {/*    <Col xs={3} style={{paddingRight: 0}}>*/}
                {/*        Order Time:*/}
                {/*    </Col>*/}
                {/*    <Col >*/}
                {/*        <TimePickerDropdown orderTime={selectedTime} handleChangeTime={(time) => props.handleChangeTime(time)} />*/}
                {/*    </Col>*/}
                {/*</Row>*/}

            {/*    .textData {*/}
            {/*    display:grid;*/}
            {/*    grid-template-columns:auto auto;*/}
            {/*}*/}
                Order Time:&nbsp;<TimePickerDropdown orderTime={selectedTime} handleChangeTime={(time) => props.handleChangeTime(time)} />
            </div>


        </Card>

        <br />

        <Card className={"totalCard"}>

            <table>
                <tbody>
                <tr>
                    <td>Subtotal: </td>
                    <td className={"tablePrice"}>${API.priceAPI.price(props.subtotal)}</td>
                </tr>
                {orderType === "Delivery" && <tr>
                    <td>Delivery Fee:</td>
                    <td className={"tablePrice"}>$2.00</td>
                </tr>}

                <tr>
                    <td>Tax: </td>
                    {orderType === "Pickup" && <td className={"tablePrice"}>${API.priceAPI.price(props.subtotal * 0.07)}</td>}
                    {orderType === "Delivery" && <td className={"tablePrice"}>${API.priceAPI.price((props.subtotal + 2) * 0.07)}</td>}

                </tr>
                <tr>
                    <td><h4>Total: </h4></td>
                    {/*<td className={"tablePrice"}><h4>${API.priceAPI.price(props.subtotal * 1.07)}</h4></td>*/}
                    {orderType === "Pickup" && <td className={"tablePrice"}>${API.priceAPI.price(props.subtotal * 1.07)}</td>}
                    {orderType === "Delivery" && <td className={"tablePrice"}>${API.priceAPI.price((props.subtotal + 2) * 1.07)}</td>}

                </tr>

                </tbody>
            </table>
        </Card>

        <br />

        {props.page === "Go To Checkout" && <Button className={"mingButton"} onClick={props.makeOrder()}>{props.page}</Button>}
        {props.page === "Place Order" && <Button className={"mingButton"} form='CheckoutForm' variant={"primary"} type="submit">{props.page}</Button>}



    </div>
}

export default CartTotal;
