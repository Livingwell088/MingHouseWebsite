import {Button, Col, FloatingLabel, Image, Modal, Row} from "react-bootstrap";
import ErrorAlert from "./ErrorAlert";
import Form from "react-bootstrap/Form";
import API from "../api";
import CartItem from "./CartItem";
import * as React from "react";
import {useState} from "react";

const ConfirmationModal = (props) => {

    const [totalQuantity, setTotalQuantity] = useState(0)
    let test = 0;
    // console.log(props.order)
    return <>
        <Modal
            show={props.show}
            onHide={props.onClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className={"popup teko"}
            onClick={e => e.stopPropagation()}
        >

            <Modal.Header closeButton={true} style={{display: "flex",
                justifyContent: "center",
                alignItems: "center",}} >
                <Image src={"/images/logo.png"} width='100vm'/>
            </Modal.Header>


            {/*<Modal.Body style={{textAlign: "center"}}>*/}


            {/*</Modal.Body>*/}


            <Modal.Body style={{textAlign: "center"}}>
                <h3>Order Confirmation</h3>
                Thank You For Your Order

                <div style={{border: "1px solid", textAlign: "left", padding: "0 3% 0 3%"}}>
                    <h4>Summary</h4>

                    <table style={{width: "80%"}}>
                        <tbody>
                        <tr>
                            <td><strong>Order Number:</strong> {props.order.phoneNumber}</td>
                            <td><strong>Order for {props.order.orderType}</strong></td>
                        </tr>

                        <tr>
                            <td><strong>Date of Order:</strong> {props.order.datePlaced}</td>
                            {props.order.orderType === "Delivery" && <td><strong>Address: </strong>{(props.order.address).split(",")[0]}</td>}
                        </tr>

                        <tr>
                            <td><strong>Time for {props.order.orderType}:</strong> {props.order.orderTime}</td>
                            {props.order.orderType === "Delivery" && <td>{(props.order.address).split(",", 2)}</td>}
                        </tr>

                        </tbody>
                    </table>





                </div>

            </Modal.Body>

            <Modal.Body>
                {/*, borderBottom: "2px solid", paddingBottom: "20%"*/}
                <table style={{width: "100%"}}>
                    <thead>
                    <tr>
                        <th style={{width: "70%"}}>Item</th>
                        <th style={{width: "10%", textAlign: "center"}}>Quantity</th>
                        <th className={"tablePrice"} style={{width: "20%"}}>Price</th>
                    </tr>

                    </thead>
                    <tbody>
                {(props.order.items ?? []).map((item, index) => {
                    test += item.quantity
                    // setTotalQuantity(totalQuantity + item.item.quantity)
                    {
                        if (item.specialInstruction !== ""){
                        return <>
                        <tr>
                            <td>{item.item.name} {item.item.size}</td>
                            <td style={{textAlign: "center"}}>{item.quantity}</td>
                            <td className={"tablePrice"}>${API.priceAPI.price(item.orderPrice)}</td>
                        </tr>
                            <tr>
                                <td></td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;{item.specialInstruction}</td>
                                <td></td>
                            </tr>
                        </>
                    }
                else{
                        return <tr>
                            <td><Image src={"/images/" + item.item.number + ".png"} style={{width: "10%"}} /> {item.item.name} {item.item.size}</td>
                            <td style={{textAlign: "center"}}>{item.quantity}</td>
                            <td className={"tablePrice"}>${API.priceAPI.price(item.orderPrice)}</td>

                        </tr>
                    }



                }
                    // <p>{item.orderName}</p>
                    // return <CartItem id={"confirm" + item.id} name={item.orderName} price={item.orderPrice} item={item.item} order={item} updateCart={props.updateCart} full={props.fullMenu[index]}></CartItem>
                })}
                    </tbody>

                </table>
            </Modal.Body>

            <Modal.Body>
                <table style={{width: "100%", textAlign: "right"}}>
                    <tbody>
                    <tr>
                        <td style={{width: "70%"}}>
                            Subtotal ({test} Items):
                        </td>
                        <td style={{width: "10%"}}>
                            ${props.order.orderPrice}
                        </td>
                    </tr>

                    {props.order.orderType === "Delivery" && <tr>
                        <td style={{width: "70%"}}>
                            Delivery Fee:
                        </td>
                        <td style={{width: "10%"}}>
                            $2.00
                        </td>
                    </tr>}

                    <tr>
                        <td style={{width: "70%"}}>
                            Tax:
                        </td>

                        {props.order.orderType === "Pickup" && <td style={{width: "10%"}}>${API.priceAPI.price(props.order.orderPrice * 0.07)}</td>}
                        {props.order.orderType === "Delivery" && <td style={{width: "10%"}}>${API.priceAPI.price((props.order.orderPrice + 2) * 0.07)}</td>}
                    </tr>

                    <tr style={{borderTop: "1px solid"}}>
                        <td style={{width: "70%"}}>
                            Order Total:
                        </td>

                        {props.order.orderType === "Pickup" && <td style={{width: "10%"}}>${API.priceAPI.price(props.order.orderPrice * 1.07)}</td>}
                        {props.order.orderType === "Delivery" && <td style={{width: "10%"}}>${API.priceAPI.price((props.order.orderPrice + 2) * 1.07)}</td>}
                    </tr>

                    </tbody>
                </table>
            </Modal.Body>
        </Modal>
    </>
}


export default ConfirmationModal;