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

    }, [log]);



    return (
        <>

            {/*<Navbar id='navbar1' className={"teko"}>*/}
            {/*        <Nav id='nav1' className={"align-items-center "}>*/}

            {/*            <Navbar.Brand id='logo' as={NavLink} to={'/'}>*/}
            {/*                <Image src={"/images/logo.png"} width='100vm'/>*/}
            {/*            </Navbar.Brand>*/}

            {/*            <Nav.Item className={"navitem"}>*/}
            {/*                <Link to={'/'} style={{textDecoration: "none"}}>*/}
            {/*                    <p className={"navtext"}>ABOUT US</p>*/}
            {/*                </Link>*/}
            {/*            </Nav.Item>*/}
            {/*            <Nav.Item className={"navitem"}>*/}
            {/*                <Link to="/menupage" style={{textDecoration: "none"}}>*/}
            {/*                    <p className={"navtext"}>MENU</p>*/}
            {/*                </Link>*/}
            {/*            </Nav.Item>*/}


            {/*            <Nav.Item className={"navitem"}>*/}
            {/*                <Link to="/cartPage" style={{textDecoration: "none"}}>*/}
            {/*                    <p className={"navtext"}>CART</p>*/}
            {/*                </Link>*/}
            {/*            </Nav.Item>*/}
            {/*            <Nav.Item className={"navitem"}>*/}
            {/*                <Link to="/contactPage" style={{textDecoration: "none"}}>*/}
            {/*                    <p className={"navtext"}>CONTACT US</p>*/}
            {/*                </Link>*/}
            {/*            </Nav.Item>*/}

            {/*            <Nav.Item className={"navitem"}>*/}

            {/*            </Nav.Item>*/}

            {/*            <Nav.Item className={"navitem"}>*/}

            {/*                <UserPopover user={log} />*/}

            {/*            </Nav.Item>*/}

            {/*        </Nav>*/}

            {/*</Navbar>*/}


            <Navbar id='navbar1' className={"teko"} expand="md">
                {/*<Nav id='nav1' className={"align-items-center w-100"}>*/}
                <div className={"container-fluid navcontainer"}>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />


                    <Navbar.Brand id="logo">
                        <Link to="/">
                            <Image src="/images/LogoOneLine.png" height="70" />
                        </Link>
                    </Navbar.Brand>


                    {/*Right*/}

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                    <Nav id="navLinks" className={"navLinks align-items-center gap-4"}>

                        <Button id="order-btn"> Order Now </Button>

                        <Nav.Item className={"navitem"}>
                            <Link to="/menupage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>MENU</p>
                            </Link>
                        </Nav.Item>


                        <Nav.Item className={"navitem"}>
                            <Link to="/contactPage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>HOURS</p>
                            </Link>
                        </Nav.Item>
                        <Nav.Item className={"navitem"}>
                            <Link to="/contactPage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>CONTACT US</p>
                            </Link>
                        </Nav.Item>

                        <Nav.Item className={"navitem"}>
                            <Link to="/cartPage" style={{textDecoration: "none"}}>
                                <p className={"navtext"}>CART</p>
                            </Link>
                        </Nav.Item>

                        {/*<Nav.Item className={"navitem"}>*/}

                        {/*    <UserPopover user={log} />*/}

                        {/*</Nav.Item>*/}
                    </Nav>

                        </Nav>
                    </Navbar.Collapse>




                {/*</Nav>*/}

                </div>
            </Navbar>

            {/*<hr />*/}
        </>
    );
}



