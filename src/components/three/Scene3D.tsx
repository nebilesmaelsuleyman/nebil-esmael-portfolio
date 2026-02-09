import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ComputerModel } from './ComputerModel';

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={45} />

          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />

          {/* Key light */}
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#3b82f6" />

          {/* Fill light */}
          <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#10b981" />

          {/* Rim light */}
          <pointLight position={[0, 5, -5]} intensity={0.6} color="#ffffff" />

          <ComputerModel />
        </Suspense>
      </Canvas>
    </div>
  );
};
