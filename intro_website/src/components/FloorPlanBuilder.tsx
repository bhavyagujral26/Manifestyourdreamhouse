import { Canvas, useFrame } from '@react-three/fiber';
import { useState, useRef, useEffect, Suspense } from 'react';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Component types
type ComponentType = 'wall' | 'door' | 'window' | 'room';

interface FloorPlanComponent {
    id: string;
    type: ComponentType;
    x: number;
    y: number;
    rotation: number;
    width?: number;
    height?: number;
}

// 2D Floor Plan Canvas Component
function FloorPlanCanvas2D({
    components,
    onAddComponent,
    onSelectComponent,
    selectedComponent,
    selectedTool,
    wallStart,
    onWallStartChange
}: {
    components: FloorPlanComponent[];
    onAddComponent: (type: ComponentType, x: number, y: number, endX?: number, endY?: number) => void;
    onSelectComponent: (id: string | null) => void;
    selectedComponent: string | null;
    selectedTool: ComponentType | null;
    wallStart: { x: number; y: number } | null;
    onWallStartChange: (start: { x: number; y: number } | null) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gridSize = 20; // pixels per grid unit
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw components
        components.forEach((comp) => {
            const screenX = comp.x * gridSize;
            const screenY = comp.y * gridSize;
            const isSelected = comp.id === selectedComponent;

            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate((comp.rotation * Math.PI) / 180);

            if (comp.type === 'wall') {
                const width = (comp.width || 1) * gridSize;
                const height = (comp.height || 0.2) * gridSize;
                ctx.fillStyle = isSelected ? '#667eea' : '#333';
                ctx.fillRect(-width / 2, -height / 2, width, height);
                ctx.strokeStyle = isSelected ? '#764ba2' : '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(-width / 2, -height / 2, width, height);
            } else if (comp.type === 'door') {
                ctx.fillStyle = isSelected ? '#8B4513' : '#654321';
                ctx.fillRect(-15, -8, 30, 16);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(-15, -8, 30, 16);
                // Draw door arc
                ctx.beginPath();
                ctx.arc(15, 0, 15, -Math.PI / 2, 0, false);
                ctx.stroke();
            } else if (comp.type === 'window') {
                ctx.fillStyle = isSelected ? '#87CEEB' : '#e0f2ff';
                ctx.fillRect(-20, -6, 40, 12);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(-20, -6, 40, 12);
                // Draw window panes
                ctx.strokeStyle = '#666';
                ctx.beginPath();
                ctx.moveTo(0, -6);
                ctx.lineTo(0, 6);
                ctx.moveTo(-20, 0);
                ctx.lineTo(20, 0);
                ctx.stroke();
            }

            ctx.restore();
        });

        // Draw preview line when drawing wall
        if (selectedTool === 'wall' && wallStart && mousePos) {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(wallStart.x * gridSize, wallStart.y * gridSize);
            ctx.lineTo(mousePos.x * gridSize, mousePos.y * gridSize);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [components, selectedComponent, selectedTool, wallStart, mousePos]);

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / gridSize;
        const y = (e.clientY - rect.top) / gridSize;
        setMousePos({ x, y });
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / gridSize;
        const y = (e.clientY - rect.top) / gridSize;

        // Check if clicking on existing component
        const clickedComponent = components.find((comp) => {
            const dx = comp.x - x;
            const dy = comp.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 0.8;
        });

        if (clickedComponent) {
            onSelectComponent(clickedComponent.id);
        } else if (selectedTool === 'wall') {
            // Wall drawing: start or end point
            if (!wallStart) {
                onWallStartChange({ x, y });
            } else {
                // End wall drawing
                onAddComponent(selectedTool, wallStart.x, wallStart.y, x, y);
                onWallStartChange(null);
            }
        } else if (selectedTool) {
            // Add other components (door, window)
            onSelectComponent(null);
            onAddComponent(selectedTool, x, y);
        } else {
            onSelectComponent(null);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px', border: '3px solid #667eea', borderRadius: '16px', overflow: 'hidden', background: '#fafafa', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <canvas
                ref={canvasRef}
                width={1200}
                height={600}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                style={{ display: 'block', cursor: selectedTool ? 'crosshair' : 'default', width: '100%', height: '100%' }}
            />
        </div>
    );
}

// 3D Renderer Component
function FloorPlan3D({ components }: { components: FloorPlanComponent[] }) {
    const groupRef = useRef<THREE.Group>(null!);
    // Scale factor to convert 2D canvas coordinates to 3D space
    // Canvas coordinates are in grid units (1 unit = 20px), scale down for 3D
    const scaleFactor = 0.1; // Scale down to make components closer together

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.003;
        }
    });

    // Calculate center offset to center the model
    const centerX = components.length > 0
        ? components.reduce((sum, c) => sum + c.x, 0) / components.length
        : 0;
    const centerZ = components.length > 0
        ? components.reduce((sum, c) => sum + c.y, 0) / components.length
        : 0;

    return (
        <group ref={groupRef} position={[-centerX * scaleFactor, 0, -centerZ * scaleFactor]}>
            {components.map((comp) => {
                // Apply scale and center offset
                const x = (comp.x - centerX) * scaleFactor;
                const z = (comp.y - centerZ) * scaleFactor;

                if (comp.type === 'wall') {
                    const width = (comp.width || 1) * scaleFactor;
                    const height = (comp.height || 0.2) * scaleFactor;
                    const depth = 1;

                    return (
                        <mesh
                            key={comp.id}
                            position={[x, depth / 2, z]}
                            rotation={[0, (comp.rotation * Math.PI) / 180, 0]}
                        >
                            <boxGeometry args={[width, depth, height]} />
                            <meshStandardMaterial color="#e0e0e0" />
                        </mesh>
                    );
                } else if (comp.type === 'door') {
                    // Placeholder door - will be replaced with GLB when available
                    return (
                        <mesh
                            key={comp.id}
                            position={[x, 0.5, z]}
                            rotation={[0, (comp.rotation * Math.PI) / 180, 0]}
                        >
                            <boxGeometry args={[0.3, 1, 0.05]} />
                            <meshStandardMaterial color="#8B4513" />
                        </mesh>
                    );
                } else if (comp.type === 'window') {
                    // Placeholder window - will be replaced with GLB when available
                    return (
                        <mesh
                            key={comp.id}
                            position={[x, 0.5, z]}
                            rotation={[0, (comp.rotation * Math.PI) / 180, 0]}
                        >
                            <boxGeometry args={[0.4, 0.4, 0.05]} />
                            <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
                        </mesh>
                    );
                }
                return null;
            })}
        </group>
    );
}

