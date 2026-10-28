import React from 'react';
import { Link } from 'react-router-dom';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import '../styles/footer.css';

const hours = [
    { days: 'Monday–Thursday', short: 'Mon–Thu', time: '11:00 AM – 10:30 PM' },
    { days: 'Friday–Saturday', short: 'Fri–Sat', time: '11:00 AM – 11:00 PM' },
    { days: 'Sunday', short: 'Sunday', time: '12:00 Noon – 10:30 PM' }
];
const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('Ming House, 217A Chandler Street, Worcester MA 01609');

export default function Footer() {
    return (
        <footer className="site-footer" aria-label="Restaurant information">
            <div className="site-footer-inner">
                <div className="site-footer-grid">
                    <div className="site-footer-brand">
                        <Link to="/" aria-label="Ming House home" className="site-footer-logo-link">
                            <img src="/images/LogoOneLine.png" alt="Ming House" className="site-footer-logo" loading="lazy" />
                        </Link>
                        <p>Chinese cuisine in Worcester.</p>
                        <div className="site-footer-actions">
                            <a className="site-footer-call" href="tel:15087566888"><CallOutlinedIcon aria-hidden="true" />Call restaurant</a>
                            <a href={directionsUrl} target="_blank" rel="noopener noreferrer"><NearMeOutlinedIcon aria-hidden="true" />Directions<span className="site-footer-sr-only"> (opens in a new tab)</span></a>
                        </div>
                    </div>

                    <section className="site-footer-hours" aria-labelledby="site-footer-hours-title">
                        <h2 id="site-footer-hours-title">Opening hours</h2>
                        <dl>
                            {hours.map(({ days, short, time }) => <div className="site-footer-hours-row" key={days}>
                                <dt><span className="site-footer-day-full">{days}</span><abbr className="site-footer-day-short" title={days}>{short}</abbr></dt>
                                <dd>{time}</dd>
                            </div>)}
                        </dl>
                        <Link to="/contactPage" className="site-footer-hours-link">View hours &amp; location <span aria-hidden="true">→</span></Link>
                    </section>

                    <section className="site-footer-contact" aria-labelledby="site-footer-contact-title">
                        <h2 id="site-footer-contact-title">Visit &amp; contact</h2>
                        <address>
                            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="site-footer-address">217A Chandler Street<br />Worcester, MA 01609<span className="site-footer-sr-only"> (opens directions in a new tab)</span></a>
                            <a href="tel:15087566888">(508) 756-6888</a>
                            <a href="mailto:minghousema@gmail.com">minghousema@gmail.com</a>
                        </address>
                    </section>
                </div>

                <div className="site-footer-bottom">
                    <nav aria-label="Footer navigation">
                        <Link to="/menuPage">Menu</Link>
                        <Link to="/contactPage">Hours &amp; location</Link>
                        <Link to="/checkoutPage">Cart</Link>
                    </nav>
                    <p>© {new Date().getFullYear()} Ming House.</p>
                </div>
            </div>
        </footer>
    );
}
