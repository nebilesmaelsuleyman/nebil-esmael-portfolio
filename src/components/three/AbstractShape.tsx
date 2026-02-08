import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron, Float } from '@react-three/drei';
import * as THREE from 'three';

export const AbstractShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const primaryColor = useMemo(() => new THREE.Color('#3b82f6'), []);
  const secondaryColor = useMemo(() => new THREE.Color('#10b981'), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[2, 4]} scale={1.5}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={secondaryColor}
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.9}
        />
      </Icosahedron>
      
      {/* Outer wireframe */}
      <Icosahedron args={[2.2, 2]} scale={1.5}>
        <meshBasicMaterial
          color={primaryColor}
          wireframe
          transparent
          opacity={0.3}
        />
      </Icosahedron>
      
      {/* Inner glow sphere */}
      <mesh scale={1}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.1}
        />
      </mesh>
    </Float>
  );
};
