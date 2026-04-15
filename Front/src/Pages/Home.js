import React, {useEffect, useState} from "react";
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
import '../styles/App.css';
import '../styles/fonts.css';
import {Image, Col, Row, Button} from "react-bootstrap";
import API from "../api";
import ConfirmationModal from "../components/ConfirmationModal";
import {useLocation, useNavigate} from "react-router-dom";
import HomeMain from "../components/HomeMain";
import HomePopular from "../components/HomePopular";
import HomeAbout from "../components/HomeAbout";
import HomeBreak from "../components/HomeBreak";
// import dumpling from "images/dumpling.png"

const Home = (props) => {
    const location = useLocation();
    const navigate = useNavigate();


    const [showPopup, setShowPopup] = useState(false)
    const handleShow = () => setShowPopup(true);
    const handleClose = () => {
        setShowPopup(false);
        navigate("/")
    }
    const [placedOrder, setPlacedOrder] = useState({})

    useEffect(() => {
        if (location.state) {
            setShowPopup(location.state.confirm)
            setPlacedOrder(location.state.placedOrder)
        }
        // else{
        //     setShowPopup(false)
        //     navigate("/")
        // }
    }, [location]);

    useEffect( () => {

        const generate = async () => {
            const sessionId = window.sessionStorage.getItem('sessionId');
            // console.log(sessionId)
            if (sessionId === null){
                await API.cartAPI.generate()
                    .then(r => {
                        console.log(r)
                        sessionStorage.setItem("sessionId", r.data)
                    })
                    .catch((error) => console.log(error.message))
            }

            if (window.sessionStorage.getItem('loggedIn') === null){
                window.sessionStorage.setItem('loggedIn', "false")
            }
            console.log(sessionStorage.getItem("sessionId"))

        }

        generate()

    }, [])

    return (
        <>
            <CssBaseline />
            <div className="App">

                <HomeMain />
                <HomeBreak />

                <HomePopular />
                <HomeBreak />

                <HomeAbout />

            </div>
        </>
    );
}

export default Home;
