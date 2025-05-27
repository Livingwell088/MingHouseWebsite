import React, {useEffect, useState} from "react";
import {Container, CssBaseline} from "@mui/material";
import Typography from "@mui/material/Typography";
import '../styles/App.css';
import '../styles/fonts.css';
import {Image, Col, Row, Button} from "react-bootstrap";
import API from "../api";
import ConfirmationModal from "../components/ConfirmationModal";
import {useLocation, useNavigate} from "react-router-dom";
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
                <main>
                    <div style={{
                        backgroundImage: `url(/images/dumpling.png)`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100vh",
                        opacity: "80%",
                    }}>

                        <Container maxWidth='sm' id={"container"}>

                            <h3 className={"teko fontDark"} style={{textAlign: "left"}}>Welcome to</h3>
                            <h1 className={"kolker-brush-regular fontDark fontLarge"}>
                                Ming
                                House</h1>

                            <p className={"teko fontDark"} style={{textAlign: "left"}}>Located at 217A Chandler St, Worcester MA 01609,
                                We offer a wide range of delicious Chinese Cuisine.</p>

                            {/*<Typography className={"teko"} variant='h6' align='left' color='#3c342c' >Welcome to</Typography>*/}
                            {/*<Typography className={"jacques-francois-shadow-regular"} variant='h1' align='left' color='#282c34' gutterBottom fontWeight={"bold"} word-wrap={"break-word"}  >*/}
                            {/*    Ming*/}
                            {/*    House*/}
                            {/*</Typography>*/}


                            {/*<Typography className={"teko"} variant='h8' align='left' color='#282c34' paragraph>*/}
                            {/*    Located at 217A Chandler St, Worcester MA 01609,*/}
                            {/*    We offer a wide range of delicious Chinese Cuisine.*/}
                            {/*</Typography>*/}

                            <Row>
                                {/*<Col xs={3}><Button href="#" className="rounded-pill button">Link</Button></Col>*/}
                                {/*<Col xs={3}><Button type="submit" className="rounded-pill button">Button</Button></Col>*/}
                                {/*<Col xs={3}><Button href="#" className="rounded-pill button">Link</Button></Col>*/}
                                {/*<Col xs={3}></Col>*/}
                            </Row>
                            <ConfirmationModal order={placedOrder} show={showPopup} onClose={handleClose} />

                        </Container>
                    </div>
                </main>


            </div>
        </>
    );
}

export default Home;
