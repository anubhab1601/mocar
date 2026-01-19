import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>About MoCar</h3>
                        <p>
                            MoCar is Bhubaneswar's leading self-drive car and bike rental service.
                            We provide affordable, well-maintained vehicles with flexible rental periods
                            and 24/7 customer support.
                        </p>
                        <div className="social-links">
                            <a href="https://www.facebook.com/MoCar-Bike-and-Car-Rental" target="_blank" rel="noopener noreferrer" title="Facebook">
                                <i className="fab fa-facebook-f" />
                            </a>
                            <a href="#" title="Instagram">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" title="Twitter">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href="#" title="WhatsApp">
                                <i className="fab fa-whatsapp" />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/cars">All Cars</Link></li>
                            <li><Link href="/bikes">All Bikes</Link></li>
                            <li><Link href="/gallery">Gallery</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Our Services</h3>
                        <ul className="footer-links">
                            <li><Link href="/cars">Self Drive Cars</Link></li>
                            <li><Link href="/bikes">Self Drive Bikes</Link></li>
                            <li><Link href="#">Hourly Rentals</Link></li>
                            <li><Link href="#">Daily Rentals</Link></li>
                            <li><Link href="#">Weekly Rentals</Link></li>
                            <li><Link href="#">Corporate Rentals</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Contact Info</h3>
                        <div className="footer-contact-item">
                            <i className="fas fa-map-marker-alt" />
                            <div>
                                <p>Block N5/B2, ID Market,<br />
                                    IRC Village, Nayapalli,<br />
                                    Bhubaneswar, Odisha</p>
                            </div>
                        </div>
                        <div className="footer-contact-item">
                            <i className="fas fa-phone" />
                            <div>
                                <p>
                                    <a href="tel:+919090610116">9090610116</a><br />
                                    <a href="tel:+917978624414">7978624414</a>
                                </p>
                            </div>
                        </div>
                        <div className="footer-contact-item">
                            <i className="fas fa-envelope" />
                            <div>
                                <p><a href="mailto:info@mocar.co.in">info@mocar.co.in</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MoCar – Self Drive Car & Bike Rental. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
