import {Col, Row} from "react-bootstrap";
import CartTotal from "../components/CartTotal";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import CheckoutLeft from "../components/CheckoutLeft";
import API from "../api";
import "../styles/Checkout.css"
import ErrorAlert from "../components/ErrorAlert";
import ConfirmationModal from "../components/ConfirmationModal";
import LoginModal from "../components/LoginModal";



const CheckoutPage = (props) => {

    const location = useLocation();
    const navigate = useNavigate();


    // console.log(location.state.orderType)

    const [orderType, setOrderType] = useState(window.sessionStorage.getItem('orderType'));
    const [subtotal, setSubtotal] = useState(0)
    const [orderTime, setOrderTime] = useState(window.sessionStorage.getItem('orderTime'));
    const [cart, setCart] = useState([])

    // console.log(cart)


    const [placedOrder, setPlacedOrder] = useState({})

    const testing = async () => {
        let currentData = window.sessionStorage.getItem("sessionId")

        if (window.sessionStorage.getItem("loggedIn") === "true"){
            currentData = window.sessionStorage.getItem("username")
        }
        await API.cartAPI.get(currentData)
            .then((data) => data.data)
            .then(async (data) => {

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
                // setFullMenu(full);
                setSubtotal(price)

            })
            .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        testing()
    }, []); //cart, subtotal


    const [user, setUser] = useState({})
    const [fields, setFields] = useState({"phoneNumber": "", "address": "", "instruction": "", "zipcode": ""})
    const [validated, setValidated] = useState(false)

    const handleChangeUser = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        console.log("changing:", name, value);

        setUser(values => ({...values, [name]: value}))

    }

    const handleChangeField = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFields(values => ({...values, [name]: value}))
    }

    const getUser = async () => {
        let username = (window.sessionStorage.getItem("username"))

        await API.userAPI.getUser(username)
            .then(r => r.data)
            .then(r => setUser(r))
            .catch((error) => console.log(error))
    }

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

    useEffect(() => {
        getUser()

        // console.log(test)

    }, []);

    // useEffect(() => {
    //     console.log(placedOrder)
    // }, [placedOrder])

    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);



    const makeOrder = async (event) => {
        console.log("Making Order")


        event.preventDefault()
        const form = event.currentTarget;

        if (
            !user.firstName ||
            !user.lastName ||
            !fields.phoneNumber ||
            orderType === "Select One" ||
            orderTime === "Time" ||
            (orderType === "Delivery" && (!fields.address || !fields.zipcode))
        ) {
            setErrorHeading("Error");
            setErrorContent("Make sure all required fields are provided.");
            setShowError(true);
            return;
        } else {
            setValidated(true)


            let currentAddress = ""

            if (orderType === "Delivery") {
                currentAddress = fields.address + ", Worcester MA, " + fields.zipcode;
            }


            const current = window.sessionStorage.getItem("sessionId");

            try {
                await API.userAPI.create(current, "", user.firstName, user.lastName, (user.email || ""), true);

                window.sessionStorage.setItem("loggedIn", "true");
                window.sessionStorage.setItem("username", current);

                const res = await API.orderAPI.create(
                    "Ordering",
                    subtotal,
                    orderType,
                    current,
                    currentAddress,
                    fields.phoneNumber,
                    fields.instruction,
                    orderTime,
                    cart
                );

                const placed = res.data;
                setPlacedOrder(placed);
                setShowPopup(true);


            } catch (error) {
                console.log(error.message);
            }
        }
    }


        // API.orderAPI.create("Test Order", API.priceAPI.price(subtotal * 1.07), orderType, fields.address, window.sessionStorage.getItem("username"), cart)
        //     .then(r => console.log(r.data))
        //     .catch((error) => console.log(error))




    return <div className={"App teko"}>

        <main className="checkout-page">
            <CheckoutLeft
                orderType={orderType}
                orderTime={orderTime}
                user={user}
                fields={fields}
                validated={validated}
                onChangeOrderType={onChangeOrderType}
                handleChangeTime={onChangeOrderTime}
                handleChangeUser={handleChangeUser}
                handleChangeFields={handleChangeField}
                submitButton={makeOrder}
            />

            <aside className="checkoutSummary">
                <div className="summaryCard">
                    <div className="summaryHeader">
                        <h2>Your Order</h2>
                        <button onClick={() => navigate("/menuPage")}>Edit Cart</button>
                    </div>

                    <div className="summaryItems">
                        {cart.map((item, index) => (
                            <div key={index} className="summaryItem">
                                <div className="summaryItemRow">
                                    <span>{item.quantity}x {item.item.name}</span>
                                    <span>${Number(item.orderPrice).toFixed(2)}</span>
                                </div>

                                {item.item.size && (
                                    <div className="summaryItemSub">
                                        ({item.item.size})
                                    </div>
                                )}

                                {item.specialInstruction && (
                                    <div className="summaryItemSub">
                                        {item.specialInstruction}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="summaryTotals">
                        <div>
                            <span>Subtotal</span>
                            <span>${API.priceAPI.price(subtotal)}</span>
                        </div>
                        <div>
                            <span>Tax</span>
                            <span>${API.priceAPI.price(subtotal * 0.07)}</span>
                        </div>

                        {orderType == "Delivery" && <div>
                            <span>Delivery Fee</span>
                            <span>$2.00</span>
                        </div>
                        }

                        <div className="summaryTotal">
                            <span>Total</span>
                            {orderType == "Delivery" ? <span>${API.priceAPI.price((subtotal + 2) * 1.07)}</span> : <span>${API.priceAPI.price(subtotal * 1.07)}</span>}
                        </div>
                        </div>

                    <button className="placeOrderBtn" onClick={makeOrder}>Place Order</button>
                </div>
            </aside>
        </main>

        {showPopup && (
            <ConfirmationModal
                show={showPopup}
                onClose={() => {
                    setShowPopup(false);
                    navigate("/");
                }}
                order={placedOrder}
            />
        )}


        {/*<main>*/}
        {/*    <h1 className={"dancing-script fontDark"} style={{marginBottom: "2%"}}>Checkout</h1>*/}

        {/*    {showError && <ErrorAlert heading={errorHeading} content={errorContent} onClose={() => setShowError(false)} />}*/}

        {/*    <Row>*/}
        {/*        <Col xs={1}></Col>*/}
        {/*        <Col xs={7}>*/}
        {/*            <CheckoutLeft orderType={orderType} user={user} handleChangeUser={handleChangeUser} fields={fields} handleChangeFields={handleChangeField} cart={cart} validated={validated} submitButton={makeOrder} />*/}
        {/*        </Col>*/}
        {/*        <Col xs={4}>*/}
        {/*            <CartTotal id={"cartTotal"} page={"Place Order"} onChange={(type) => onChangeOrderType(type)} orderType={orderType} orderTime={orderTime} handleChangeTime={(time) => onChangeOrderTime(time)} subtotal={subtotal} makeOrder={() => makeOrder} ></CartTotal>*/}
        {/*        </Col>*/}
        {/*    </Row>*/}

        {/*</main>*/}

    </div>


}


export default CheckoutPage;
