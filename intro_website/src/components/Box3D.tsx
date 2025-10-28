import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCube() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00aaff" emissive="#0077aa" emissiveIntensity={0.5} />
    </mesh>
  );
}

export default function Box3D() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '500px',
        aspectRatio: '4 / 3',
        margin: '50px auto',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.15)', // translucent white
        backdropFilter: 'blur(20px)',             // frosted glass
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas
        camera={{ position: [2, 2, 5] }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00aaff" />

        {/* Cube */}
        <RotatingCube />

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
