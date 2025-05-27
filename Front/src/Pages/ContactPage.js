import {CssBaseline} from "@mui/material";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import '../styles/App.css';
import '../styles/fonts.css';
import API from "../api";


const ContactPage = (props) => {


    return <>
        <CssBaseline />
        <div className="App teko">
            <main>
                <div style={{
                    backgroundImage: `url(/images/fries.png)`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100vh",
                    opacity: "80%",
                }}>

                <h1 className={"dancing-script fontDark"} style={{marginBottom: "2%"}}>Contact Us</h1>

                <Row style={{textAlign: "left"}}>
                    <Col xs={2}></Col>

                    <Col>
                        <p style={{margin: 0}} ><strong>ADDRESS</strong></p>
                        <h5>217A Chandler Street, Worcester MA, 01609</h5>


                        <p style={{margin: 0}}><strong>PHONE NUMBER</strong></p>
                        <h5>(508)756-6888</h5>


                        <p style={{margin: 0}}><strong>EMAIL</strong></p>
                        <h5>minghousema@gmail.com</h5>

                    </Col>

                    <Col>
                        <p><strong>HOURS OF OPERATIONS</strong></p>
                        {/*<h5><strong>Sunday:</strong> 12:00 Noon - 10:30 PM</h5>*/}
                        {/*<h5><strong>Monday:</strong> 11:00 AM - 10:30 PM</h5>*/}
                        {/*<h5><strong>Tuesday:</strong> 11:00 AM - 10:30 PM</h5>*/}
                        {/*<h5><strong>Wednesday:</strong> 11:00 AM - 10:30 PM</h5>*/}
                        {/*<h5><strong>Thursday:</strong> 11:00 AM - 10:30 PM</h5>*/}
                        {/*<h5><strong>Friday:</strong> 11:00 AM - 11:00 PM</h5>*/}
                        {/*<h5><strong>Saturday:</strong> 11:00 AM - 11:00 PM</h5>*/}

                        <table style={{width: "75%"}}>
                            <tbody>
                            <tr>
                                <td><h5><strong>Sunday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>12:00 Noon - 10:30 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Monday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 10:30 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Tuesday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 10:30 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Wednesday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 10:30 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Thursday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 10:30 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Friday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 11:00 PM </h5></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Saturday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><h5>11:00 AM - 11:00 PM </h5></td>
                            </tr>
                            </tbody>
                        </table>
                    </Col>

                    <Col xs={2}></Col>
                </Row>

                    <Button onClick={
                        API.timeAPI.get()
                    }></Button>
                </div>
            </main>
        </div>
        </>
}


export default ContactPage;