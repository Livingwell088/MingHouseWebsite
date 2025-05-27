import Appbar from "./components/Appbar"
import MenuComponent from "./components/MenuComponent";
import {Component} from "react";
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
// import {Route, Router} from "@mui/icons-material";
import { BrowserRouter as Router, Routes, Route, link } from "react-router-dom";


import Home from "./Pages/Home"
import Menu from "./Pages/MenuPage";
import Order from "./Pages/CartPage"
import CheckoutPage from "./Pages/CheckoutPage";
import ContactPage from "./Pages/ContactPage";
import OrdersPage from "./Pages/OrdersPage";

class App extends Component {

    render() {
        return (
            <Router>
                <Appbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menupage" element={<Menu />} />
                    <Route path="/cartPage" element={<Order />} />
                    <Route path="/checkoutPage" element={<CheckoutPage />} />
                    <Route path="/contactPage" element={<ContactPage />} />
                    <Route path="/ordersPage" element={<OrdersPage /> } />
                </Routes>
            </Router>

        )
    }

}

export default App;