import ConversionAnimation from './ConversionAnimation';

interface HeaderProps {
    title?: string;
    subtitle?: string;
}

const Header = ({ title = "3D Floor Plan Viewer", subtitle = "Transform your 2D designs into immersive 3D experiences" }: HeaderProps) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-intro">
                    <div className="header-brand">
                        <div className="header-logo">
                            <div className="logo-icon">🏠</div>
                        </div>
                        <div className="header-text">
                            <h1 className="header-title">{title}</h1>
                            <p className="header-subtitle">{subtitle}</p>
                        </div>
                    </div>

                    <div className="header-description">
                        <p>Welcome to my project demonstration! This interactive showcase demonstrates how 2D architectural floor plans can be seamlessly converted into stunning 3D visualizations using modern web technologies.</p>
                        <div className="tech-stack">
                            <span className="tech-tag">React</span>
                            <span className="tech-tag">Three.js</span>
                            <span className="tech-tag">WebGL</span>
                            <span className="tech-tag">TypeScript</span>
                        </div>
                    </div>
                </div>

                <div className="header-demo">
                    <ConversionAnimation />
                </div>

                <div className="header-actions">
                    <button className="header-btn primary">View Project</button>
                    <button className="header-btn secondary">Source Code</button>
                </div>
            </div>

            <div className="header-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>
        </header>
    );
};

export default Header;
