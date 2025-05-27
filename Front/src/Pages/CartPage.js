import React, {useEffect, useState} from "react";
import API from "../api";
import CartItem from "../components/CartItem";
import MenuPopup from "../components/MenuPopup";
import CartTotal from "../components/CartTotal";
import {Button, Col, Row} from "react-bootstrap";
import '../styles/fonts.css';
import LoginModal from "../components/LoginModal";
import "../styles/cartPage.css"
import CartLeft from "../components/CartLeft";
import {Navigate, redirect, useHref, useNavigate} from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import {Error} from "@mui/icons-material";


const CartPage = (props) => {
    const [cart, setCart] = useState([]);
    const [fullMenu, setFullMenu] = useState([[]])
    const [subtotal, setSubtotal] = useState(0.0)

    const [orderType, setOrderType] = useState(window.sessionStorage.getItem('orderType'));
    const [orderTime, setOrderTime] = useState(window.sessionStorage.getItem('orderTime'));


    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);

    const navigate = useNavigate();


    const [showError, setShowError] = useState(false)
    const [errorHeading, setErrorHeading] = useState("")
    const [errorContent, setErrorContent] = useState("")



    const onChangeOrderType = (type) => {
        window.sessionStorage.setItem("orderType", type);
        setOrderType(type);
    }

    const onChangeOrderTime = (time) => {
        window.sessionStorage.setItem("orderTime", time);
        setOrderTime(time);
    }


    const testing = async () => {
        let currentData = window.sessionStorage.getItem("sessionId")

        if (window.sessionStorage.getItem("loggedIn") === "true"){
            currentData = window.sessionStorage.getItem("username")
        }
        await API.cartAPI.get(currentData)
            .then((data) => data.data)
            .then(async (data) => {
                // console.log(data)

                let full = []
                let price = 0.0
                for (let i = 0; i < data.length; i++) {
                    const number = data[i].item.number;

                    price += await data[i].orderPrice;


                    await API.menuAPI.getByNumber(number)
                        .then((res) => res.data)
                        .then((res) => full.push(res))
                        .catch((error) => console.log(error.message))

                }

                setCart(data);
                setFullMenu(full);
                setSubtotal(price)

            })
            .catch((error) => console.log(error.message))
    }

    const updateCart = async () => {
        console.log("Updating Cart")
        setCart([]);
        // setTimeout(() => {
        //     API.orderAPI.get()
        //         .then((res) => setCart(res.data))
        //         .catch((error) => console.log(error.message))
        // })

        await testing()
    }

    const checkIfLogged = () => {

        if (sessionStorage.getItem("loggedIn") === "false"){

            console.log("NOT LOGGED IN")

            if (orderType !== "Select One"){
                handleShow()

            }
            else{
                setErrorHeading("Error")
                setErrorContent("Please select an order type: Pickup or Delivery")
                setShowError(true)

                // alert("Select an Order Type")
                // return <ErrorAlert />
            }
        }
        else {

            if (cart.length === 0){
                setErrorHeading("Error")
                setErrorContent("Cart is Empty. Cannot Move to Checkout with An Empty Cart.")
                setShowError(true)
            }
            else{
                navigate('/checkoutPage', {state: {orderType: orderType, subtotal: subtotal, orderTime: orderTime, cart: cart}});

            }

        }
    }

    const makeOrder = async () => {

        // console.log("Make Order");

        checkIfLogged()


    }




    useEffect( () => {

        testing()

    }, [cart, subtotal, fullMenu])

    useEffect(() => {
        if (window.sessionStorage.getItem("orderType") === null){
            window.sessionStorage.setItem("orderType", "Select One")
        }
    }, []);

    useEffect(() => {
        if (window.sessionStorage.getItem("orderTime") === null){
            window.sessionStorage.setItem("orderTime", "Time")
        }
    })



    return <div className="App teko">
        <main>
            {showError && <ErrorAlert heading={errorHeading} content={errorContent} onClose={() => setShowError(false)} />}
            <h1 className={"dancing-script fontDark"} style={{marginBottom: "2%"}}>Your Cart</h1>
            <Row>
                <Col xs={1}></Col>
                <Col xs={7}>
                    <CartLeft cart={cart} fullMenu={fullMenu} updateCart={() => updateCart}></CartLeft>
                </Col>

                <Col xs={4}>
                    <CartTotal id={"cartTotal"} page={"Go To Checkout"} orderType={orderType} onChange={(type) => onChangeOrderType(type)} orderTime={orderTime} handleChangeTime={(time) => onChangeOrderTime(time)} subtotal={subtotal} makeOrder={() => makeOrder}  ></CartTotal>
                    <LoginModal show={showPopup} onClose={handleClose} loginScreen={true}></LoginModal>

                </Col>
            </Row>
        </main>

        {/*{page === "Checkout" && <main>*/}
        {/*    <h1>CHECKOUT</h1>*/}
        {/*    <Row>*/}
        {/*        <Col xs={8}>*/}
        {/*            /!*<CartLeft cart={cart} fullMenu={fullMenu} updateCart={() => updateCart}></CartLeft>*!/*/}
        {/*        </Col>*/}

        {/*        <Col xs={4}>*/}
        {/*            <CartTotal id={"cartTotal"} orderType={orderType} onChange={(type) => setOrderType(type)} subtotal={subtotal} makeOrder={() => makeOrder}  ></CartTotal>*/}
        {/*            <LoginModal show={showPopup} onClose={handleClose} loginScreen={true}></LoginModal>*/}

        {/*        </Col>*/}
        {/*    </Row>*/}
        {/*</main>}*/}

    </div>






}

export default CartPage;
