import {Col, Row} from "react-bootstrap";
import CartTotal from "../components/CartTotal";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import CheckoutLeft from "../components/CheckoutLeft";
import API from "../api";
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
    }, [cart, subtotal]);


    const [user, setUser] = useState({})
    const [fields, setFields] = useState({"phoneNumber": "", "address": "", "instruction": "", "zipcode": ""})
    const [validated, setValidated] = useState(false)

    const handleChangeUser = (event) => {
        const name = event.target.name;
        const value = event.target.value;

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
        if (form.checkValidity() === false || orderType === "Select One" || orderTime === "Time") {
            event.stopPropagation()
            setValidated(true)


            if (orderType === "Select One") {
                setErrorHeading("Error")
                setErrorContent("Select an Order Type")
                setShowError(true)
            } else if (orderTime === "Time") {
                setErrorHeading("Error")
                setErrorContent("Select a Time for the Order.")
                setShowError(true)
            } else {
                setErrorHeading("Error")
                setErrorContent("Make sure all required fields are provided")
                setShowError(true)
            }
        } else {
            setValidated(true)

            let currentAddress = ""

            if (orderType === "Delivery") {
                currentAddress = fields.address + ", Worcester MA, " + fields.zipcode;
            }
            // const placing = await API.orderAPI.create("Ordering", subtotal, orderType, window.sessionStorage.getItem("username"), currentAddress, fields.phoneNumber, fields.instruction, orderTime, cart)


            // let order = {
            //     orderName: "Ordering",
            //     orderPrice: subtotal,
            //     orderType: orderType,
            //     user: user,
            //     address: currentAddress,
            //     phoneNumber: fields.phoneNumber,
            //     specialInstruction: fields.specialInstruction,
            //     orderTime: orderTime,
            //     datePlaced: "Date Placed",
            //     timePlaced: "Time Placed",
            //     items: cart
            // }
            // setPlacedOrder(order)
            // setShowPopup(true)

            // navigate("/")

            await API.orderAPI.create("Ordering", subtotal, orderType, window.sessionStorage.getItem("username"), currentAddress, fields.phoneNumber, fields.instruction, orderTime, cart)
                .then(res => res.data)
                .then(async r => {
                    setPlacedOrder(r)
                    setShowPopup(true)

                    navigate("/", {state: {placedOrder: r, confirm: true}})
                })
                // .then(() => {
                //     console.log(placedOrder)
                //     setShowPopup(true)
                // })
                .catch((error) => console.log(error))
        }


        // API.orderAPI.create("Test Order", API.priceAPI.price(subtotal * 1.07), orderType, fields.address, window.sessionStorage.getItem("username"), cart)
        //     .then(r => console.log(r.data))
        //     .catch((error) => console.log(error))
    }



    return <div className={"App teko"}>
        <main>
            <h1 className={"dancing-script fontDark"} style={{marginBottom: "2%"}}>Checkout</h1>

            {showError && <ErrorAlert heading={errorHeading} content={errorContent} onClose={() => setShowError(false)} />}

            <Row>
                <Col xs={1}></Col>
                <Col xs={7}>
                    <CheckoutLeft orderType={orderType} user={user} handleChangeUser={handleChangeUser} fields={fields} handleChangeFields={handleChangeField} cart={cart} validated={validated} submitButton={makeOrder} />
                </Col>
                <Col xs={4}>
                    <CartTotal id={"cartTotal"} page={"Place Order"} onChange={(type) => onChangeOrderType(type)} orderType={orderType} orderTime={orderTime} handleChangeTime={(time) => onChangeOrderTime(time)} subtotal={subtotal} makeOrder={() => makeOrder} ></CartTotal>
                </Col>
            </Row>

        </main>

    </div>

}


export default CheckoutPage;
