
import '../styles/fonts.css';
import '../styles/HomeAbout.css';
import React from "react";

export default function HomeAbout() {
    return (
        <section className="about-section">
            <div className="about-wrapper">

                <div className="about-left">
                    <div className="about-info teko">
                        <p>Welcome</p>
                        <p>217A Chandler St, Worcester, MA 01609</p>
                        <p>(508) 756-6888</p>
                    </div>

                    <div className="about-divider"></div>

                    <div className="about-hours teko">
                        <div className="hours-row">
                            <span className="hours-day">Monday – Thursday</span>
                            <span className="hours-dots"></span>
                            <span className="hours-time">11:00 AM – 10:30 PM</span>
                        </div>

                        <div className="hours-row">
                            <span className="hours-day">Friday - Saturday</span>
                            <span className="hours-dots"></span>
                            <span className="hours-time">11:00 AM – 11:00 PM</span>
                        </div>

                        <div className="hours-row">
                            <span className="hours-day">Sunday</span>
                            <span className="hours-dots"></span>
                            <span className="hours-time">12:00 Noon – 10:30 PM</span>
                        </div>
                    </div>
                </div>

                <div className="about-right">
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
    );
}