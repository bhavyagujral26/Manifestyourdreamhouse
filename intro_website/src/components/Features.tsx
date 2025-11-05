interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    );
};

const Features = () => {
    const features = [
        {
            icon: "🎨",
            title: "Easy Design Import",
            description: "Upload your 2D floor plans and watch them transform into stunning 3D models automatically."
        },
        {
            icon: "🔄",
            title: "Real-time Rendering",
            description: "Experience smooth, high-quality 3D rendering with WebGL technology for instant visualization."
        },
        {
            icon: "📱",
            title: "Mobile Responsive",
            description: "Access your 3D models on any device with our responsive design and touch controls."
        },
        {
            icon: "🎯",
            title: "Precise Measurements",
            description: "Get accurate measurements and dimensions with our built-in measurement tools."
        },
        {
            icon: "🌐",
            title: "Cloud Sync",
            description: "Save and sync your projects across devices with our secure cloud storage."
        },
        {
            icon: "👥",
            title: "Collaboration",
            description: "Share your designs with clients and team members for real-time feedback."
        }
    ];

    return (
        <section id="features" className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <h2>Powerful Features</h2>
                    <p>Everything you need to create, visualize, and share stunning 3D floor plans</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
