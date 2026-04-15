import '../styles/fonts.css';
import '../styles/footer.css';
import {Image} from "react-bootstrap";
import * as React from "react";




export default function Footer() {

    return (
        <>

            <div className="footer">
                <div className="footer-top-line"></div>

                <div className="footer-content">

                    <div className="footer-column brand">

                        <Image src={"/images/LogoSquare.png"} width='100%'/>

                    </div>

                    <div className="footer-column">
                        {/*<h3>HOURS</h3>*/}
                        {/*<p>Monday - Thursday</p>*/}
                        {/*<p>11:00 AM - 9:30 PM</p>*/}

                        {/*<p>Friday - Saturday</p>*/}
                        {/*<p>11:00 AM - 10:30 PM</p>*/}

                        {/*<p>Sunday Closed</p>*/}

                        <table style={{width: "100%"}}>
                            <tbody>
                            <tr>
                                <td><h5><strong>Sunday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>12:00 Noon - 10:30 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Monday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 10:30 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Tuesday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 10:30 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Wednesday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 10:30 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Thursday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 10:30 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Friday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 11:00 PM </p></td>
                            </tr>
                            <tr>
                                <td><h5><strong>Saturday:</strong></h5></td>
                                <td style={{textAlign: "right"}}><p>11:00 AM - 11:00 PM </p></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="footer-column">
                        <h3>CONTACT</h3>
                        <p>217A Chandler St</p>
                        <p>Worcester, MA 01609</p>
                        <p>(508) 756-6888</p>
                    </div>

                </div>


                <div className="footer-bottom-line"></div>

                <p className="footer-copy">
                    © 2026 Ming House. All rights reserved.
                </p>
            </div>
        </>
    )
}