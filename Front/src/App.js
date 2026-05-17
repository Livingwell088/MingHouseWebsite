import Appbar from "./components/Appbar"
import MenuComponent from "./components/MenuComponent";
import {Component} from "react";
import React, { useEffect, useState } from 'react';
import './styles/App.css';
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
// import {Route, Router} from "@mui/icons-material";
import {BrowserRouter as Router, Routes, Route, link, useLocation} from "react-router-dom";


import Home from "./Pages/Home"
import Menu from "./Pages/MenuPage";
import Order from "./Pages/CartPage"
import CheckoutPage from "./Pages/CheckoutPage";
import ContactPage from "./Pages/ContactPage";
import OrdersPage from "./Pages/OrdersPage";
import Footer from "./components/Footer";
import ConfirmationModal from "./components/ConfirmationModal";
import AdminLayout from "./Pages/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import AdminMenu from "./components/AdminMenu";
import AdminLogin from "./components/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import MainLayout from "./MainLayout";

class App extends Component {



    render() {
        // const location = useLocation();
        // const isAdmin = location.pathname.startsWith("/admin");

        return (
            <Router>
                {/*{!isAdmin && <Appbar />}*/}

                {/*<Routes>*/}
                {/*    <Route path="/" element={<Home />} />*/}
                {/*    <Route path="/menupage" element={<Menu />} />*/}
                {/*    <Route path="/cartPage" element={<Order />} />*/}
                {/*    <Route path="/checkoutPage" element={<CheckoutPage />} />*/}
                {/*    <Route path="/contactPage" element={<ContactPage />} />*/}
                {/*    <Route path="/ordersPage" element={<OrdersPage /> } />*/}
                {/*    <Route path="/order-confirmation" element={<ConfirmationModal />} />*/}


                {/*    <Route path="/admin/login" element={<AdminLogin />} />*/}

                {/*    <Route element={<AdminProtectedRoute />} >*/}
                {/*        <Route path="/admin" element={<AdminLayout />}>*/}
                {/*            <Route index element={<AdminDashboard />} />*/}
                {/*            <Route path="orders" element={<AdminOrders />} />*/}
                {/*            <Route path="menu" element={<AdminMenu />} />*/}
                {/*            /!*<Route path="analytics" element={<AdminAnalytics />} />*!/*/}
                {/*            /!*<Route path="pos" element={<AdminPOS />} />*!/*/}
                {/*        </Route>*/}
                {/*    </Route>*/}
                {/*</Routes>*/}

                {/*{!isAdmin && <Footer />}*/}


                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/menupage" element={<Menu />} />
                        <Route path="/cartPage" element={<Order />} />
                        <Route path="/checkoutPage" element={<CheckoutPage />} />
                        <Route path="/contactPage" element={<ContactPage />} />
                        <Route path="/ordersPage" element={<OrdersPage />} />
                    </Route>

                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route element={<AdminProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="menu" element={<AdminMenu />} />
                            {/*<Route path="analytics" element={<AdminAnalytics />} />*/}
                            {/*<Route path="pos" element={<AdminPOS />} />*/}
                        </Route>
                    </Route>
                </Routes>

            </Router>

        )
    }

}

export default App;