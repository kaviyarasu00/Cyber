import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Interactive Neural Network that responds to mouse
function InteractiveNeuralNetwork() {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse, viewport } = useThree();
  
  const particleCount = 100;
  const connectionDistance = 4;
  
  const { positions, connections, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const connections: number[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 15;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }
    
    // Pre-calculate connections
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < connectionDistance) {
          connections.push(i, j);
        }
      }
    }
    
    return { positions, connections, originalPositions };
  }, []);
  
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(connections.length * 3);
    
    for (let i = 0; i < connections.length; i += 2) {
      const idx1 = connections[i];
      const idx2 = connections[i + 1];
      
      linePositions[i * 3] = positions[idx1 * 3];
      linePositions[i * 3 + 1] = positions[idx1 * 3 + 1];
      linePositions[i * 3 + 2] = positions[idx1 * 3 + 2];
      
      linePositions[i * 3 + 3] = positions[idx2 * 3];
      linePositions[i * 3 + 4] = positions[idx2 * 3 + 1];
      linePositions[i * 3 + 5] = positions[idx2 * 3 + 2];
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [connections, positions]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
      
      // Mouse interaction - particles follow mouse slightly
      const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
      const mouseX = mouse.x * viewport.width * 0.3;
      const mouseY = mouse.y * viewport.height * 0.3;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const origX = originalPositions[idx];
        const origY = originalPositions[idx + 1];
        
        // Calculate distance to mouse
        const dx = origX - mouseX;
        const dy = origY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Particles are attracted to mouse
        const attractionStrength = Math.max(0, 1 - dist / 10) * 0.3;
        
        posArray[idx] = origX + (mouseX - origX) * attractionStrength + Math.sin(state.clock.elapsedTime + i) * 0.1;
        posArray[idx + 1] = origY + (mouseY - origY) * attractionStrength + Math.cos(state.clock.elapsedTime + i) * 0.1;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });
  
  return (
    <group>
      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#39FF14" 
          transparent 
          opacity={0.12} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      
      {/* Nodes */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#39FF14"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Floating data particles with mouse interaction
function InteractiveDataParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 35;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.003;
      
      // Mouse parallax effect
      meshRef.current.position.x = mouse.x * viewport.width * 0.05;
      meshRef.current.position.y = mouse.y * viewport.height * 0.05;
      
      const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.003;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#39FF14"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Animated cyber rings
function AnimatedCyberRings() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ring1Ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2.2 + Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      ring2Ref.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 1.8 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      ring3Ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[7, 0.03, 16, 100]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[8.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[10, 0.015, 16, 100]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Floating 3D shields
function FloatingShields() {
  const shield1Ref = useRef<THREE.Mesh>(null);
  const shield2Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (shield1Ref.current) {
      shield1Ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
      shield1Ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      shield1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (shield2Ref.current) {
      shield2Ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.4;
      shield2Ref.current.rotation.y = -state.clock.elapsedTime * 0.25;
      shield2Ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });
  
  return (
    <>
      <mesh ref={shield1Ref} position={[-12, 2, -5]}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={shield2Ref} position={[12, -2, -5]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.25} wireframe />
      </mesh>
    </>
  );
}

// Main scene component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#39FF14" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ff88" />
      <InteractiveNeuralNetwork />
      <InteractiveDataParticles />
      <AnimatedCyberRings />
      <FloatingShields />
    </>
  );
}

// Fallback for non-WebGL browsers
function FallbackBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grid-floor" />
      {/* Static particles */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#39FF14] rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      {/* Floating geometric shapes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`shape-${i}`}
          className="absolute border border-[#39FF14]/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ParticleBackground() {
  const [webglSupported, setWebglSupported] = useState(true);
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);
  
  if (!webglSupported) {
    return <FallbackBackground />;
  }
  
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene />
      </Canvas>
      <div className="grid-floor" />
    </div>
  );
}
