import '../styles/fonts.css';
import '../styles/footer.css';
import {Image} from "react-bootstrap";
import * as React from "react";




export default function Footer() {

    return (
        <>

            <div className="footer">
                <div className="footer-top-line"></div>

                <div className="footer-content" >

                    <div className="footer-column brand" >

                        <Image src={"/images/LogoSquare.png"} width='100%'/>

                    </div>


                    <div className="footer-column hours-column teko">
                        <div className="footer-hours" >
                            <h3>HOURS</h3>


                            <div className="hours-row">
                                <span className="hours-day">Sunday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">12:00 Noon – 10:30 PM</span>
                            </div>

                            <div className="hours-row">
                                <span className="hours-day">Monday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 10:30 PM</span>
                            </div>
                            <div className="hours-row">
                                <span className="hours-day">Tuesday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 10:30 PM</span>
                            </div>
                            <div className="hours-row">
                                <span className="hours-day">Wednesday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 10:30 PM</span>
                            </div>
                            <div className="hours-row">
                                <span className="hours-day">Thursday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 10:30 PM</span>
                            </div>

                            <div className="hours-row">
                                <span className="hours-day">Friday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 11:00 PM</span>
                            </div>

                            <div className="hours-row">
                                <span className="hours-day">Saturday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 11:00 PM</span>
                            </div>


                        </div>
                    </div>

                    <div className="footer-column teko" >
                        <h3>CONTACT</h3>
                        <p style={{margin: 0}}>217A Chandler St</p>
                        <p>Worcester, MA 01609</p>

                        <p>(508) 756-6888</p>
                        <p>minghousema@gmail.com</p>
                    </div>

                </div>




                <div className="footer-bottom-line"></div>

                <p className="footer-copy">
                    2026 Ming House.
                </p>
            </div>
        </>
    )
}