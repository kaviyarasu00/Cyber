import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Shield, Lock, Eye, EyeOff, Mail, User, ArrowRight, Terminal, Cpu, Fingerprint, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- 3D Components (same as before) ---

function FloatingShield({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <MeshDistortMaterial
        color="#39FF14"
        transparent
        opacity={0.6}
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function FloatingLock({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.6, 0.4]} />
        <meshStandardMaterial color="#39FF14" transparent opacity={0.7} emissive="#39FF14" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#39FF14" transparent opacity={0.7} emissive="#39FF14" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function CyberParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#39FF14"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#39FF14" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
      <FloatingShield position={[-4, 1, -2]} />
      <FloatingLock position={[4, 0, -2]} />
      <CyberParticles />
      <gridHelper args={[30, 30, '#39FF14', '#112211']} position={[0, -3, 0]} />
    </>
  );
}

// --- Main Component ---

export default function Login3D() {
  // We only use login from context - signup is handled locally to prevent auto-navigation
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // System State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  
  // Local user database (simulated)
  const [registeredUsers, setRegisteredUsers] = useState<Array<{name: string, email: string, password: string}>>([]);

  // Typing effect for title
  useEffect(() => {
    const text = 'SECURE ACCESS REQUIRED';
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypingEffect(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        
        // First check registered users
        const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (registeredUser) {
          // Use AuthContext login for registered users
          const success = await login(email, password);
          if (success) {
            setSuccess('IDENTITY VERIFIED: ACCESS GRANTED');
            setTimeout(() => {
              setIsExiting(true);
            }, 800);
          } else {
            setError('AUTHENTICATION FAILED: SYSTEM ERROR');
          }
        } else {
          // Try demo login (admin@cyberverse.com / Admin123)
          if (email === 'admin@cyberverse.com' && password === 'Admin123') {
            const success = await login(email, password);
            if (success) {
              setSuccess('IDENTITY VERIFIED: WELCOME ADMIN');
              setTimeout(() => {
                setIsExiting(true);
              }, 800);
            }
          } else {
            setError('AUTHENTICATION FAILED: INVALID CREDENTIALS');
          }
        }
      } else {
        // --- REGISTER LOGIC (Local only, doesn't use AuthContext) ---
        
        // Validation
        if (!name || !email || !password) {
          setError('VALIDATION ERROR: ALL FIELDS REQUIRED');
          setIsSubmitting(false);
          return;
        }

        if (password.length < 6) {
          setError('SECURITY BREACH: PASSWORD MUST BE 6+ CHARS');
          setIsSubmitting(false);
          return;
        }

        // Check if user already exists
        const userExists = registeredUsers.find(u => u.email === email);
        if (userExists) {
          setError('REGISTRATION FAILED: IDENTITY ALREADY EXISTS');
          setIsSubmitting(false);
          return;
        }

        // Create new user (stored locally, NOT logged in)
        const newUser = { name, email, password };
        setRegisteredUsers([...registeredUsers, newUser]);
        
        // Show success and switch to login
        setSuccess('REGISTRATION SUCCESSFUL: PLEASE AUTHENTICATE');
        setIsLogin(true); // Switch to login tab
        setPassword(''); // Clear password for security
        // Keep email filled for convenience
      }
    } catch (err) {
      setError('SYSTEM ERROR: PLEASE TRY AGAIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#05060B] font-mono selection:bg-[#39FF14] selection:text-black transition-all duration-700 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene3D />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05060B] via-transparent to-[#05060B]/50 pointer-events-none" />

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 border-2 border-[#39FF14]/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-2 border border-[#39FF14]/50 rounded-full animate-pulse" />
              <div className="relative w-16 h-16 bg-[#39FF14]/20 border-2 border-[#39FF14] rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#39FF14]" />
              </div>
              <Fingerprint className="absolute -bottom-2 -right-2 w-6 h-6 text-[#39FF14] animate-pulse" />
            </div>
            
            <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white mb-2 tracking-wider">
              CYBERVERSE
            </h1>
            <p className="font-mono text-[#39FF14] text-sm tracking-widest h-6">
              {typingEffect}<span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Form Card */}
          <div className="cyber-card corner-brackets rounded-xl p-6 md:p-8 backdrop-blur-md bg-[#0B0E14]/90 border border-[#39FF14]/20 shadow-[0_0_50px_rgba(57,255,20,0.1)]">
            
            {/* Tabs */}
            <div className="flex mb-6 border-b border-[#39FF14]/20">
              <button
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`flex-1 pb-3 font-orbitron font-bold text-sm tracking-wider transition-all ${
                  isLogin 
                    ? 'text-[#39FF14] border-b-2 border-[#39FF14]' 
                    : 'text-[#A6A9B6] hover:text-white'
                }`}
              >
                <Terminal className="w-4 h-4 inline mr-2" />
                LOGIN
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                className={`flex-1 pb-3 font-orbitron font-bold text-sm tracking-wider transition-all ${
                  !isLogin 
                    ? 'text-[#39FF14] border-b-2 border-[#39FF14]' 
                    : 'text-[#A6A9B6] hover:text-white'
                }`}
              >
                <Cpu className="w-4 h-4 inline mr-2" />
                REGISTER
              </button>
            </div>

            {/* ALERTS */}
            <div className="mb-4 min-h-[60px]">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-orbitron text-xs font-bold text-red-400 mb-1">SYSTEM ALERT</p>
                    <p className="font-mono text-xs text-red-300">{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/50 rounded-lg flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#39FF14] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-orbitron text-xs font-bold text-[#39FF14] mb-1">SUCCESS</p>
                    <p className="font-mono text-xs text-[#cadc21]">{success}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A9B6] group-focus-within:text-[#39FF14] transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Codename (Full Name)"
                    className="w-full pl-12 pr-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A9B6] group-focus-within:text-[#39FF14] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Protocol"
                  className="w-full pl-12 pr-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A9B6] group-focus-within:text-[#39FF14] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Access Key (Password)"
                  className="w-full pl-12 pr-12 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="font-mono text-xs text-[#39FF14] hover:underline hover:text-white transition-colors">
                    Forgot access key?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#39FF14]/10 border border-[#39FF14] rounded-lg font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14] hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-[#39FF14] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out -z-0" />
                
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'ACCESS HQ' : 'INITIALIZE IDENTITY'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Info Footer */}
            <div className="mt-6 pt-4 border-t border-[#39FF14]/10 flex justify-between items-center">
               <p className="font-mono text-[10px] text-[#A6A9B6]">
                 SECURE CONNECTION
               </p>
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse" />
                 <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse delay-75" />
                 <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-pulse delay-150" />
               </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center font-mono text-xs text-[#A6A9B6]">
            DEPLOYATHON 2026 // SYSTEM v2.0.4
          </p>
        </div>
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#39FF14]/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-[#39FF14]/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#39FF14]/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#39FF14]/30" />
    </div>
  );
}