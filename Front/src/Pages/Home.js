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
