import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text3D, Center, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedText() {
  const textRef = useRef<THREE.Group>(null);

  return (
    <group ref={textRef}>
      <Float
        speed={1.5}
        rotationIntensity={0.3}
        floatIntensity={0.3}
      >
        <Center>
          {/* Main 3D Text */}
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.8}
            height={0.2}
            curveSegments={32}
            bevelEnabled
            bevelThickness={0.05}
            bevelSize={0.03}
            bevelOffset={0}
            bevelSegments={8}
          >
            TM-BRAND
            <meshStandardMaterial
              color="#bfff00"
              emissive="#bfff00"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
              envMapIntensity={1.5}
            />
          </Text3D>
          
          {/* Glow outline behind */}
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.82}
            height={0.1}
            curveSegments={16}
            position={[0, 0, -0.15]}
          >
            TM-BRAND
            <meshBasicMaterial
              color="#bfff00"
              transparent
              opacity={0.3}
            />
          </Text3D>
        </Center>
      </Float>

      {/* Decorative rings around text */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#bfff00"
          emissive="#bfff00"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[3, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#bfff00"
          emissive="#bfff00"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 2 + Math.random() * 1;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 2;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color="#bfff00"
              emissive="#bfff00"
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export const Hero3DText = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Multiple glow layers for depth */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* 3D Text Canvas */}
      <div className="relative z-10 w-full h-[400px]">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting Setup */}
          <ambientLight intensity={0.3} />
          
          {/* Key lights from multiple angles */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={2}
            color="#ffffff"
          />
          <directionalLight 
            position={[-5, 3, -5]} 
            intensity={1}
            color="#bfff00"
          />
          
          {/* Accent lights */}
          <spotLight 
            position={[0, 8, 0]} 
            intensity={1.5} 
            angle={0.6}
            penumbra={0.5}
            color="#bfff00"
          />
          
          <pointLight position={[0, 0, 5]} intensity={2} color="#bfff00" distance={10} />
          <pointLight position={[-5, 0, -5]} intensity={1} color="#ffffff" distance={15} />
          <pointLight position={[5, 0, -5]} intensity={1} color="#ffffff" distance={15} />
          
          {/* Environment for realistic reflections */}
          <Environment preset="night" />
          
          {/* 3D Text Component */}
          <AnimatedText />
          
          {/* Ground shadows */}
          <ContactShadows
            position={[0, -3, 0]}
            opacity={0.6}
            scale={15}
            blur={2.5}
            far={4}
            color="#bfff00"
          />
          
          {/* Interactive Controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* Additional animated glow accents */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.8s' }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.2s' }} />
    </div>
  );
};