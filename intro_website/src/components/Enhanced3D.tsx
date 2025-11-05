import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function FloorPlan() {
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Floor */}
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[4, 3]} />
                <meshStandardMaterial
                    color={hovered ? "#f0f8ff" : "#ffffff"}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Walls */}
            <mesh position={[0, 0, -1.5]}>
                <boxGeometry args={[4, 1, 0.1]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            <mesh position={[0, 0, 1.5]}>
                <boxGeometry args={[4, 1, 0.1]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            <mesh position={[-2, 0, 0]}>
                <boxGeometry args={[0.1, 1, 3]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>
            <mesh position={[2, 0, 0]}>
                <boxGeometry args={[0.1, 1, 3]} />
                <meshStandardMaterial color="#e0e0e0" />
            </mesh>

            {/* Furniture */}
            <mesh position={[-1, 0, 0]}>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[1, 0, 0]}>
                <boxGeometry args={[0.6, 0.3, 0.6]} />
                <meshStandardMaterial color="#4169E1" />
            </mesh>
        </group>
    );
}

function ModernHouse() {
    const groupRef = useRef<THREE.Group>(null!);
    const [hovered, setHovered] = useState(false);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.003;
        }
    });

    // Center the house around y=0
    // House extends from ~-0.55 to ~2.4, so center offset is -0.925
    const centerOffset = -0.925;

    return (
        <group
            ref={groupRef}
            position={[0, centerOffset, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Foundation */}
            <mesh position={[0, -0.4, 0]}>
                <boxGeometry args={[4, 0.3, 3]} />
                <meshStandardMaterial color="#666666" />
            </mesh>

            {/* Main Structure */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[3.5, 1.2, 2.5]} />
                <meshStandardMaterial color={hovered ? "#e8f4fd" : "#f5f5f5"} />
            </mesh>

            {/* Roof */}
            <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[2.5, 1.2, 4]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Windows */}
            <mesh position={[-1.2, 0.3, 1.26]}>
                <boxGeometry args={[0.6, 0.4, 0.05]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </mesh>
            <mesh position={[1.2, 0.3, 1.26]}>
                <boxGeometry args={[0.6, 0.4, 0.05]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0, 0.3, 1.26]}>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </mesh>

            {/* Door */}
            <mesh position={[0, 0.1, 1.26]}>
                <boxGeometry args={[0.5, 0.8, 0.05]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Chimney */}
            <mesh position={[1, 1.8, 0.5]}>
                <boxGeometry args={[0.3, 0.6, 0.3]} />
                <meshStandardMaterial color="#444444" />
            </mesh>

            {/* Side windows */}
            <mesh position={[-1.76, 0.3, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.6]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </mesh>
            <mesh position={[1.76, 0.3, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.6]} />
                <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}

export default function Enhanced3D() {
    const [currentModel, setCurrentModel] = useState(0);
    const models = ['floorplan', 'modernhouse'];
    const modelNames = ['Floor Plan', 'Modern House'];

    const nextModel = () => {
        setCurrentModel((prev) => (prev + 1) % models.length);
    };

    const prevModel = () => {
        setCurrentModel((prev) => (prev - 1 + models.length) % models.length);
    };

    return (
        <div className="enhanced-3d-container">
            <div className="model-slider">
                <button className="slider-arrow left" onClick={prevModel}>
                    ←
                </button>

                <div className="slider-content">
                    <div className="slider-track" style={{ transform: `translateX(-${currentModel * 100}%)` }}>
                        {models.map((model, index) => (
                            <div key={index} className="slider-slide">
                                <div className="viewer-3d">
                                    <Canvas
                                        camera={{ position: model === 'modernhouse' ? [4, 3, 6] : [3, 3, 5], fov: 50 }}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'block',
                                        }}
                                    >
                                        <Environment preset="apartment" />

                                        {/* Lights */}
                                        <ambientLight intensity={0.4} />
                                        <directionalLight position={[5, 5, 5]} intensity={1} />
                                        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ff6b6b" />
                                        <pointLight position={[5, 5, -5]} intensity={0.5} color="#4ecdc4" />

                                        {/* Models */}
                                        {model === 'floorplan' ? <FloorPlan /> : <ModernHouse />}

                                        {/* Controls */}
                                        <OrbitControls
                                            enableZoom={true}
                                            enablePan={true}
                                            enableRotate={true}
                                            minDistance={2}
                                            maxDistance={10}
                                        />

                                        <ContactShadows
                                            position={model === 'modernhouse' ? [0, -1.5, 0] : [0, -0.5, 0]}
                                            opacity={0.3}
                                            scale={10}
                                            blur={1.5}
                                            far={4.5}
                                        />
                                    </Canvas>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="slider-arrow right" onClick={nextModel}>
                    →
                </button>
            </div>

            <div className="slider-indicators">
                {models.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentModel ? 'active' : ''}`}
                        onClick={() => setCurrentModel(index)}
                    >
                        {modelNames[index]}
                    </button>
                ))}
            </div>

            <div className="viewer-info">
                <h3>Interactive 3D Viewer</h3>
                <p>
                    {currentModel === 0
                        ? "Explore this floor plan layout. Hover over elements to see them highlight. Use mouse to rotate, scroll to zoom."
                        : "Discover this modern house design. Interactive elements respond to your cursor. Navigate with mouse controls."
                    }
                </p>
            </div>
        </div>
    );
}