export default function FloorPlanBuilder() {
    const [components, setComponents] = useState<FloorPlanComponent[]>([]);
    const [selectedTool, setSelectedTool] = useState<ComponentType | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
    const [isDrawingWall, setIsDrawingWall] = useState(false);
    const [wallStart, setWallStart] = useState<{ x: number; y: number } | null>(null);

    const handleToolSelect = (tool: ComponentType) => {
        setSelectedTool(tool);
        setSelectedComponent(null);
        if (tool === 'wall') {
            setIsDrawingWall(true);
        } else {
            setIsDrawingWall(false);
            setWallStart(null);
        }
    };

    const handleAddComponent = (type: ComponentType, x: number, y: number, endX?: number, endY?: number) => {
        if (type === 'wall' && endX !== undefined && endY !== undefined) {
            // Create wall from start to end point
            const dx = endX - x;
            const dy = endY - y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const midX = (x + endX) / 2;
            const midY = (y + endY) / 2;

            const newComponent: FloorPlanComponent = {
                id: `comp-${Date.now()}-${Math.random()}`,
                type: 'wall',
                x: midX,
                y: midY,
                rotation: angle,
                width: length,
                height: 0.2,
            };

            setComponents([...components, newComponent]);
            setIsDrawingWall(false);
            setWallStart(null);
        } else {
            // Add single point component (door, window)
            const newComponent: FloorPlanComponent = {
                id: `comp-${Date.now()}-${Math.random()}`,
                type,
                x,
                y,
                rotation: 0,
            };

            setComponents([...components, newComponent]);
        }
    };

    const handleDeleteComponent = () => {
        if (selectedComponent) {
            setComponents(components.filter((comp) => comp.id !== selectedComponent));
            setSelectedComponent(null);
        }
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all components?')) {
            setComponents([]);
            setSelectedComponent(null);
        }
    };

    const tools = [
        { type: 'wall' as ComponentType, icon: '🧱', label: 'Wall' },
        { type: 'door' as ComponentType, icon: '🚪', label: 'Door' },
        { type: 'window' as ComponentType, icon: '🪟', label: 'Window' },
    ];

    return (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '20px auto', padding: '0 20px' }}>
            {/* Professional Toolbar - Tux Paint Style */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #ffffff, #f8f9ff)',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '25px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                }}
            >
                {/* Tool Palette - Large Colorful Buttons */}
                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '15px', fontWeight: '600' }}>
                        🛠️ Tools
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {tools.map((tool) => (
                            <button
                                key={tool.type}
                                onClick={() => handleToolSelect(tool.type)}
                                style={{
                                    padding: '20px 30px',
                                    borderRadius: '16px',
                                    border: selectedTool === tool.type
                                        ? '4px solid #667eea'
                                        : '3px solid #ddd',
                                    background: selectedTool === tool.type
                                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                        : 'linear-gradient(135deg, #ffffff, #f5f5f5)',
                                    color: selectedTool === tool.type ? 'white' : '#333',
                                    cursor: 'pointer',
                                    fontSize: '1.3rem',
                                    fontWeight: '700',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minWidth: '120px',
                                    boxShadow: selectedTool === tool.type
                                        ? '0 8px 20px rgba(102, 126, 234, 0.4)'
                                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transform: selectedTool === tool.type ? 'scale(1.05)' : 'scale(1)',
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedTool !== tool.type) {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedTool !== tool.type) {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '2.5rem' }}>{tool.icon}</span>
                                <span style={{ fontSize: '0.9rem' }}>{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* View Controls and Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    paddingTop: '20px',
                    borderTop: '2px solid rgba(0, 0, 0, 0.1)'
                }}>

                    {/* View Mode Toggle */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            onClick={() => setViewMode('2d')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: viewMode === '2d' ? '3px solid #667eea' : '2px solid #ddd',
                                background: viewMode === '2d'
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                    : 'white',
                                color: viewMode === '2d' ? 'white' : '#333',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            📐 2D Design
                        </button>
                        <button
                            onClick={() => setViewMode('3d')}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: viewMode === '3d' ? '3px solid #667eea' : '2px solid #ddd',
                                background: viewMode === '3d'
                                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                    : 'white',
                                color: viewMode === '3d' ? 'white' : '#333',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            🎨 3D Preview
                        </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {selectedComponent && (
                            <button
                                onClick={handleDeleteComponent}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    border: '3px solid #ff4444',
                                    background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                🗑️ Delete
                            </button>
                        )}
                        <button
                            onClick={handleClearAll}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '2px solid #666',
                                background: 'white',
                                color: '#666',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            🧹 Clear All
                        </button>
                    </div>
                </div>

                {/* Instructions - Tux Paint Style */}
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    color: '#333',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>💡</span>
                        <strong style={{ fontSize: '1.1rem' }}>How to Use:</strong>
                    </div>
                    <ul style={{ margin: '10px 0', paddingLeft: '25px', lineHeight: '1.8' }}>
                        <li><strong>Wall Tool:</strong> Click to start, click again to finish drawing a wall</li>
                        <li><strong>Door/Window:</strong> Select tool, then click on canvas to place</li>
                        <li><strong>Select:</strong> Click on any component to select and delete it</li>
                        <li><strong>3D View:</strong> Switch to see your design in 3D!</li>
                    </ul>
                </div>
            </div>

            {/* Canvas/Viewer - Large Professional Area */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #ffffff, #f8f9ff)',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                }}
            >
                {viewMode === '2d' ? (
                    <FloorPlanCanvas2D
                        components={components}
                        onAddComponent={handleAddComponent}
                        onSelectComponent={setSelectedComponent}
                        selectedComponent={selectedComponent}
                        selectedTool={selectedTool}
                        wallStart={wallStart}
                        onWallStartChange={setWallStart}
                    />
                ) : (
                    <div
                        style={{
                            width: '100%',
                            height: '600px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            background: '#f0f0f0',
                            border: '3px solid #667eea',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                            <Suspense fallback={null}>
                                <Environment preset="apartment" />
                                <ambientLight intensity={0.6} />
                                <directionalLight position={[5, 8, 5]} intensity={1} />
                                <pointLight position={[-5, 5, 5]} intensity={0.5} color="#667eea" />
                                <pointLight position={[5, 5, -5]} intensity={0.5} color="#764ba2" />

                                {/* Floor */}
                                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[50, 50]} />
                                    <meshStandardMaterial color="#ffffff" />
                                </mesh>

                                <FloorPlan3D components={components} />

                                <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={50} blur={1.5} />
                                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} minDistance={2} maxDistance={15} />
                            </Suspense>
                        </Canvas>
                    </div>
                )}
            </div>

            {/* Component Count */}
            <div style={{ marginTop: '15px', textAlign: 'center', color: '#666' }}>
                {components.length > 0 ? (
                    <p>Total components: {components.length}</p>
                ) : (
                    <p>Start by selecting a tool and clicking on the canvas to add components</p>
                )}
            </div>
        </div>
    );
}

