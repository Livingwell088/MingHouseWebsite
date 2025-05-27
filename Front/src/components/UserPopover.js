import {OverlayTrigger, Popover, Row} from "react-bootstrap";
import * as React from "react";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import API from "../api";
import LoginModal from "./LoginModal";
import '../styles/fonts.css';
import "../styles/menuPopup.css"


const UserPopover = (props) => {

    const [log, setLog] = useState(window.sessionStorage.getItem("loggedIn"))
    const [username, setUsername] = useState(window.sessionStorage.getItem("username"))

    const [user, setUser] = useState({})
    const [guest, setGuest] = useState(true)
    const [loggedGuest, setLoggedGuest] = useState(false)


    const [showPopup, setShowPopup] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => setShowPopup(false);

    const handleRefresh = () => {
        window.location.reload()
    }


    const clickLogin = () => {
        // document.body.click()

        setShowLogin(true)
        handleShow()
    }

    const clickSignUp = () => {
        // document.body.click()

        setShowLogin(false)
        handleShow()

    }

    const getUser = async () => {
        setLog(window.sessionStorage.getItem("loggedIn"))
        setUsername(window.sessionStorage.getItem("username"))


        // console.log(log)
        // console.log(username)

        await API.userAPI.getUser(username)
            .then(async r => {

                // console.log(r.data)
                await setUser(r.data)

                if (log === "true") {

                    // if (user.firstName === user.lastName && user.email === user.usernameId && user.firstName === user.email) {
                    //     setGuest(true)
                    //     setLoggedGuest(true)
                    // } else if (user === {}) {
                    //     setGuest(true)
                    //     setLoggedGuest(true)
                    // } else {
                    //     setGuest(false)
                    // }
                    setGuest(user.guest)
                }
                else{
                    setGuest(true)
                }
            })
            // .then( () => console.log(guest))
            .catch((error) => console.log(error))

        // console.log(user)


    }

    const handleSignOut = () => {
        window.sessionStorage.removeItem("username")
        window.sessionStorage.setItem("loggedIn", "false")

        handleRefresh()
    }



    const popover = (<Popover className={"popover"}>
        <Popover.Header className={"popoverHeader teko"}>
            <h3>Hello, {user.firstName || "Customer"}</h3>
        </Popover.Header>

        {/*<Popover.Body className={"teko"} >*/}
        {/*    {guest &&*/}
        {/*        <div>*/}
        {/*            <Button className={"mingButton btn"} variant={"primary"} style={{color: "white"}} onClick={clickLogin}>Login</Button>*/}
        {/*            <p>Don't have an account? <a onClick={clickSignUp}> Sign Up for one. </a> </p>*/}

        {/*            <LoginModal  show={showPopup} onClose={handleClose} loginScreen={showLogin}></LoginModal>*/}

        {/*        </div>*/}
        {/*    }*/}

        {/*    {!guest &&*/}
        {/*        <div>*/}
        {/*            /!*<Button className={"mingButton"} variant={"primary"} onClick={handleSignOut}>Sign Out</Button>*!/*/}
        {/*            <Row className={"popRow"} style={{width: "100%"}}><a onClick={handleSignOut}><h5 style={{margin: 0}}>Sign Out</h5></a></Row>*/}

        {/*        </div>*/}
        {/*    }*/}

        {/*</Popover.Body>*/}

        {guest && <div className={"teko"} style={{textAlign: "center"}}>
            <Popover.Body style={{paddingBottom: 0}}>
                <Button className={"mingButton btn"} variant={"primary"} style={{color: "white", width: "80%"}} onClick={clickLogin}>Login</Button>
            </Popover.Body>

            <Popover.Body>
                <p>Don't have an account? <a onClick={clickSignUp}> Sign Up for one. </a> </p>
            </Popover.Body>
            <LoginModal  show={showPopup} onClose={handleClose} loginScreen={showLogin}></LoginModal>

        </div>}

        {!guest && <div className={"teko"} style={{textAlign: "center"}}>

            <Popover.Body className={"popRow"}>
                <a href={"/ordersPage"}><h5 style={{margin: 0}}>See Previous Orders</h5></a>
            </Popover.Body>

            <Popover.Body >
                {/*<a onClick={handleSignOut}><h5 style={{margin: 0}}>Sign Out</h5></a>*/}
                <Button className={"mingButton btn"} variant={"primary"} style={{color: "white", width: "80%"}} onClick={handleSignOut}>Sign Out</Button>

            </Popover.Body>
        </div>}


    </Popover>)
    // <UserPopover />

    return <>

        <OverlayTrigger overlay={popover} placement={"bottom"} trigger={"click"} rootClose>
            <a onClick={getUser}>
                <p className={"navtext"}>User</p>
            </a>

        </OverlayTrigger>


    </>

}



export default UserPopover;