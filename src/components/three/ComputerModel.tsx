import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/desktop_computer.glb');

export const ComputerModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/desktop_computer.glb');

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, -1, 0]} scale={1.8}>
        <primitive object={scene} />
      </group>
    </Float>
  );
};
