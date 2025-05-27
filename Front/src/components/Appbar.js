import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../styles/appbar.css'
import {Col, Image, NavLink, OverlayTrigger, Popover, Row} from "react-bootstrap";
import '../styles/fonts.css';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import {useEffect, useState} from "react";
import UserPopover from "./UserPopover";

export default function Appbar() {

    const [user, setUser] = useState("")
    const [show, setShow] = useState("false")

    const [log, setLog] = useState(window.sessionStorage.getItem("loggedIn"))




    const handleUser = () => {
        if (window.sessionStorage.getItem("loggedIn") === "false" || null){
            console.log("Not Logged In")
        }
        else{
            console.log("Logged In: " + window.sessionStorage.getItem("username"))
        }
    }

    useEffect(() => {
        // console.log("Session Change")

        setLog(window.sessionStorage.getItem("loggedIn"))

        // const handleSessionChange = () => {
        //     setLog(window.sessionStorage.getItem("loggedIn"))
        //
        // }
        //
        // window.addEventListener("storage", handleSessionChange)
        //
        // return () => {
        //     window.removeEventListener("storage", handleSessionChange)
        // }
    }, [log]);



    return (
        <>
            {/*<div id='header'>*/}
            {/*    <Row  className={"teko"}>*/}
            {/*        <Col xs={1}></Col>*/}
            {/*        <Col xs={3}><p style={{color: "white"}}>217A Chandler St Worcester MA 01609</p></Col>*/}
            {/*        <Col xs={3}><p style={{color: "white"}}>(508)756-6888</p></Col>*/}
            {/*        <Col xs={4}>*/}

            {/*            /!*<p style={{color: "white"}}>Sun: 12:00PM-10:30PM</p>*!/*/}
            {/*            /!*<p style={{color: "white"}}>Tues-Thurs: 11:00AM-10:30PM</p>*!/*/}
            {/*            /!*<p style={{color: "white"}}>Fri-Sat: 11:00AM-11:00PM</p>*!/*/}
            {/*            </Col>*/}
            {/*        <Col xs={1}>*/}
            {/*            {show && <p>{user}</p>}*/}
            {/*        </Col>*/}
            {/*    </Row>*/}


            {/*</div>*/}

            {/*<Navbar style={{backgroundColor: "#071740", position: "sticky"}} variant="dark" fixed="top">*/}
            <Navbar id='navbar1' className={"teko"}>
                    <Nav id='nav1' className={"align-items-center "}>

                        <Navbar.Brand id='logo' as={NavLink} to={'/'}>
                            <Image src={"/images/logo.png"} width='100vm'/>
                        </Navbar.Brand>

                        <Nav.Item className={"navitem"}>
                            <Link to={'/'} style={{textDecoration: "none"}}>
                                <p className={"navtext"}>ABOUT US</p>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className={"navitem"}>
                            <Link to="/menupage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>MENU</p>
                            </Link>
                        </Nav.Item>


                        <Nav.Item className={"navitem"}>
                            <Link to="/cartPage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>CART</p>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className={"navitem"}>
                            <Link to="/contactPage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>CONTACT US</p>
                            </Link>
                        </Nav.Item>

                        <Nav.Item className={"navitem"}>

                        </Nav.Item>

                        <Nav.Item className={"navitem"}>

                            <UserPopover user={log} />

                        </Nav.Item>

                    </Nav>

            </Navbar>

            {/*<hr />*/}
        </>
    );
}



