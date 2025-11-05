import { Canvas } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DetailedFloorPlan2D() {
    const groupRef = useRef<THREE.Group>(null!);

    return (
        <group ref={groupRef}>
            {/* Floor - 2D view */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial color="#f8f8f8" transparent opacity={0.95} />
            </mesh>

            {/* Room divisions - 2D lines */}
            <mesh position={[0, 0.01, -2]}>
                <boxGeometry args={[6, 0.02, 0.1]} />
                <meshStandardMaterial color="#2c3e50" />
            </mesh>
            <mesh position={[0, 0.01, 2]}>
                <boxGeometry args={[6, 0.02, 0.1]} />
                <meshStandardMaterial color="#2c3e50" />
            </mesh>
            <mesh position={[-3, 0.01, 0]}>
                <boxGeometry args={[0.1, 0.02, 4]} />
                <meshStandardMaterial color="#2c3e50" />
            </mesh>
            <mesh position={[3, 0.01, 0]}>
                <boxGeometry args={[0.1, 0.02, 4]} />
                <meshStandardMaterial color="#2c3e50" />
            </mesh>

            {/* Interior walls */}
            <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[2, 0.02, 0.1]} />
                <meshStandardMaterial color="#34495e" />
            </mesh>
            <mesh position={[-1.5, 0.01, 1]}>
                <boxGeometry args={[0.1, 0.02, 2]} />
                <meshStandardMaterial color="#34495e" />
            </mesh>

            {/* Furniture - 2D rectangles */}
            <mesh position={[-2.2, 0.02, -1.2]}>
                <boxGeometry args={[1.2, 0.02, 0.6]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[2.2, 0.02, -1.2]}>
                <boxGeometry args={[1.0, 0.02, 0.8]} />
                <meshStandardMaterial color="#4169E1" />
            </mesh>
            <mesh position={[-0.5, 0.02, 1.5]}>
                <boxGeometry args={[0.8, 0.02, 0.4]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
            <mesh position={[1.8, 0.02, 1.5]}>
                <boxGeometry args={[0.6, 0.02, 0.6]} />
                <meshStandardMaterial color="#DC143C" />
            </mesh>

            {/* Kitchen island */}
            <mesh position={[0, 0.02, -0.5]}>
                <boxGeometry args={[1.5, 0.02, 0.8]} />
                <meshStandardMaterial color="#D2691E" />
            </mesh>

            {/* Door openings */}
            <mesh position={[-2.5, 0.01, 0]}>
                <boxGeometry args={[0.8, 0.02, 0.1]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>
            <mesh position={[2.5, 0.01, 0]}>
                <boxGeometry args={[0.8, 0.02, 0.1]} />
                <meshStandardMaterial color="#f8f8f8" />
            </mesh>
        </group>
    );
}

function DetailedFloorPlan3D() {
    const groupRef = useRef<THREE.Group>(null!);

    return (
        <group ref={groupRef}>
            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, 4]} />
                <meshStandardMaterial color="#f8f8f8" transparent opacity={0.9} />
            </mesh>

            {/* Exterior walls */}
            <mesh position={[0, 0, -2]}>
                <boxGeometry args={[6, 1, 0.1]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>
            <mesh position={[0, 0, 2]}>
                <boxGeometry args={[6, 1, 0.1]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>
            <mesh position={[-3, 0, 0]}>
                <boxGeometry args={[0.1, 1, 4]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>
            <mesh position={[3, 0, 0]}>
                <boxGeometry args={[0.1, 1, 4]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>

            {/* Interior walls */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 1, 0.1]} />
                <meshStandardMaterial color="#d0d0d0" />
            </mesh>
            <mesh position={[-1.5, 0, 1]}>
                <boxGeometry args={[0.1, 1, 2]} />
                <meshStandardMaterial color="#d0d0d0" />
            </mesh>

            {/* Furniture */}
            <mesh position={[-2.2, 0, -1.2]}>
                <boxGeometry args={[1.2, 0.3, 0.6]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[2.2, 0, -1.2]}>
                <boxGeometry args={[1.0, 0.4, 0.8]} />
                <meshStandardMaterial color="#4169E1" />
            </mesh>
            <mesh position={[-0.5, 0, 1.5]}>
                <boxGeometry args={[0.8, 0.2, 0.4]} />
                <meshStandardMaterial color="#228B22" />
            </mesh>
            <mesh position={[1.8, 0, 1.5]}>
                <boxGeometry args={[0.6, 0.3, 0.6]} />
                <meshStandardMaterial color="#DC143C" />
            </mesh>

            {/* Kitchen island */}
            <mesh position={[0, 0, -0.5]}>
                <boxGeometry args={[1.5, 0.4, 0.8]} />
                <meshStandardMaterial color="#D2691E" />
            </mesh>

            {/* Windows */}
            <mesh position={[-2.8, 0.3, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.8]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>
            <mesh position={[2.8, 0.3, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.8]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
            </mesh>

            {/* Door frames */}
            <mesh position={[-2.5, 0.2, 0]}>
                <boxGeometry args={[0.8, 0.6, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[2.5, 0.2, 0]}>
                <boxGeometry args={[0.8, 0.6, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
        </group>
    );
}

function ConversionAnimation() {
    const [phase, setPhase] = useState(0); // 0: 2D, 1: transitioning, 2: 3D
    const [rotation, setRotation] = useState(0);
    const [height, setHeight] = useState(0);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase((prev) => {
                if (prev === 0) {
                    // Start transition to 3D
                    setTimeout(() => setPhase(1), 2000);
                    return 0;
                } else if (prev === 1) {
                    // Complete transition
                    setTimeout(() => setPhase(2), 3000);
                    return 1;
                } else {
                    // Reset to 2D
                    setTimeout(() => setPhase(0), 4000);
                    return 2;
                }
            });
        }, 9000); // Longer cycle for better viewing

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (phase === 1) {
            // Smoother transition animation
            const duration = 3000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Smoother easing function (ease-in-out-cubic)
                const easeProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                setRotation(easeProgress * Math.PI / 2);
                setHeight(easeProgress * 0.5);
                setScale(1 + easeProgress * 0.1); // Slight scale increase

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        } else if (phase === 0) {
            // Reset to 2D
            setRotation(0);
            setHeight(0);
            setScale(1);
        }
    }, [phase]);

    return (
        <div className="conversion-animation">
            <div className="animation-container">
                <div className="animation-label">
                    {phase === 0 && "2D Floor Plan"}
                    {phase === 1 && "Converting to 3D..."}
                    {phase === 2 && "3D Floor Plan"}
                </div>

                <div className="animation-viewer">
                    <Canvas
                        camera={{ position: [4, 4, 6], fov: 45 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        }}
                    >
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} />
                        <pointLight position={[-5, 5, 5]} intensity={0.6} color="#667eea" />
                        <pointLight position={[5, 5, -5]} intensity={0.6} color="#764ba2" />
                        <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" />

                        <group
                            rotation={[rotation, 0, 0]}
                            position={[0, height, 0]}
                            scale={[scale, scale, scale]}
                        >
                            {phase === 0 || phase === 1 ? <DetailedFloorPlan2D /> : <DetailedFloorPlan3D />}
                        </group>

                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={phase === 2}
                            autoRotate={phase === 2}
                            autoRotateSpeed={0.8}
                            dampingFactor={0.05}
                        />
                    </Canvas>
                </div>

                <div className="animation-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: phase === 0 ? '0%' : phase === 1 ? '50%' : '100%',
                                transition: 'width 3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </div>
                    <div className="progress-text">
                        {phase === 0 && "Ready to convert"}
                        {phase === 1 && "Transforming..."}
                        {phase === 2 && "3D visualization complete"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversionAnimation;
