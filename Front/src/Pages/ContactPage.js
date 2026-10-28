import React from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import '../styles/fonts.css';
import '../styles/ContactPage.css';

const weeklyHours = [
    ['Monday', '11:00 AM – 10:30 PM'],
    ['Tuesday', '11:00 AM – 10:30 PM'],
    ['Wednesday', '11:00 AM – 10:30 PM'],
    ['Thursday', '11:00 AM – 10:30 PM'],
    ['Friday', '11:00 AM – 11:00 PM'],
    ['Saturday', '11:00 AM – 11:00 PM'],
    ['Sunday', '12:00 Noon – 10:30 PM']
];
const mapsDestination = encodeURIComponent('Ming House, 217A Chandler Street, Worcester MA 01609');
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsDestination}`;

export default function ContactPage() {
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'America/New_York' }).format(new Date());

    return (
        <main className="hours-page">
            <header className="hours-page-heading">
                <p className="hours-eyebrow">Ming House · Worcester, MA</p>
                <h1 className="trade-winds-regular">Hours &amp; Location</h1>
                <p>Plan your visit. We look forward to welcoming you.</p>
            </header>

            <div className="hours-page-grid">
                <section className="hours-panel" aria-labelledby="weekly-hours-title">
                    <div className="hours-panel-heading">
                        <span className="hours-section-icon"><AccessTimeRoundedIcon aria-hidden="true" /></span>
                        <div><h2 id="weekly-hours-title">Our hours</h2><p>Open seven days a week</p></div>
                    </div>
                    <table className="weekly-hours-table">
                        <caption className="hours-sr-only">Weekly opening hours, Worcester local time</caption>
                        <tbody>
                            {weeklyHours.map(([day, hours]) => (
                                <tr key={day} className={day === today ? 'hours-today' : undefined}>
                                    <th scope="row">{day}{day === today && <span className="hours-today-label">Today</span>}</th>
                                    <td>{hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="hours-panel-note">All times are local to Worcester, Massachusetts.</p>
                </section>

                <section className="hours-panel hours-visit" aria-labelledby="visit-title">
                    <div className="hours-panel-heading">
                        <span className="hours-section-icon"><LocationOnOutlinedIcon aria-hidden="true" /></span>
                        <div><h2 id="visit-title">Come find us</h2><p>On Chandler Street in Worcester</p></div>
                    </div>
                    <address className="hours-contact-details">
                        <div className="hours-contact-row">
                            <LocationOnOutlinedIcon aria-hidden="true" />
                            <div><span className="hours-detail-label">Address</span><p>217A Chandler Street<br />Worcester, MA 01609</p></div>
                        </div>
                        <div className="hours-contact-row">
                            <CallOutlinedIcon aria-hidden="true" />
                            <div><span className="hours-detail-label">Give us a call</span><a href="tel:15087566888">(508) 756-6888</a></div>
                        </div>
                        <div className="hours-contact-row">
                            <MailOutlineRoundedIcon aria-hidden="true" />
                            <div><span className="hours-detail-label">Email us</span><a href="mailto:minghousema@gmail.com">minghousema@gmail.com</a></div>
                        </div>
                    </address>
                    <div className="hours-actions">
                        <a className="hours-action hours-action-primary" href="tel:15087566888"><CallOutlinedIcon aria-hidden="true" />Call restaurant</a>
                        <a className="hours-action" href={directionsUrl} target="_blank" rel="noopener noreferrer"><LocationOnOutlinedIcon aria-hidden="true" />Get directions<span className="hours-sr-only"> (opens in a new tab)</span></a>
                    </div>
                </section>
            </div>

            <section className="hours-map-section" aria-labelledby="hours-map-title">
                <div className="hours-map-heading"><div><h2 id="hours-map-title">A little closer to your next favorite</h2><p>217A Chandler Street · Worcester, MA 01609</p></div><a href={directionsUrl} target="_blank" rel="noopener noreferrer">Open in Maps <span aria-hidden="true">↗</span><span className="hours-sr-only"> (opens in a new tab)</span></a></div>
                <iframe
                    className="hours-map"
                    title="Ming House location at 217A Chandler Street, Worcester"
                    src="https://www.google.com/maps?q=Ming+House+Worcester,+MA&output=embed"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>
        </main>
    );
}
