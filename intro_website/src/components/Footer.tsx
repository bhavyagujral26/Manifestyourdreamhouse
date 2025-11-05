const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon">🏠</div>
                            <span className="logo-text">3D Floor Plan Viewer</span>
                        </div>
                        <p className="footer-description">
                            Transform your 2D designs into immersive 3D experiences.
                            The future of architectural visualization is here.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link">📧</a>
                            <a href="#" className="social-link">🐦</a>
                            <a href="#" className="social-link">💼</a>
                            <a href="#" className="social-link">📘</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="link-group">
                            <h4 className="link-title">Product</h4>
                            <ul className="link-list">
                                <li><a href="#features">Features</a></li>
                                <li><a href="#pricing">Pricing</a></li>
                                <li><a href="#models">3D Models</a></li>
                                <li><a href="#">Templates</a></li>
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4 className="link-title">Company</h4>
                            <ul className="link-list">
                                <li><a href="#about">About</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press</a></li>
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4 className="link-title">Support</h4>
                            <ul className="link-list">
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Documentation</a></li>
                                <li><a href="#contact">Contact</a></li>
                                <li><a href="#">Status</a></li>
                            </ul>
                        </div>

                        <div className="link-group">
                            <h4 className="link-title">Legal</h4>
                            <ul className="link-list">
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                                <li><a href="#">GDPR</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © 2024 3D Floor Plan Viewer. All rights reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
