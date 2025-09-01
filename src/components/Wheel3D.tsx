import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { WheelSector } from './WheelOfFortune';

interface Wheel3DProps {
  sectors: WheelSector[];
  isSpinning: boolean;
  targetRotation: number;
  onSpinComplete: () => void;
}

const WheelMesh: React.FC<Wheel3DProps> = ({ sectors, isSpinning, targetRotation, onSpinComplete }) => {
  const wheelRef = useRef<THREE.Group>(null);
  const [currentRotation, setCurrentRotation] = useState(0);
  const spinStartTime = useRef<number | null>(null);
  const spinDuration = 8000; // 8 seconds

  const getColorHex = (color: WheelSector['color']): string => {
    const colorMap = {
      red: '#780707',
      green: '#31900c', 
      yellow: '#ddc224',
      gray: '#a5a5a5'
    };
    return colorMap[color];
  };

  useFrame((state) => {
    if (!wheelRef.current) return;

    if (isSpinning) {
      if (!spinStartTime.current) {
        spinStartTime.current = state.clock.getElapsedTime() * 1000;
      }

      const elapsed = (state.clock.getElapsedTime() * 1000) - spinStartTime.current;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function for realistic deceleration
      const easeOut = (t: number): number => {
        return 1 - Math.pow(1 - t, 4);
      };

      const easedProgress = easeOut(progress);
      const rotation = currentRotation + (targetRotation * easedProgress);

      wheelRef.current.rotation.z = rotation;

      if (progress >= 1) {
        spinStartTime.current = null;
        setCurrentRotation(rotation);
        onSpinComplete();
      }
    }
  });

  return (
    <group ref={wheelRef}>
      {/* Outer ring */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[3.2, 3.2, 0.3, 64]} />
        <meshPhongMaterial color="#780707" />
      </mesh>

      {/* Main wheel disc */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 64]} />
        <meshPhongMaterial color="#f0e8e8" />
      </mesh>

      {/* Sectors */}
      {sectors.map((sector, index) => {
        const angle = (Math.PI * 2) / sectors.length;
        const startAngle = angle * index;
        const endAngle = startAngle + angle;
        
        return (
          <group key={sector.id} rotation={[0, 0, startAngle]}>
            {/* Sector mesh */}
            <mesh position={[0, 0, 0.05]}>
              <ringGeometry args={[0.5, 2.8, 0, angle, 32]} />
              <meshPhongMaterial 
                color={getColorHex(sector.color)} 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Sector border */}
            <mesh position={[0, 0, 0.1]} rotation={[0, 0, angle/2]}>
              <boxGeometry args={[0.05, 4.6, 0.1]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Text */}
            <Text
              position={[0, 1.8, 0.15]}
              rotation={[0, 0, angle/2]}
              fontSize={0.25}
              color="white"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {sector.text}
            </Text>
          </group>
        );
      })}

      {/* Center hub */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshPhongMaterial color="#780707" />
      </mesh>
    </group>
  );
};

const Pointer = () => {
  return (
    <mesh position={[0, 3.5, 0.3]} rotation={[0, 0, Math.PI]}>
      <coneGeometry args={[0.2, 0.5, 8]} />
      <meshPhongMaterial color="#780707" />
    </mesh>
  );
};

export const Wheel3D: React.FC<Wheel3DProps> = (props) => {
  return (
    <div className="w-full h-96 relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 0, 10]} intensity={0.5} />
        
        <WheelMesh {...props} />
        <Pointer />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
};