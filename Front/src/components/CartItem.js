import Card from "react-bootstrap/Card";
import {Button, Col, InputGroup, Row} from "react-bootstrap";
import MenuPopup from "./MenuPopup";
import "../styles/CartItem.css"
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import API from "../api";
import {useEffect, useState} from "react";


const CartItem = (props) => {

    const minus = (item) => {

        // console.log("Minus")
        let current = item;

        console.log(current)

        if (current.quantity === 1){
            API.cartAPI.delete(current.orderName, current.orderPrice, current.quantity, current.item, current.cartId, current.specialInstruction)
                .then(r => props.updateCart())
                .catch((error) => console.log(error.message))
        }
        else{
            API.cartAPI.delete(current.orderName, current.orderPrice, current.quantity, current.item, current.cartId, current.specialInstruction)
                .then(r => {
                    props.updateCart();
                })
                .catch((error) => console.log(error.message))
        }
    }

    const plus = (item) => {
        let current = item;


        API.cartAPI.create(
            current.orderName, current.item.price, 1, current.item, current.cartId, current.specialInstruction)
            .then(r => props.updateCart())
            .catch((error) => console.log(error.message))

        // console.log(current)



    }

    const update = () => {
        // console.log("Cart Item Update")
        props.updateCart();
        // console.log(props)

    }


    const [menu, setMenu] = useState([])



    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);


    // console.log(props)


    return <div className={"cartCard"}>
        <Row>
            <Col xs={2}><Image src={"/images/" + props.item.number + ".png"} className={"menuImg"}
                               style={{height: "75%",
                                   margin: "auto"}}
                               rounded />
            </Col>

            <Col xs={10}>
                <Row>
                    <Col xs={9} style={{textAlign: "left"}}>
                        <h5>{props.item.number}. {props.name} <span style={{fontSize: "15px"}}>{props.item.size}</span> </h5>
                    </Col>

                    <Col xs={1}></Col>
                    <Col>
                        <h5>{API.priceAPI.price(props.price)}</h5>

                    </Col>
                </Row>

                {props.order.specialInstruction !== "" &&
                    <Row style={{textAlign: "left", margin: "0"}}>
                    <p>{props.order.specialInstruction}</p>
                </Row>}


                <Row>
                    <Col xs={2}>
                        <Button className={"mingButton"} variant="secondary" onClick={handleShow}>Edit/Modify</Button>
                    </Col>
                    <Col xs={7}></Col>
                    <Col xs={1}></Col>
                    <Col xs={2}>

                        <div style={{display:"flex", alignItems: "center", width: "100%", textAlign: "center", verticalAlign: "center", margin: "auto"}}>
                            <Button type="button" className={"btn btn-circle mingButtonOutline"} style={{width: "40%", height: "auto", textAlign:"center"}} variant="outline-primary" onClick={() => minus(props.order)} >
                                -
                            </Button>
                            <h5 style={{width: "20%", margin: "0"}}>{props.order.quantity}</h5>
                            <Button type="button" className={"btn btn-circle mingButtonOutline"} variant="outline-primary" style={{width: "40%", height: "auto", textAlign:"center"}} onClick={() => plus(props.order)}>
                                +
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Col>

            {/*<Col xs={8} style={{textAlign: "left"}}>*/}
            {/*    <Row>*/}
            {/*        <h5>{props.item.number}. {props.name} <span style={{fontSize: "15px"}}>{props.item.size}</span> </h5>*/}
            {/*    </Row>*/}
            {/*    <Row>*/}
            {/*        <p>{props.item.specialInstruction}</p>*/}
            {/*    </Row>*/}
            {/*</Col>*/}

            {/*<Col >*/}
            {/*    /!*style={{justifyContent: "end"}}*!/*/}
            {/*    <Row className="float-right" style={{marginLeft: "auto", width: "100%"}}>*/}
            {/*        <div style={{display:"flex", alignItems: "center"}}>*/}


            {/*            /!*<InputGroup className="order-last order-sm-first">*!/*/}

            {/*                <Button type="button" className={"btn rounded-circle"} style={{width: "15%", height: "auto", textAlign:"center"}} variant="outline-primary" onClick={() => minus(props.order)} >*/}
            {/*                    -*/}
            {/*                </Button>*/}
            {/*                <h5 style={{width: "15%"}}>{props.order.quantity}</h5>*/}
            {/*                /!*<Form.Control type={"number"} value={props.order.quantity} />*!/*/}
            {/*                <Button type="button" className={"btn rounded-circle"} variant="outline-primary" style={{width: "15%"}} onClick={() => plus(props.order)}>*/}
            {/*                    +*/}
            {/*                </Button>*/}

            {/*            /!*</InputGroup>*!/*/}
            {/*        </div>*/}

            {/*    </Row>*/}

            {/*    <Row><h5>{API.priceAPI.price(props.price)}</h5></Row>*/}
            {/*</Col>*/}



            {/*<Col><Button style={{width: "15%"}} variant="secondary" onClick={handleShow} >*/}
            {/*    Edit*/}
            {/*</Button></Col>*/}
        </Row>


        <MenuPopup show={showPopup} onClose={handleClose} id={props.id} name={props.name} item={props.full} quantity={props.order.quantity} do={"Edit"} update={update} price={props.price} size={(props.item.size)} instructions={props.order.specialInstruction}/>

    </div>

}



export default CartItem;
