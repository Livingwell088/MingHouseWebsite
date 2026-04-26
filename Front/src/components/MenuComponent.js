
import * as React from 'react';
import APIService from '../test'
import MenuServiceFetch from "../Services/MenuServiceFetch";
import {Grid} from "@mui/material";
import {Col, Row} from "react-bootstrap";
import '../styles/fonts.css';
import "../styles/menuComponent.css"
import MenuCard from "./MenuCard";
import {useEffect, useState} from "react";
import API from "../api";
import {type} from "@testing-library/user-event/dist/type";
import {useNavigate} from "react-router-dom";
import CartItem from "./CartItem";




const MenuComponent = (props) => {

    const [categories, setCategories] = useState(props.categories);
    const [types, setTypes] = useState(props.types)

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

    const test = (type) => {

        if (type === "All"){
            setCategories(props.categories)
        }
        else{
            setCategories([type])
        }

    }

    useEffect(() => {
        const date = new Date();
        const currentTime = date.getHours()
            + ':' + date.getMinutes()

        const noLunch = (cat) => {
            return !cat.includes("Lunch Special")
        }

        if (API.timeAPI.compare(currentTime, "14:59") > 0){

            const test = categories.filter(noLunch)
            setCategories(test)
            setTypes(types.filter(noLunch))
        }
    }, [categories, types]);


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



    // console.log(props.menu)

    return (
        // <div>
        //     <Row id={"menuRow"}>
        //         <Col xs={1}></Col>
        //         <Col xs={2}>
        //             <ul key={"p"} id={"foodTypes"} >
        //                 {
        //                     types.map(current =>
        //                         <li key={current} id={current} onClick={() => test(current)}>{current}</li>
        //                     // <li onClick={() => this.t(current)}>{current}</li>
        //                     )
        //                 }
        //             </ul>
        //         </Col>
        //         <Col xs={9}>
        //             {
        //                 categories.map(current =>
        //                     <Row>
        //                         <h3 className={"headers trade-winds-regular"} style={{color: "rgb(238, 121, 89)"}}>{current}</h3>
        //                         {
        //
        //                             Object.keys(props.menu).map((item, i) => {
        //
        //                                 if (current === props.menu[item][0].category) {
        //                                     // console.log(props.menu[item])
        //                                     // console.log(Object.keys(props.menu[item]).length)
        //                                     if (Object.keys(props.menu[item]).length === 1) {
        //                                         let current = props.menu[item][0]
        //                                         return <Col className={"col-6"}><MenuCard id={current.id}
        //                                                                                   number={current.number}
        //                                                                                   name={current.name}
        //                                                                                   size={[current.size]}
        //                                                                                   price={[current.price]}
        //                                                                                   menu={[current]}/></Col>
        //
        //                                     } else {
        //
        //                                         let names = []
        //
        //                                         for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
        //                                             if (!names.includes(props.menu[item][n].name)) {
        //                                                 names.push(props.menu[item][n].name)
        //                                             }
        //                                         }
        //                                         // console.log(names)
        //
        //                                         if (names.length === 1) {
        //                                             let sizes = []
        //                                             let prices = []
        //                                             let items = []
        //                                             for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
        //                                                 let current = props.menu[item][n]
        //                                                 sizes.push(current.size)
        //                                                 prices.push(current.price)
        //                                                 items.push(current)
        //                                             }
        //
        //                                             return <Col className={"col-6"}><MenuCard id={items[0].id}
        //                                                                                       number={items[0].number}
        //                                                                                       name={items[0].name}
        //                                                                                       size={sizes}
        //                                                                                       price={prices}
        //                                                                                       menu={items}/></Col>
        //
        //                                         } else {
        //
        //                                             let components = []
        //
        //                                             for (let x = 0; x < names.length; x++){
        //                                                 let sizes = []
        //                                                 let prices = []
        //                                                 let items = []
        //                                                 for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
        //                                                     let current = props.menu[item][n]
        //                                                     if (current.name === names[x]) {
        //                                                         sizes.push(current.size)
        //                                                         prices.push(current.price)
        //                                                         items.push(current)
        //                                                     }
        //
        //                                                 }
        //
        //                                                 components.push(<Col className={"col-6"}><MenuCard id={items[0].id}
        //                                                                      number={items[0].number}
        //                                                                      name={names[x]}
        //                                                                      size={sizes}
        //                                                                      price={prices}
        //                                                                     menu={items}/></Col>)
        //
        //                                             }
        //
        //                                             return components;
        //
        //                                             // console.log(names)
        //                                             // return <Col className={"col-6"}>{
        //                                             //     names.map((test, x) => {
        //                                             //
        //                                             //         let sizes = []
        //                                             //         let prices = []
        //                                             //         let items = []
        //                                             //         for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
        //                                             //             let current = props.menu[item][n]
        //                                             //             if (current.name === test) {
        //                                             //                 sizes.push(current.size)
        //                                             //                 prices.push(current.price)
        //                                             //                 items.push(current)
        //                                             //             }
        //                                             //
        //                                             //         }
        //                                             //
        //                                             //         return <MenuCard id={items[0].id}
        //                                             //                                                   number={items[0].number}
        //                                             //                                                   name={test}
        //                                             //                                                   size={sizes}
        //                                             //                                                   price={prices}
        //                                             //                                                   menu={items}/>
        //
        //                                             //
        //                                             //     })
        //                                             // }</Col>
        //
        //
        //
        //
        //                                         }
        //                                     }
        //                                 }
        //
        //                             })
        //                         }
        //                     </Row>
        //                 )
        //             }
        //
        //         </Col>
        //     </Row>
        //
        // </div>



        <main className="menu-layout ">

            <aside className="menu-sidebar">
                {types.map(current =>(
                    <button className={`menu-category teko ${((categories == current) || (current === "All" && categories.length > 1)) ? "active" : ""}`} id={current} onClick={() => test(current)}>{current}</button>
                ))}

            </aside>

            <section className="menu-content">


                {categories.map(category =>(
                    <section className="menu-section">
                        <div className="section-header">
                            <h2>{category}</h2>
                            <div className="line"></div>
                        </div>

                        <div className="menu-grid grid-3">
                            {Object.keys(props.menu).map((item, i) => {

                                if (category === props.menu[item][0].category){

                                    if (Object.keys(props.menu[item]).length === 1) {
                                        let current = props.menu[item][0]

                                        return <MenuCard id={current.id}
                                              number={current.number}
                                              name={current.name}
                                              size={[current.size]}
                                              price={[current.price]}
                                              menu={[current]}/>
                                    }

                                    else {

                                        let names = []

                                        for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
                                            if (!names.includes(props.menu[item][n].name)) {
                                                names.push(props.menu[item][n].name)
                                            }
                                        }
                                        // console.log(names)

                                        if (names.length === 1) {
                                            let sizes = []
                                            let prices = []
                                            let items = []
                                            for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
                                                let current = props.menu[item][n]
                                                sizes.push(current.size)
                                                prices.push(current.price)
                                                items.push(current)
                                            }

                                            return <MenuCard id={items[0].id}
                                                             number={items[0].number}
                                                             name={items[0].name}
                                                             size={sizes}
                                                             price={prices}
                                                             menu={items}/>
                                            // <Col className={"col-6"}></Col>

                                        } else {

                                            let components = []

                                            for (let x = 0; x < names.length; x++) {
                                                let sizes = []
                                                let prices = []
                                                let items = []
                                                for (let n = 0; n < Object.keys(props.menu[item]).length; n++) {
                                                    let current = props.menu[item][n]
                                                    if (current.name === names[x]) {
                                                        sizes.push(current.size)
                                                        prices.push(current.price)
                                                        items.push(current)
                                                    }

                                                }

                                                components.push(<MenuCard id={items[0].id}
                                                                          number={items[0].number}
                                                                          name={names[x]}
                                                                          size={sizes}
                                                                          price={prices}
                                                                          menu={items}/>)
                                            // <Col className={"col-6"}></Col>
                                            }

                                            return components;
                                        }}


                                }

                            })}
                        </div>
                    </section>
                ))}
            </section>

            <aside className="menu-cart">
                <div className="cartHeader">
                    <h2>Your Cart</h2>
                    <span className="cartCount">1</span>
                </div>


                <div className="cartItems">
                    {cart.length === 0 ? (
                        <div className="emptyCart">
                            <h5> Your cart is empty </h5>
                            <p>Add an item from the menu to get started.</p>

                        </div>
                    ) : (
                        cart.length > 0 && cart.map((item, index) => {
                                return <div className="cartItem">
                                    <div className="cartItemTop">
                                        <h5 className="cartItemName">{item.item.number + ". " + item.item.name}</h5>
                                        <span className="cartItemPrice">${API.priceAPI.price(item.orderPrice)}</span>
                                    </div>

                                    <div className="cartItemRow">
                                        <div className="cartItemModifier">
                                            {/*{(item.item.size > 1) && item.item.size}*/}
                                            {item.item.size}
                                        </div>

                                        <div className="cartItemQuantity">
                                            <button className="qtyBtn" onClick={() => minus(item)}>-</button>
                                            <span className="qtyValue">{item.quantity}</span>
                                            <button className="qtyBtn" onClick={() => plus(item)}>+</button>
                                        </div>
                                    </div>


                                </div>
                            })
                    )
                    }



                </div>



                <div className="cartSummary">
                    <div className="cartRow">
                        <span>Subtotal</span>
                        <span>${API.priceAPI.price(subtotal)}</span>
                    </div>

                    <div className="cartRow">
                        <span>Tax</span>
                        <span>${API.priceAPI.price(subtotal * 0.07)}</span>
                    </div>

                    <div className="cartRow totalRow">
                        <span>Total</span>
                        <span>${API.priceAPI.price(subtotal * 1.07)}</span>
                    </div>
                </div>

                <button className="cartCheckoutBtn" disabled={cart.length === 0}>Checkout</button>
            </aside>


        </main>
    )


}

export default MenuComponent;