import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ComputerModel } from './ComputerModel';

export const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4.5]} fov={38} />

          {/* Ambient */}
          <ambientLight intensity={0.4} />

          {/* Key light */}
          <directionalLight position={[3, 4, 5]} intensity={1} color="#ffffff" />

          {/* Blue accent light */}
          <pointLight position={[-3, 2, 1]} intensity={0.6} color="#3b82f6" />

          {/* Green accent */}
          <pointLight position={[2, 3, -2]} intensity={0.4} color="#10b981" />

          {/* Screen glow */}
          <pointLight position={[0, 1.5, 1]} intensity={0.3} color="#3b82f6" distance={3} />

          <ComputerModel />
        </Suspense>
      </Canvas>
    </div>
  );
};
