import { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Text,
  Box,
  Sphere,
  Torus,
  Trail,
  PerspectiveCamera
} from '@react-three/drei';
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Lock, 
  Zap, 
  Target, 
  Trophy,
  Activity,
  Code,
  Brain,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gamepad2,
  Bug,
  Wifi,
  Unlock
} from 'lucide-react';
import * as THREE from 'three';
import { gsap } from 'gsap';

// --- SIMPLIFIED 3D BACKGROUND COMPONENTS (WITH FALLBACK) ---

function CyberGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[30, 30, 40, 40]} />
      <meshBasicMaterial 
        color="#39FF14" 
        wireframe 
        transparent 
        opacity={0.1}
      />
    </mesh>
  );
}

function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const cubes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10] as [number, number, number],
      color: i % 3 === 0 ? '#39FF14' : i % 3 === 1 ? '#00BFFF' : '#FF00FF',
      scale: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {cubes.map((cube) => (
        <Float key={cube.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Box position={cube.position} scale={cube.scale}>
            <meshBasicMaterial color={cube.color} wireframe transparent opacity={0.6} />
          </Box>
        </Float>
      ))}
    </group>
  );
}

function Scene3D() {
  return (
    <>
      <color attach="background" args={['#05060B']} />
      <fog attach="fog" args={['#05060B', 8, 25]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#39FF14" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00BFFF" />
      
      <CyberGrid />
      <FloatingCubes />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// --- GAME COMPONENTS ---

interface GameStats {
  score: number;
  level: number;
  streak: number;
  accuracy: number;
  totalPlayed: number;
  bestScore: number;
}

interface GameSession {
  id: string;
  gameType: 'firewall' | 'crypto' | 'neural' | 'breach';
  score: number;
  accuracy: number;
  duration: number;
  timestamp: Date;
}

const initialStats: GameStats = {
  score: 0,
  level: 1,
  streak: 0,
  accuracy: 0,
  totalPlayed: 0,
  bestScore: 0,
};

// FIREWALL DEFENSE GAME
function FirewallGame({ onScore, onComplete }: { onScore: (points: number) => void; onComplete: (stats: any) => void }) {
  const [threats, setThreats] = useState<Array<{id: number; type: 'virus' | 'malware' | 'ddos'; x: number; y: number; speed: number}>>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setGameTime(t => {
        if (t <= 1) {
          setIsPlaying(false);
          onComplete({ score, accuracy: 100 });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, score, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const spawnInterval = setInterval(() => {
      const types: ('virus' | 'malware' | 'ddos')[] = ['virus', 'malware', 'ddos'];
      const newThreat = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        x: Math.random() * 90 + 5,
        y: -10,
        speed: Math.random() * 2 + 1,
      };
      setThreats(prev => [...prev, newThreat]);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const moveInterval = setInterval(() => {
      setThreats(prev => {
        const updated = prev.map(t => ({ ...t, y: t.y + t.speed }));
        const reachedBottom = updated.filter(t => t.y > 100);
        if (reachedBottom.length > 0) {
          setLives(l => {
            const newLives = l - reachedBottom.length;
            if (newLives <= 0) {
              setIsPlaying(false);
              onComplete({ score, accuracy: Math.max(0, 100 - reachedBottom.length * 10) });
            }
            return Math.max(0, newLives);
          });
        }
        return updated.filter(t => t.y <= 100);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying, score, onComplete]);

  const handleThreatClick = (id: number, type: string) => {
    const points = type === 'ddos' ? 30 : type === 'malware' ? 20 : 10;
    setScore(s => {
      const newScore = s + points;
      onScore(points);
      return newScore;
    });
    setThreats(prev => prev.filter(t => t.id !== id));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setGameTime(60);
    setThreats([]);
  };

  return (
    <div className="relative w-full h-full bg-[#0B0E14]/95 rounded-lg overflow-hidden border border-[#39FF14]/30">
      {/* Game Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-[#05060B] to-transparent z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#39FF14]" />
            <span className="font-orbitron text-[#39FF14] text-xl">{lives}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-orbitron text-white text-xl">{score}</span>
          </div>
        </div>
        <div className="font-mono text-[#39FF14] text-2xl">{gameTime}s</div>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-full">
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05060B]/90 backdrop-blur-sm">
            <Shield className="w-16 h-16 text-[#39FF14] mb-4 animate-pulse" />
            <h3 className="font-orbitron text-2xl text-white mb-2">FIREWALL DEFENSE</h3>
            <p className="font-mono text-[#A6A9B6] mb-6 text-center max-w-md px-4">
              Block incoming cyber threats before they breach the system. Click viruses, malware, and DDoS attacks to neutralize them.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all"
            >
              <Play className="w-5 h-5" />
              INITIATE DEFENSE
            </button>
          </div>
        ) : (
          <>
            {threats.map(threat => (
              <button
                key={threat.id}
                onClick={() => handleThreatClick(threat.id, threat.type)}
                className="absolute transform -translate-x-1/2 transition-transform hover:scale-110 cursor-pointer"
                style={{ left: `${threat.x}%`, top: `${threat.y}%` }}
              >
                {threat.type === 'virus' && <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />}
                {threat.type === 'malware' && <Bug className="w-8 h-8 text-yellow-500 animate-bounce" />}
                {threat.type === 'ddos' && <Server className="w-10 h-10 text-purple-500 animate-pulse" />}
              </button>
            ))}
            
            {/* Defense Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-50" />
          </>
        )}
      </div>
    </div>
  );
}

// CRYPTO DECRYPTION GAME
function CryptoGame({ onScore, onComplete }: { onScore: (points: number) => void; onComplete: (stats: any) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [isShowing, setIsShowing] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'input' | 'complete'>('idle');

  const symbols = ['◆', '▲', '■', '●', '★', '♦'];

  const startRound = () => {
    const newSequence = Array.from({ length: 3 + round }, () => symbols[Math.floor(Math.random() * symbols.length)]);
    setSequence(newSequence);
    setPlayerInput([]);
    setIsShowing(true);
    setGameState('showing');
    
    let i = 0;
    const interval = setInterval(() => {
      if (i >= newSequence.length) {
        clearInterval(interval);
        setIsShowing(false);
        setGameState('input');
      }
      i++;
    }, 800);
  };

  const handleSymbolClick = (symbol: string) => {
    if (gameState !== 'input') return;
    
    const newInput = [...playerInput, symbol];
    setPlayerInput(newInput);

    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setGameState('complete');
      onComplete({ score, accuracy: (round - 1) * 10 });
      return;
    }

    if (newInput.length === sequence.length) {
      const points = round * 50;
      setScore(s => {
        const newScore = s + points;
        onScore(points);
        return newScore;
      });
      setRound(r => r + 1);
      setTimeout(startRound, 1000);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0B0E14]/95 rounded-lg overflow-hidden border border-[#00BFFF]/30 flex flex-col">
      <div className="p-4 border-b border-[#00BFFF]/20 flex justify-between items-center">
        <div className="font-orbitron text-[#00BFFF] text-xl">ROUND {round}</div>
        <div className="font-orbitron text-white text-xl">{score}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {gameState === 'idle' && (
          <div className="text-center">
            <Lock className="w-16 h-16 text-[#00BFFF] mx-auto mb-4 animate-pulse" />
            <h3 className="font-orbitron text-2xl text-white mb-2">CRYPTO DECRYPTION</h3>
            <p className="font-mono text-[#A6A9B6] mb-6">Memorize the sequence and repeat it to decrypt the system.</p>
            <button
              onClick={startRound}
              className="px-6 py-3 bg-[#00BFFF]/20 border border-[#00BFFF] rounded-lg font-orbitron text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black transition-all"
            >
              START DECRYPTION
            </button>
          </div>
        )}

        {gameState === 'showing' && (
          <div className="text-center">
            <div className="font-mono text-[#00BFFF] mb-8 animate-pulse">MEMORIZE SEQUENCE...</div>
            <div className="flex gap-4 justify-center">
              {sequence.map((sym, i) => (
                <div
                  key={i}
                  className={`w-16 h-16 border-2 border-[#00BFFF] rounded-lg flex items-center justify-center text-3xl text-[#00BFFF] font-bold transition-all ${
                    i < playerInput.length ? 'bg-[#00BFFF]/20' : 'bg-transparent'
                  }`}
                >
                  {sym}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'input' && (
          <div className="text-center">
            <div className="font-mono text-[#39FF14] mb-8">REPEAT SEQUENCE</div>
            <div className="flex gap-2 mb-8 justify-center min-h-[64px]">
              {playerInput.map((sym, i) => (
                <div key={i} className="w-16 h-16 border-2 border-[#39FF14] bg-[#39FF14]/20 rounded-lg flex items-center justify-center text-3xl text-[#39FF14] font-bold">
                  {sym}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {symbols.map(sym => (
                <button
                  key={sym}
                  onClick={() => handleSymbolClick(sym)}
                  className="w-16 h-16 border border-[#00BFFF]/50 rounded-lg flex items-center justify-center text-2xl text-[#00BFFF] hover:bg-[#00BFFF]/20 hover:border-[#00BFFF] transition-all active:scale-95"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'complete' && (
          <div className="text-center">
            <Unlock className="w-16 h-16 text-[#39FF14] mx-auto mb-4" />
            <h3 className="font-orbitron text-2xl text-white mb-2">SYSTEM DECRYPTED</h3>
            <p className="font-orbitron text-[#39FF14] text-xl mb-4">Final Score: {score}</p>
            <button
              onClick={() => {
                setRound(1);
                setScore(0);
                setGameState('idle');
              }}
              className="px-6 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// NEURAL NETWORK GAME
function NeuralGame({ onScore, onComplete }: { onScore: (points: number) => void; onComplete: (stats: any) => void }) {
  const [nodes, setNodes] = useState<Array<{id: number; active: boolean; x: number; y: number}>>([]);
  const [connections, setConnections] = useState<Array<{from: number; to: number; active: boolean}>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          onComplete({ score, accuracy: Math.min(100, score / 5) });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, score, onComplete]);

  const initGame = () => {
    const newNodes = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      active: false,
      x: (i % 4) * 25 + 12.5,
      y: Math.floor(i / 4) * 30 + 15,
    }));
    setNodes(newNodes);
    
    const newConnections = [];
    for (let i = 0; i < 8; i++) {
      newConnections.push({
        from: i,
        to: i + 4,
        active: Math.random() > 0.5,
      });
    }
    setConnections(newConnections);
    setScore(0);
    setTimeLeft(45);
    setIsPlaying(true);
  };

  const handleNodeClick = (id: number) => {
    if (!isPlaying) return;
    
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const activeConnections = connections.filter(c => c.to === id && c.active);
    if (activeConnections.length > 0 || id < 4) {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, active: true } : n));
      const points = activeConnections.length * 20 + 10;
      setScore(s => {
        const newScore = s + points;
        onScore(points);
        return newScore;
      });
      
      setConnections(prev => prev.map(c => 
        c.from === id ? { ...c, active: Math.random() > 0.3 } : c
      ));
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0B0E14]/95 rounded-lg overflow-hidden border border-[#FF00FF]/30 flex flex-col">
      <div className="p-4 border-b border-[#FF00FF]/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#FF00FF]" />
          <span className="font-orbitron text-[#FF00FF]">NEURAL SYNC</span>
        </div>
        <div className="font-orbitron text-white">{timeLeft}s</div>
      </div>

      <div className="flex-1 relative p-4">
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05060B]/90 backdrop-blur-sm">
            <Brain className="w-16 h-16 text-[#FF00FF] mb-4 animate-pulse" />
            <h3 className="font-orbitron text-2xl text-white mb-2">NEURAL NETWORK</h3>
            <p className="font-mono text-[#A6A9B6] mb-6 text-center max-w-md px-4">
              Activate neural pathways by clicking nodes. Build connections to synchronize the AI network.
            </p>
            <button
              onClick={initGame}
              className="px-6 py-3 bg-[#FF00FF]/20 border border-[#FF00FF] rounded-lg font-orbitron text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-all"
            >
              INITIALIZE NETWORK
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, i) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <line
                    key={i}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={conn.active ? '#FF00FF' : '#333'}
                    strokeWidth={conn.active ? 2 : 1}
                    className={conn.active ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>
            
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={`absolute w-12 h-12 rounded-full border-2 transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                  node.active 
                    ? 'bg-[#FF00FF] border-[#FF00FF] shadow-[0_0_20px_#FF00FF]' 
                    : 'bg-[#0B0E14] border-[#FF00FF]/50 hover:border-[#FF00FF] hover:scale-110'
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className={`w-full h-full rounded-full ${node.active ? 'animate-ping bg-[#FF00FF]/30' : ''}`} />
              </button>
            ))}
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 font-orbitron text-2xl text-[#FF00FF]">
          {score}
        </div>
      </div>
    </div>
  );
}

// BREACH PROTOCOL GAME
function BreachGame({ onScore, onComplete }: { onScore: (points: number) => void; onComplete: (stats: any) => void }) {
  const [matrix, setMatrix] = useState<string[][]>([]);
  const [selection, setSelection] = useState<[number, number][]>([]);
  const [target, setTarget] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const hexChars = '0123456789ABCDEF';

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          onComplete({ score, accuracy: score > 0 ? 100 : 0 });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, score, onComplete]);

  const initGame = () => {
    const newMatrix = Array.from({ length: 6 }, () => 
      Array.from({ length: 6 }, () => 
        hexChars[Math.floor(Math.random() * hexChars.length)] + 
        hexChars[Math.floor(Math.random() * hexChars.length)]
      )
    );
    setMatrix(newMatrix);
    
    const targets = [];
    for (let i = 0; i < 3; i++) {
      const row = Math.floor(Math.random() * 6);
      const col = Math.floor(Math.random() * 6);
      targets.push(newMatrix[row][col]);
    }
    setTarget(targets);
    setSelection([]);
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isPlaying) return;
    
    const newSelection = [...selection, [row, col] as [number, number]];
    setSelection(newSelection);
    
    const selectedCode = matrix[row][col];
    if (target.includes(selectedCode)) {
      const points = 100;
      setScore(s => {
        const newScore = s + points;
        onScore(points);
        return newScore;
      });
      
      if (newSelection.length >= 3) {
        setIsPlaying(false);
        onComplete({ score: score + points, accuracy: 100 });
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0B0E14]/95 rounded-lg overflow-hidden border border-[#FFD700]/30 flex flex-col">
      <div className="p-4 border-b border-[#FFD700]/20 flex justify-between items-center bg-[#FFD700]/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#FFD700]" />
          <span className="font-orbitron text-[#FFD700]">BREACH PROTOCOL</span>
        </div>
        <div className="font-mono text-[#FFD700] text-xl">{timeLeft}s</div>
      </div>

      <div className="flex-1 p-6 flex gap-6">
        {!isPlaying ? (
          <div className="w-full flex flex-col items-center justify-center">
            <Terminal className="w-16 h-16 text-[#FFD700] mb-4 animate-pulse" />
            <h3 className="font-orbitron text-2xl text-white mb-2">BREACH PROTOCOL</h3>
            <p className="font-mono text-[#A6A9B6] mb-6 text-center max-w-md px-4">
              Hack the security matrix by selecting the correct hex codes. Find all target sequences before time runs out.
            </p>
            <button
              onClick={initGame}
              className="px-6 py-3 bg-[#FFD700]/20 border border-[#FFD700] rounded-lg font-orbitron text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all"
            >
              INITIATE BREACH
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <div className="mb-4">
                <div className="font-mono text-xs text-[#A6A9B6] mb-2">TARGET SEQUENCES:</div>
                <div className="flex gap-2">
                  {target.map((t, i) => (
                    <div key={i} className="px-3 py-1 bg-[#FFD700]/20 border border-[#FFD700] rounded font-mono text-[#FFD700]">
                      0x{t}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-1">
                {matrix.map((row, rIdx) => (
                  row.map((cell, cIdx) => (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      disabled={selection.some(([sr, sc]) => sr === rIdx && sc === cIdx)}
                      className={`aspect-square border font-mono text-sm transition-all ${
                        selection.some(([sr, sc]) => sr === rIdx && sc === cIdx)
                          ? 'bg-[#FFD700] text-black border-[#FFD700]'
                          : 'bg-[#0B0E14] border-[#FFD700]/30 text-[#FFD700] hover:border-[#FFD700] hover:bg-[#FFD700]/10'
                      }`}
                    >
                      {cell}
                    </button>
                  ))
                ))}
              </div>
            </div>
            
            <div className="w-48 space-y-4">
              <div className="cyber-card corner-brackets p-4 rounded-lg">
                <div className="font-mono text-xs text-[#A6A9B6] mb-1">BUFFER</div>
                <div className="space-y-1">
                  {selection.map(([r, c], i) => (
                    <div key={i} className="font-mono text-[#FFD700] text-sm">
                      {i + 1}. 0x{matrix[r][c]}
                    </div>
                  ))}
                  {Array.from({ length: 3 - selection.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="font-mono text-[#A6A9B6]/30 text-sm">
                      {selection.length + i + 1}. --
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-orbitron text-3xl text-[#FFD700]">{score}</div>
                <div className="font-mono text-xs text-[#A6A9B6]">SCORE</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function GameSection() {
  const [activeGame, setActiveGame] = useState<'dashboard' | 'firewall' | 'crypto' | 'neural' | 'breach'>('dashboard');
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError(true);
      }
    } catch (e) {
      setWebglError(true);
    }
  }, []);

  const handleScore = (points: number) => {
    setStats(prev => ({
      ...prev,
      score: prev.score + points,
      bestScore: Math.max(prev.bestScore, prev.score + points),
    }));
  };

  const handleComplete = (gameType: string, results: { score: number; accuracy: number }) => {
    const newSession: GameSession = {
      id: Date.now().toString(),
      gameType: gameType as any,
      score: results.score,
      accuracy: results.accuracy,
      duration: 60,
      timestamp: new Date(),
    };
    setSessions(prev => [newSession, ...prev].slice(0, 10));
    
    setStats(prev => ({
      ...prev,
      totalPlayed: prev.totalPlayed + 1,
      streak: results.accuracy > 80 ? prev.streak + 1 : 0,
      accuracy: Math.round((prev.accuracy * prev.totalPlayed + results.accuracy) / (prev.totalPlayed + 1)),
    }));
    
    setActiveGame('dashboard');
  };

  const games = [
    {
      id: 'firewall',
      name: 'FIREWALL DEFENSE',
      description: 'Block incoming cyber threats',
      icon: Shield,
      color: '#39FF14',
      difficulty: 'Medium',
      bestScore: sessions.filter(s => s.gameType === 'firewall').reduce((max, s) => Math.max(max, s.score), 0),
    },
    {
      id: 'crypto',
      name: 'CRYPTO DECRYPTION',
      description: 'Crack the security sequences',
      icon: Lock,
      color: '#00BFFF',
      difficulty: 'Hard',
      bestScore: sessions.filter(s => s.gameType === 'crypto').reduce((max, s) => Math.max(max, s.score), 0),
    },
    {
      id: 'neural',
      name: 'NEURAL SYNC',
      description: 'Synchronize the AI network',
      icon: Brain,
      color: '#FF00FF',
      difficulty: 'Expert',
      bestScore: sessions.filter(s => s.gameType === 'neural').reduce((max, s) => Math.max(max, s.score), 0),
    },
    {
      id: 'breach',
      name: 'BREACH PROTOCOL',
      description: 'Hack the security matrix',
      icon: Terminal,
      color: '#FFD700',
      difficulty: 'Hard',
      bestScore: sessions.filter(s => s.gameType === 'breach').reduce((max, s) => Math.max(max, s.score), 0),
    },
  ];

  return (
    <section ref={sectionRef} id="games" className="relative min-h-screen w-full overflow-hidden bg-[#05060B]">
      {/* 3D Background with Fallback */}
      <div className="absolute inset-0 z-0">
        {!webglError ? (
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: '#05060B' }}
          >
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        ) : (
          /* Fallback CSS Background if WebGL fails */
          <div className="absolute inset-0 bg-[#05060B]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#39FF14]/10 via-[#05060B] to-[#05060B]" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-[#39FF14]/20 bg-[#05060B]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center border border-[#39FF14]">
                <Gamepad2 className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="font-orbitron text-2xl text-white tracking-wider">CYBER<span className="text-[#39FF14]">ARCADE</span></h1>
                <p className="font-mono text-xs text-[#A6A9B6]">TACTICAL TRAINING SIMULATION</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono text-xs text-[#A6A9B6]">TOTAL SCORE</div>
                  <div className="font-orbitron text-xl text-[#39FF14]">{stats.score.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-[#A6A9B6]">STREAK</div>
                  <div className="font-orbitron text-xl text-[#FF00FF]">{stats.streak}🔥</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-[#A6A9B6]">LEVEL</div>
                  <div className="font-orbitron text-xl text-[#00BFFF]">{stats.level}</div>
                </div>
              </div>
              
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 border border-[#39FF14]/30 rounded-lg text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-all"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activeGame === 'dashboard' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#0B0E14]/80 backdrop-blur-sm border-[#39FF14]/30">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-5 h-5 text-[#FFD700]" />
                    <span className="font-mono text-xs text-[#A6A9B6]">BEST SCORE</span>
                  </div>
                  <div className="font-orbitron text-2xl text-white">{stats.bestScore.toLocaleString()}</div>
                </div>
                
                <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#0B0E14]/80 backdrop-blur-sm border-[#00BFFF]/30">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-[#00BFFF]" />
                    <span className="font-mono text-xs text-[#A6A9B6]">ACCURACY</span>
                  </div>
                  <div className="font-orbitron text-2xl text-white">{stats.accuracy}%</div>
                </div>
                
                <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#0B0E14]/80 backdrop-blur-sm border-[#FF00FF]/30">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-[#FF00FF]" />
                    <span className="font-mono text-xs text-[#A6A9B6]">GAMES PLAYED</span>
                  </div>
                  <div className="font-orbitron text-2xl text-white">{stats.totalPlayed}</div>
                </div>
                
                <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#0B0E14]/80 backdrop-blur-sm border-[#FFD700]/30">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-[#FFD700]" />
                    <span className="font-mono text-xs text-[#A6A9B6]">PLAY TIME</span>
                  </div>
                  <div className="font-orbitron text-2xl text-white">{Math.floor(stats.totalPlayed * 1.5)}h</div>
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => setActiveGame(game.id as any)}
                    className="cyber-card corner-brackets rounded-lg p-6 bg-[#0B0E14]/80 backdrop-blur-sm border-[#39FF14]/20 hover:border-[#39FF14] transition-all cursor-pointer group hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-14 h-14 rounded-lg flex items-center justify-center border-2"
                        style={{ borderColor: game.color, backgroundColor: `${game.color}20` }}
                      >
                        <game.icon className="w-7 h-7" style={{ color: game.color }} />
                      </div>
                      <span 
                        className="px-2 py-1 rounded text-xs font-mono border"
                        style={{ borderColor: game.color, color: game.color, backgroundColor: `${game.color}10` }}
                      >
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="font-orbitron text-xl text-white mb-2 group-hover:text-[#39FF14] transition-colors">
                      {game.name}
                    </h3>
                    <p className="font-mono text-sm text-[#A6A9B6] mb-4">{game.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#39FF14]/10">
                      <div>
                        <div className="font-mono text-xs text-[#A6A9B6]">BEST SCORE</div>
                        <div className="font-orbitron text-lg text-white">{game.bestScore.toLocaleString()}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#39FF14] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Sessions */}
              <div className="cyber-card corner-brackets rounded-lg p-6 bg-[#0B0E14]/80 backdrop-blur-sm border-[#39FF14]/20">
                <h3 className="font-orbitron text-lg text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                  RECENT SESSIONS
                </h3>
                {sessions.length === 0 ? (
                  <p className="font-mono text-sm text-[#A6A9B6] text-center py-8">No games played yet. Start your training!</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-[#05060B]/50 rounded-lg border border-[#39FF14]/10">
                        <div className="flex items-center gap-3">
                          {session.gameType === 'firewall' && <Shield className="w-4 h-4 text-[#39FF14]" />}
                          {session.gameType === 'crypto' && <Lock className="w-4 h-4 text-[#00BFFF]" />}
                          {session.gameType === 'neural' && <Brain className="w-4 h-4 text-[#FF00FF]" />}
                          {session.gameType === 'breach' && <Terminal className="w-4 h-4 text-[#FFD700]" />}
                          <span className="font-mono text-sm text-white uppercase">{session.gameType}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm text-[#39FF14]">{session.score} pts</span>
                          <span className="font-mono text-xs text-[#A6A9B6]">{session.accuracy}% acc</span>
                          <span className="font-mono text-xs text-[#A6A9B6]">
                            {session.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[calc(100vh-200px)] animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setActiveGame('dashboard')}
                  className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  BACK TO DASHBOARD
                </button>
                <h2 className="font-orbitron text-xl text-white">
                  {games.find(g => g.id === activeGame)?.name}
                </h2>
              </div>
              
              <div className="h-full pb-12">
                {activeGame === 'firewall' && (
                  <FirewallGame 
                    onScore={handleScore} 
                    onComplete={(stats) => handleComplete('firewall', stats)} 
                  />
                )}
                {activeGame === 'crypto' && (
                  <CryptoGame 
                    onScore={handleScore} 
                    onComplete={(stats) => handleComplete('crypto', stats)} 
                  />
                )}
                {activeGame === 'neural' && (
                  <NeuralGame 
                    onScore={handleScore} 
                    onComplete={(stats) => handleComplete('neural', stats)} 
                  />
                )}
                {activeGame === 'breach' && (
                  <BreachGame 
                    onScore={handleScore} 
                    onComplete={(stats) => handleComplete('breach', stats)} 
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
    </section>
  );
}