import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import hoodieTexture from '@/assets/hoodie-texture.png';
import hoodieNormal from '@/assets/hoodie-normal.png';

/**
 * Realistic 3D Hoodie Component
 * 
 * TO USE A GLB/GLTF MODEL:
 * 1. Place your .glb file in public/models/hoodie.glb
 * 2. Uncomment the GLTFLoader section below
 * 3. Comment out the procedural hoodie meshes
 */

function RealisticHoodie() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load textures
  const texture = useTexture(hoodieTexture);
  const normalMap = useTexture(hoodieNormal);

  // Configure textures
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;

  // Material configuration for realistic fabric
  const fabricMaterial = (
    <meshStandardMaterial
      map={texture}
      normalMap={normalMap}
      normalScale={new THREE.Vector2(0.5, 0.5)}
      roughness={0.8}
      metalness={0.05}
      envMapIntensity={0.5}
    />
  );

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Main body - torso */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 3.2, 0.9]} />
        {fabricMaterial}
      </mesh>

      {/* Hood - layered for depth */}
      <mesh position={[0, 2.5, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.4, 1.2]} />
        {fabricMaterial}
      </mesh>
      
      {/* Hood inner layer */}
      <mesh position={[0, 2.5, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.2, 0.9]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-2.1, 0.6, 0]} rotation={[0, 0, 0.25]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 2.5, 16]} />
        {fabricMaterial}
      </mesh>

      {/* Right sleeve */}
      <mesh position={[2.1, 0.6, 0]} rotation={[0, 0, -0.25]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 2.5, 16]} />
        {fabricMaterial}
      </mesh>

      {/* Front pocket */}
      <mesh position={[0, -0.6, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1, 0.2]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.85} normalMap={normalMap} />
      </mesh>

      {/* Drawstrings */}
      <mesh position={[-0.3, 2.8, 0.8]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 2.8, 0.8]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.6} />
      </mesh>

      {/* Ribbed cuffs - bottom */}
      <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.3, 1.2, 0.3, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* tm-brand logo with glow effect */}
      <mesh position={[0, 0.8, 0.5]}>
        <planeGeometry args={[1.5, 0.6]} />
        <meshStandardMaterial
          color="#bfff00"
          emissive="#bfff00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Logo text shadow/depth */}
      <mesh position={[0, 0.8, 0.48]}>
        <planeGeometry args={[1.52, 0.62]} />
        <meshStandardMaterial color="#000000" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

export const HeroHoodie = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow effect behind hoodie */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      {/* 3D Hoodie Canvas */}
      <div className="relative z-10 w-80 h-80 md:w-96 md:h-96">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.4} />
          
          {/* Key light */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Fill light */}
          <directionalLight position={[-5, 3, -5]} intensity={0.6} />
          
          {/* Rim light for depth */}
          <spotLight 
            position={[0, 8, -5]} 
            intensity={0.8} 
            angle={0.5}
            penumbra={0.5}
            color="#bfff00"
          />
          
          {/* Point light for logo glow */}
          <pointLight position={[0, 0, 3]} intensity={1.2} color="#bfff00" distance={5} />
          
          {/* Environment for realistic reflections */}
          <Environment preset="city" />
          
          {/* 3D Hoodie */}
          <RealisticHoodie />
          
          {/* Contact Shadows for ground effect */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.5}
            scale={8}
            blur={2}
            far={4}
          />
          
          {/* Interactive Controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={6}
            maxDistance={15}
            autoRotate
            autoRotateSpeed={0.8}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Additional glow accents */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};
