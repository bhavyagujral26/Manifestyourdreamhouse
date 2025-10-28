import React from 'react';
import Box3D from './components/Box3D';
import Banner from './components/Banner';
import './index.css';

function App() {
  return (
    <>
      {/* Global blur background */}
      <div className="blur-layer"></div>

      {/* Pill Navigation */}
      <nav className="pill-nav">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#models">3D Models</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* Section 1 — Home */}
      <section id="home">
        <div className="banner">
          <h1>My 3D Floor Plan Viewer</h1>
          <p>Explore beautiful and interactive 3D floor plans — all in your browser.</p>
        </div>
      </section>

      {/* Section 2 — Features */}
      <section id="features">
        <Banner
          title="Powerful Features"
          description="Generate, view, and interact with stunning 3D floor plans using advanced rendering and intuitive controls."
          image="https://source.unsplash.com/random/1000x400?architecture,modern"
        />
      </section>

      {/* Section 3 — 3D Model */}
      <section id="models">
        <div
          className="banner"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '85%',
            maxWidth: '1200px',
            padding: '40px',
            gap: '40px',
          }}
        >
          <div style={{ flex: '1' }}>
            <h2>Interactive 3D Preview</h2>
            <p>Rotate, zoom, and explore models in real time.</p>
          </div>
          <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '70vh' }}>
              <Box3D />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — About */}
      <section id="about">
        <div className="banner">
          <h2>About This Tool</h2>
          <p>This platform converts your 2D designs into immersive 3D environments.</p>
        </div>
      </section>

      {/* Section 5 — Contact */}
      <section id="contact">
        <div className="banner">
          <h2>Contact Us</h2>
          <p>Reach out for collaborations, demos, or feature requests!</p>
        </div>
      </section>
    </>
  );
}

export default App;
