interface PricingTierProps {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
}

const PricingTier = ({ name, price, period, description, features, isPopular = false, buttonText }: PricingTierProps) => {
    return (
        <div className={`pricing-tier ${isPopular ? 'popular' : ''}`}>
            {isPopular && <div className="popular-badge">Most Popular</div>}
            <div className="tier-header">
                <h3 className="tier-name">{name}</h3>
                <div className="tier-price">
                    <span className="price">{price}</span>
                    <span className="period">/{period}</span>
                </div>
                <p className="tier-description">{description}</p>
            </div>
            <ul className="tier-features">
                {features.map((feature, index) => (
                    <li key={index} className="feature-item">
                        <span className="checkmark">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>
            <button className={`tier-button ${isPopular ? 'primary' : 'secondary'}`}>
                {buttonText}
            </button>
        </div>
    );
};

const Pricing = () => {
    const tiers = [
        {
            name: "Starter",
            price: "Free",
            period: "forever",
            description: "Perfect for trying out our platform",
            features: [
                "Up to 3 projects",
                "Basic 3D rendering",
                "Standard templates",
                "Community support",
                "Mobile access"
            ],
            buttonText: "Get Started Free"
        },
        {
            name: "Professional",
            price: "$29",
            period: "month",
            description: "Ideal for architects and designers",
            features: [
                "Unlimited projects",
                "Advanced 3D rendering",
                "Premium templates",
                "Priority support",
                "Cloud storage (100GB)",
                "Team collaboration",
                "Export to CAD"
            ],
            isPopular: true,
            buttonText: "Start Free Trial"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "contact",
            description: "For large teams and organizations",
            features: [
                "Everything in Professional",
                "Custom integrations",
                "Dedicated support",
                "Unlimited cloud storage",
                "Advanced analytics",
                "White-label options",
                "API access"
            ],
            buttonText: "Contact Sales"
        }
    ];

    return (
        <section id="pricing" className="pricing-section">
            <div className="pricing-container">
                <div className="pricing-header">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>Choose the plan that's right for you. Upgrade or downgrade at any time.</p>
                </div>
                <div className="pricing-grid">
                    {tiers.map((tier, index) => (
                        <PricingTier
                            key={index}
                            name={tier.name}
                            price={tier.price}
                            period={tier.period}
                            description={tier.description}
                            features={tier.features}
                            isPopular={tier.isPopular}
                            buttonText={tier.buttonText}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
