import Header from './components/Header';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Enhanced3D from './components/Enhanced3D';
import GLBViewer from './components/GLBViewer';
import FloorPlanBuilderPage from './pages/FloorPlanBuilderPage';
import Footer from './components/Footer';
import { Component } from 'react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: 'white',
          background: 'rgba(255, 0, 0, 0.1)',
          borderRadius: '10px',
          margin: '20px'
        }}>
          <h3>Error loading 3D model</h3>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <details style={{ marginTop: '10px', textAlign: 'left' }}>
            <summary>Stack trace</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/builder') {
        setCurrentPage('builder');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPage === 'builder') {
    return <FloorPlanBuilderPage />;
  }

  return (
    <>
      {/* Global blur background */}
      <div className="blur-layer"></div>

      {/* Pill Navigation */}
      <nav className="pill-nav">
        <a href="#features">Features</a>
        <a href="#models">3D Models</a>
        <a href="#testimonials">Reviews</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* Header Section */}
      <Header />

      {/* Features Section */}
      <Features />

      {/* Section 3 — 3D Model */}
      <section id="models">
        <div className="banner">
          <h2>Interactive 3D Preview</h2>
          <p>Experience our advanced 3D rendering technology with interactive models</p>
          <Enhanced3D />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Section 4 — 3D Model Viewer */}
      <section id="contact">
        <div className="banner">
          <h2>3D Model Preview</h2>
          <p style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#666' }}>
            Explore our detailed 3D model. Rotate, zoom, and interact with the model below.
          </p>
          <ErrorBoundary>
            <GLBViewer />
          </ErrorBoundary>
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            fontSize: '0.95rem',
            color: '#555'
          }}>
            <p style={{ margin: 0 }}>
              <strong>💡 Tip:</strong> Use your mouse to rotate, scroll to zoom, and click + drag to pan around the model.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — Floor Plan Builder CTA */}
      <section id="builder-cta">
        <div className="banner">
          <h2>Create Your Own Floor Plan</h2>
          <p style={{ marginBottom: '30px', fontSize: '1.2rem', color: '#666' }}>
            Design your dream space with our intuitive floor plan builder. Draw walls, add doors and windows, and see your design come to life in 3D.
          </p>
          <a
            href="#/builder"
            style={{
              display: 'inline-block',
              padding: '18px 40px',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
            }}
          >
            🏗️ Make Your Own Floor Plan
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
