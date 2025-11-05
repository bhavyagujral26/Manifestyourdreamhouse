interface TestimonialProps {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
}

const Testimonial = ({ name, role, company, content, avatar }: TestimonialProps) => {
    return (
        <div className="testimonial-card">
            <div className="testimonial-content">
                <p className="testimonial-text">"{content}"</p>
            </div>
            <div className="testimonial-author">
                <div className="author-avatar">{avatar}</div>
                <div className="author-info">
                    <h4 className="author-name">{name}</h4>
                    <p className="author-role">{role} at {company}</p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Architect",
            company: "Design Studio Pro",
            content: "This platform has revolutionized how we present our designs to clients. The 3D visualization is incredibly realistic and helps clients understand the space better than traditional 2D plans.",
            avatar: "👩‍💼"
        },
        {
            name: "Michael Rodriguez",
            role: "Interior Designer",
            company: "Modern Spaces",
            content: "The ease of use is remarkable. I can create stunning 3D floor plans in minutes instead of hours. My clients are always impressed with the interactive models.",
            avatar: "👨‍🎨"
        },
        {
            name: "Emily Johnson",
            role: "Real Estate Agent",
            company: "Premier Properties",
            content: "This tool has helped me close more deals. Being able to show potential buyers exactly how a space will look has been a game-changer for my business.",
            avatar: "👩‍💼"
        },
        {
            name: "David Kim",
            role: "Project Manager",
            company: "BuildCorp",
            content: "The collaboration features are fantastic. Our entire team can work on the same project simultaneously, and the cloud sync ensures everyone has the latest version.",
            avatar: "👨‍💻"
        }
    ];

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2>What Our Users Say</h2>
                    <p>Join thousands of professionals who trust our platform for their 3D visualization needs</p>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <Testimonial
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            company={testimonial.company}
                            content={testimonial.content}
                            avatar={testimonial.avatar}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
