import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ComputerModel } from './ComputerModel';

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={40} />

          {/* Ambient lighting */}
          <ambientLight intensity={0.6} />

          {/* Key light */}
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" castShadow />

          {/* Fill light */}
          <directionalLight position={[-3, 2, -3]} intensity={0.5} color="#3b82f6" />

          {/* Rim light */}
          <pointLight position={[0, 5, -5]} intensity={0.8} color="#10b981" />

          {/* Bottom fill */}
          <pointLight position={[0, -2, 3]} intensity={0.3} color="#ffffff" />

          <ComputerModel />
        </Suspense>
      </Canvas>
    </div>
  );
};
