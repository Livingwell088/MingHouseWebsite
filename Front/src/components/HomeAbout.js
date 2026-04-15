import '../styles/fonts.css';
import '../styles/HomeAbout.css';
import React from "react";




export default function HomeAbout() {
    return (
        <>
            <section className="about-section">

                <div style={{
                    display: "flex",
                    // alignItems: "center"
                }}>
                    {/* LEFT SIDE */}
                    <div style={{
                        flex: 1,
                        alignItems: "left"

                    }} className="about-left">

                        <div style={{
                            textAlign: "left",
                            padding: "30px"
                        }}>
                            <p className="teko">Welcome</p>
                            <p className="teko">217A Chandler St, Worcester, MA 01609</p>
                            <p className="teko">(508) 756-6888</p>
                        </div>

                        <div style={{
                            height: "1px",
                            background: "black",
                            opacity: 0.5,
                            marginBottom: "10px",
                            width: "80%",
                            // margin: "auto",
                            marginLeft: "30px"
                        }}></div>

                        <div style={{
                            textAlign: "left",
                            padding: "30px",
                            width: "80%",
                        }}>

                            <div className="hours-row teko">
                                <span className="hours-day">Monday – Thursday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 10:30 PM</span>
                            </div>

                            <div className="hours-row teko">
                                <span className="hours-day">Friday - Saturday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">11:00 AM – 11:00 PM</span>
                            </div>

                            <div className="hours-row teko">
                                <span className="hours-day">Sunday</span>
                                <span className="hours-dots"></span>
                                <span className="hours-time">12:00 Noon – 10:30 PM</span>
                            </div>
                        </div>




                    </div>

                    {/* RIGHT SIDE */}
                    <div style={{
                        flex: 1,

                    }} className="about-right">

                        <div className="map-container">
                            <iframe
                                title="map"
                                src="https://www.google.com/maps?q=Ming+House+Worcester,+MA&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>

                    </div>
                </div>



            </section>
        </>
    )
}

