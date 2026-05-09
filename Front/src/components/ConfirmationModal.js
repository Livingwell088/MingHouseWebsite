import {Button, Col, FloatingLabel, Image, Modal, Row} from "react-bootstrap";
import ErrorAlert from "./ErrorAlert";
import Form from "react-bootstrap/Form";
import API from "../api";
import CartItem from "./CartItem";
import * as React from "react";
import {useState} from "react";
import "../styles/Confirmation.css"


const ConfirmationModal = (props) => {

    const [totalQuantity, setTotalQuantity] = useState(0)
    if (!props.order) return null;
    let test = 0;

    const totalItems = (props.order.items ?? []).reduce(
        (sum, item) => sum + item.quantity,
        0
    );

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

            <Modal.Header closeButton className="justify-content-center">
                <Image src={"/images/LogoOneLine.png"} width='100vm'/>
            </Modal.Header>


            {/*<Modal.Body style={{textAlign: "center"}}>*/}


            {/*</Modal.Body>*/}


      {/*      <Modal.Body style={{textAlign: "center"}}>*/}
      {/*          <h3>Order Confirmation</h3>*/}
      {/*          Thank You For Your Order*/}

      {/*          <div style={{border: "1px solid", textAlign: "left", padding: "0 3% 0 3%"}}>*/}
      {/*              <h4>Summary</h4>*/}

      {/*              <div className="confirmationItems">*/}
      {/*                  {(props.order.items ?? []).map((item, index) => (*/}
      {/*                      <div key={index} className="confirmationItem">*/}

      {/*                          <div className="itemTop">*/}
      {/*                              <span className="itemName">*/}
      {/*                                {item.item.name} {item.item.size}*/}
      {/*                              </span>*/}

      {/*                                                          <span className="itemPrice">*/}
      {/*                                ${API.priceAPI.price(item.orderPrice)}*/}
      {/*                              </span>*/}
      {/*                          </div>*/}

      {/*                          <div className="itemBottom">*/}
      {/*                              <span>x{item.quantity}</span>*/}

      {/*                              {item.specialInstruction && (*/}
      {/*                                  <span className="itemNote">{item.specialInstruction}</span>*/}
      {/*                              )}*/}
      {/*                          </div>*/}

      {/*                      </div>*/}
      {/*                  ))}*/}
      {/*              </div>*/}





      {/*          </div>*/}

      {/*      </Modal.Body>*/}

      {/*      <div className="orderMeta">*/}
      {/*          <p><strong>Order #:</strong> {props.order.orderName}</p>*/}
      {/*          <p><strong>Type:</strong> {props.order.orderType}</p>*/}
      {/*          <p><strong>Time:</strong> {props.order.orderTime}</p>*/}
      {/*      </div>*/}

      {/*      <div className="cartSummary">*/}
      {/*          <div className="cartRow">*/}
      {/*              <span>Subtotal ({test} items)</span>*/}
      {/*              <span>${props.order.orderPrice}</span>*/}
      {/*          </div>*/}

      {/*          {props.order.orderType === "Delivery" && (*/}
      {/*              <div className="cartRow">*/}
      {/*                  <span>Delivery Fee</span>*/}
      {/*                  <span>$2.00</span>*/}
      {/*              </div>*/}
      {/*          )}*/}

      {/*          <div className="cartRow">*/}
      {/*              <span>Tax</span>*/}
      {/*              <span>*/}
      {/*${props.order.orderType === "Pickup"*/}
      {/*                  ? API.priceAPI.price(props.order.orderPrice * 0.07)*/}
      {/*                  : API.priceAPI.price((props.order.orderPrice + 2) * 0.07)}*/}
      {/*              </span>*/}
      {/*                          </div>*/}

      {/*                          <div className="cartRow totalRow">*/}
      {/*                              <span>Total</span>*/}
      {/*                              <span>*/}
      {/*                ${props.order.orderType === "Pickup"*/}
      {/*                                  ? API.priceAPI.price(props.order.orderPrice * 1.07)*/}
      {/*                                  : API.priceAPI.price((props.order.orderPrice + 2) * 1.07)}*/}
      {/*              </span>*/}
      {/*          </div>*/}
      {/*      </div>*/}

      {/*      <Button*/}
      {/*          onClick={props.onClose}*/}
      {/*          className="confirmationBtn"*/}
      {/*      >*/}
      {/*          Back to Home*/}
      {/*      </Button>*/}

            <Modal.Body style={{textAlign: "center"}}>

                <h2>✅ Order Confirmed!</h2>
                <p>Thank you for your order</p>

                {/*<div className="orderMeta">*/}
                {/*    <p><strong>Order #:</strong> {props.order.orderName}</p>*/}
                {/*    <p><strong>Type:</strong> {props.order.orderType}</p>*/}
                {/*    <p><strong>Time:</strong> {props.order.orderTime}</p>*/}
                {/*</div>*/}

                <div className="orderInfoRow">
                    <div>
                        <span className="label">Order #</span>
                        <span>{props.order.orderName}</span>
                    </div>

                    <div>
                        <span className="label">Type</span>
                        <span>{props.order.orderType}</span>
                    </div>

                    <div>
                        <span className="label">Time</span>
                        <span>{props.order.orderTime}</span>
                    </div>
                </div>

                <div className="summaryBox">
                    <h3 className="sectionTitle">Order Summary</h3>

                    <div className="confirmationItems">
                        {(props.order.items ?? []).map((item, index) => (
                            <div key={index} className="confirmationItem">
                                <div className="itemTop">
                                    <span className="itemName">
                                      {item.item.name} {item.item.size}
                                    </span>
                                                            <span className="itemPrice">
                                      ${API.priceAPI.price(item.orderPrice)}
                                    </span>
                                </div>

                                <div className="itemBottom">
                                    <span>x{item.quantity}</span>
                                    {item.specialInstruction && (
                                        <span className="itemNote">{item.specialInstruction}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cartSummary">
                    <div className="cartRow">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>${props.order.orderPrice}</span>
                    </div>

                    {props.order.orderType === "Delivery" && (
                        <div className="cartRow">
                            <span>Delivery Fee</span>
                            <span>$2.00</span>
                        </div>
                    )}

                    <div className="cartRow">
                        <span>Tax</span>
                        <span>
        ${props.order.orderType === "Pickup"
                            ? API.priceAPI.price(props.order.orderPrice * 0.07)
                            : API.priceAPI.price((props.order.orderPrice + 2) * 0.07)}
      </span>
                    </div>

                    <div className="cartRow totalRow">
                        <span>Total</span>
                        <span>
        ${props.order.orderType === "Pickup"
                            ? API.priceAPI.price(props.order.orderPrice * 1.07)
                            : API.priceAPI.price((props.order.orderPrice + 2) * 1.07)}
      </span>
                    </div>
                </div>

                <Button onClick={props.onClose} className="confirmationBtn">
                    Back to Home
                </Button>

            </Modal.Body>
        </Modal>
    </>
}


export default ConfirmationModal;