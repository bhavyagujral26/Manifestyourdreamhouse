import FloorPlanBuilder from '../components/FloorPlanBuilder';
import { Component } from 'react';
import type { ReactNode } from 'react';
import '../index.css';

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
                    <h3>Error loading floor plan builder</h3>
                    <p>{this.state.error?.message || 'Unknown error'}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default function FloorPlanBuilderPage() {
    return (
        <>
            {/* Global blur background */}
            <div className="blur-layer"></div>

            {/* Navigation Bar */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '15px 40px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <a
                    href="#/"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = '';
                        window.history.pushState('', '', window.location.pathname);
                    }}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '25px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    ← Back to Home
                </a>
                <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#222', fontWeight: '700' }}>
                    🏗️ Floor Plan Builder
                </h1>
            </nav>

            {/* Main Content */}
            <div style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
                <ErrorBoundary>
                    <FloorPlanBuilder />
                </ErrorBoundary>
            </div>
        </>
    );
}

