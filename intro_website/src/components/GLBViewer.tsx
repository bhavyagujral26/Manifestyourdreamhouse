import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, Suspense, useState } from 'react';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    wallColor: string;
}

function Model({ wallColor }: ModelProps) {
    // Use import.meta.env.BASE_URL to handle base path in dev and production
    const modelPath = `${import.meta.env.BASE_URL}Models/17.glb`.replace(/\/\//g, '/');
    const { scene } = useGLTF(modelPath);
    const ref = useRef<THREE.Group>(null!);
    const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

    useEffect(() => {
        if (!scene) return;

        try {
            // Wait a frame to ensure scene is fully loaded
            const timer = setTimeout(() => {
                try {
                    // Calculate bounding box to auto-scale the model
                    const box = new THREE.Box3().setFromObject(scene);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    // Check if size is valid
                    if (size.x > 0 || size.y > 0 || size.z > 0) {
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = maxDim > 0 ? 2.5 / maxDim : 1; // Scale to fit nicely

                        // Center the model
                        scene.position.x = -center.x;
                        scene.position.y = -center.y;
                        scene.position.z = -center.z;

                        // Apply scale
                        scene.scale.set(scale, scale, scale);
                    }

                    // Collect all materials that might be walls (typically larger meshes)
                    // Traverse the scene and collect materials
                    materialsRef.current = [];
                    scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            const materials = Array.isArray(child.material)
                                ? child.material
                                : [child.material];

                            materials.forEach((material) => {
                                // Handle different material types
                                if (material instanceof THREE.MeshStandardMaterial ||
                                    material instanceof THREE.MeshBasicMaterial ||
                                    material instanceof THREE.MeshLambertMaterial ||
                                    material instanceof THREE.MeshPhongMaterial) {

                                    // Check if it's likely a wall (larger geometry, not too small)
                                    const geometry = child.geometry;
                                    if (geometry instanceof THREE.BufferGeometry) {
                                        geometry.computeBoundingBox();
                                        const box = geometry.boundingBox;
                                        if (box) {
                                            const size = box.getSize(new THREE.Vector3());
                                            const maxDim = Math.max(size.x, size.y, size.z);
                                            // Consider walls as meshes with at least 0.3 units in one dimension
                                            // This should catch most wall structures
                                            if (maxDim > 0.3) {
                                                // Only add if not already in the array
                                                if (!materialsRef.current.includes(material)) {
                                                    materialsRef.current.push(material);
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                } catch (err) {
                    console.error('Error scaling model:', err);
                }
            }, 150);

            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Error processing 3D model:', error);
        }
    }, [scene]);

    // Update wall colors when color changes
    useEffect(() => {
        if (materialsRef.current.length > 0) {
            const color = new THREE.Color(wallColor);
            materialsRef.current.forEach((material) => {
                material.color.copy(color);
                material.needsUpdate = true;
            });
        }
    }, [wallColor]);

    // Optional: Add slow rotation animation
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.003;
        }
    });

    if (!scene) return null;

    return (
        <primitive
            ref={ref}
            object={scene}
            position={[0, 0, 0]}
        />
    );
}

// Preload the model - use BASE_URL for correct path
const modelPath = `${import.meta.env.BASE_URL}Models/17.glb`.replace(/\/\//g, '/');
useGLTF.preload(modelPath);

function LoadingFallback() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }}>
            <p>Loading 3D model...</p>
        </div>
    );
}

export default function GLBViewer() {
    const [wallColor, setWallColor] = useState('#f5f5f5');
    const [customColor, setCustomColor] = useState('#f5f5f5');

    const presetColors = [
        { name: 'White', color: '#ffffff' },
        { name: 'Cream', color: '#f5f5f5' },
        { name: 'Beige', color: '#f0e6d2' },
        { name: 'Light Blue', color: '#e3f2fd' },
        { name: 'Light Green', color: '#e8f5e9' },
        { name: 'Light Pink', color: '#fce4ec' },
        { name: 'Light Gray', color: '#e0e0e0' },
        { name: 'Custom', color: customColor },
    ];

    const handleColorChange = (color: string) => {
        setWallColor(color);
        if (color !== customColor) {
            setCustomColor(color);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: '40px auto 20px' }}>
            {/* Color Picker Controls */}
            <div
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h3 style={{ marginBottom: '15px', color: '#222', fontSize: '1.2rem', fontWeight: '600' }}>
                    Wall Color
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    {presetColors.slice(0, 7).map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handleColorChange(preset.color)}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                border: wallColor === preset.color ? '3px solid #667eea' : '2px solid rgba(0,0,0,0.1)',
                                background: preset.color,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: wallColor === preset.color ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                transform: wallColor === preset.color ? 'scale(1.1)' : 'scale(1)',
                            }}
                            title={preset.name}
                        />
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                        <input
                            type="color"
                            value={customColor}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                setCustomColor(newColor);
                                handleColorChange(newColor);
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                border: wallColor === customColor ? '3px solid #667eea' : '2px solid rgba(0,0,0,0.1)',
                                boxShadow: wallColor === customColor ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                                padding: '0',
                            }}
                            title="Custom Color"
                        />
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>Custom</span>
                    </div>
                </div>
            </div>

            {/* 3D Canvas */}
            <div
                style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 50px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }}
            >
                <Canvas
                    camera={{ position: [4, 4, 6], fov: 45 }}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }}
                >
                    <Suspense fallback={null}>
                        <Environment preset="apartment" />

                        {/* Enhanced Lighting */}
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 8, 5]} intensity={1.2} />
                        <pointLight position={[-5, 5, 5]} intensity={0.6} color="#667eea" />
                        <pointLight position={[5, 5, -5]} intensity={0.6} color="#764ba2" />
                        <pointLight position={[0, 10, 0]} intensity={0.4} color="#ffffff" />

                        {/* GLB Model */}
                        <Model wallColor={wallColor} />

                        {/* Shadows */}
                        <ContactShadows
                            position={[0, -1, 0]}
                            opacity={0.25}
                            scale={12}
                            blur={2}
                            far={5}
                        />

                        {/* Controls */}
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                            minDistance={3}
                            maxDistance={12}
                            autoRotate={false}
                            autoRotateSpeed={0.5}
                            dampingFactor={0.05}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}

