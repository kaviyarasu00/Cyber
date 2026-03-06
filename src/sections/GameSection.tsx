import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { 
  Terminal, Shield, Lock, Unlock, Zap, Trophy, 
  Coins, Skull, Play, RotateCcw, Target, Cpu, 
  CheckCircle2, Timer, Star, Award, TrendingUp, Gamepad2,
  Box, Brain, Grid3X3, Hexagon, Radio, Wifi, Crosshair
} from 'lucide-react';

// Game Types
type GameState = 'menu' | 'playing' | 'gameOver' | 'victory';
type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary';
type GameMode = 'breach' | 'crypto' | 'cube' | 'ai-battle';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  condition: string;
}

interface Score {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  date: string;
}

// 3D Background Animation Component
function GameBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 3D Grid and particles
    const particles: Array<{
      x: number; y: number; z: number; vx: number; vy: number; vz: number;
    }> = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: -Math.random() * 5 - 2
      });
    }

    const draw = () => {
      time += 0.016;
      ctx.fillStyle = 'rgba(5, 6, 11, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fov = 600;

      // Draw 3D grid floor
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = -10; i <= 10; i++) {
        // Vertical lines
        const x1 = i * 100;
        const y1 = 500;
        const z1 = 0;
        const x2 = i * 100;
        const y2 = 500;
        const z2 = 2000;

        const scale1 = fov / (fov + z1);
        const scale2 = fov / (fov + z2);
        
        ctx.beginPath();
        ctx.moveTo(centerX + x1 * scale1, centerY + y1 * scale1);
        ctx.lineTo(centerX + x2 * scale2, centerY + y2 * scale2);
        ctx.stroke();

        // Horizontal lines (moving)
        const moveZ = (time * 100) % 200;
        const z = i * 200 + moveZ;
        if (z > 0) {
          const scale = fov / (fov + z);
          const size = 1000 * scale;
          
          ctx.beginPath();
          ctx.moveTo(centerX - size, centerY + 300 * scale);
          ctx.lineTo(centerX + size, centerY + 300 * scale);
          ctx.stroke();
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.z += p.vz;
        p.x += p.vx;
        p.y += p.vy;

        if (p.z < 1) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        const scale = fov / (fov + p.z);
        const x2d = centerX + p.x * scale;
        const y2d = centerY + p.y * scale;
        const size = Math.max(0.5, 3 * scale);

        const alpha = Math.min(1, (2000 - p.z) / 1000);
        ctx.fillStyle = `rgba(57, 255, 20, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating cubes
      for (let i = 0; i < 5; i++) {
        const cubeTime = time + i * 1.5;
        const x = Math.sin(cubeTime * 0.5) * 300 + centerX;
        const y = Math.cos(cubeTime * 0.3) * 200 + centerY - 100;
        const z = 500 + Math.sin(cubeTime * 0.4) * 300;
        const rot = cubeTime;
        const scale = fov / (fov + z) * 0.5;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.rotate(rot);
        
        // Draw cube wireframe
        ctx.strokeStyle = `rgba(57, 255, 20, ${0.3 + Math.sin(cubeTime) * 0.2})`;
        ctx.lineWidth = 2;
        const size = 40;
        
        // Front face
        ctx.strokeRect(-size, -size, size * 2, size * 2);
        // Back face (offset)
        ctx.strokeRect(-size + 20, -size + 20, size * 2, size * 2);
        // Connecting lines
        ctx.beginPath();
        ctx.moveTo(-size, -size); ctx.lineTo(-size + 20, -size + 20);
        ctx.moveTo(size, -size); ctx.lineTo(size + 20, -size + 20);
        ctx.moveTo(-size, size); ctx.lineTo(-size + 20, size + 20);
        ctx.moveTo(size, size); ctx.lineTo(size + 20, size + 20);
        ctx.stroke();
        
        ctx.restore();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// Cyber Breach Game
function BreachGame({ difficulty, onGameEnd }: { difficulty: Difficulty; onGameEnd: (won: boolean, score: number) => void }) {
  const [nodes, setNodes] = useState<Array<{ id: number; active: boolean; hacked: boolean; x: number; y: number }>>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [targetNode, setTargetNode] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [hackedCount, setHackedCount] = useState(0);

  useEffect(() => {
    const nodeCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : difficulty === 'hard' ? 10 : 15;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i, active: Math.random() > 0.5, hacked: false,
      x: 10 + Math.random() * 80, y: 10 + Math.random() * 80,
    }));
    setNodes(newNodes);
    setHackedCount(0);
    const firstTarget = newNodes.find(n => n.active);
    if (firstTarget) setTargetNode(firstTarget.id);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { onGameEnd(false, score); return 0; }
        return t - 1;
      });
    }, 1000);

    const interval = difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1000;
    const loop = setInterval(() => {
      setNodes(current => {
        const updated = current.map(node => ({ ...node, active: !node.hacked && Math.random() > 0.3 }));
        const available = updated.filter(n => n.active && !n.hacked);
        if (available.length > 0 && targetNode === null) setTargetNode(available[0].id);
        return updated;
      });
    }, interval);

    return () => { clearInterval(timer); clearInterval(loop); };
  }, [difficulty]);

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPos(pos => {
      const step = 8;
      let newX = pos.x, newY = pos.y;
      if (direction === 'up') newY = Math.max(5, pos.y - step);
      if (direction === 'down') newY = Math.min(95, pos.y + step);
      if (direction === 'left') newX = Math.max(5, pos.x - step);
      if (direction === 'right') newX = Math.min(95, pos.x + step);
      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    if (targetNode === null) return;
    const target = nodes.find(n => n.id === targetNode);
    if (!target || !target.active || target.hacked) return;
    const distance = Math.sqrt(Math.pow(playerPos.x - target.x, 2) + Math.pow(playerPos.y - target.y, 2));
    if (distance < 8) {
      setNodes(current => {
        const updated = current.map(n => n.id === targetNode ? { ...n, hacked: true, active: false } : n);
        const newHackedCount = updated.filter(n => n.hacked).length;
        setHackedCount(newHackedCount);
        if (newHackedCount >= nodes.length) setTimeout(() => onGameEnd(true, score + 100), 100);
        return updated;
      });
      const points = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : difficulty === 'hard' ? 300 : 500;
      setScore(s => s + points);
      setTargetNode(null);
    }
  }, [playerPos, targetNode, nodes, difficulty, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) movePlayer('up');
      if (['ArrowDown', 's', 'S'].includes(e.key)) movePlayer('down');
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) movePlayer('left');
      if (['ArrowRight', 'd', 'D'].includes(e.key)) movePlayer('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-96 bg-[#0B0E14]/80 rounded-xl border border-green-500/30 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(57,255,20,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono ${timeLeft < 10 ? 'text-red-400' : 'text-green-400'}`}>
            <Timer className="w-4 h-4" />
            <span className={timeLeft < 10 ? 'animate-pulse' : ''}>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 text-green-400 font-mono">
            <Target className="w-4 h-4" />
            <span>{hackedCount}/{nodes.length}</span>
          </div>
        </div>
        <div className="text-green-400 font-mono font-bold">SCORE: {score}</div>
      </div>
      {nodes.map(node => (
        <div key={node.id} className={`absolute w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${node.hacked ? 'bg-green-500/20 border-green-500 text-green-400' : node.active && node.id === targetNode ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-gray-800 border-gray-600 text-gray-500'}`} style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}>
          {node.hacked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </div>
      ))}
      <div className="absolute w-6 h-6 bg-green-400 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.8)] z-20 transition-all duration-150 ease-out" style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: 'translate(-50%, -50%)' }}>
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30" />
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono">Use WASD or Arrow Keys to move</div>
    </div>
  );
}

// Crypto Miner Game
function CryptoGame({ difficulty, onGameEnd }: { difficulty: Difficulty; onGameEnd: (won: boolean, score: number) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [isShowing, setIsShowing] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const chars = ['0', '1', 'A', 'F', 'X', 'Z'];
  const maxRounds = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : difficulty === 'hard' ? 7 : 10;

  useEffect(() => { generateSequence(); }, [round]);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isShowing && playerInput.length === 0 && round > 1) {
      onGameEnd(false, round * 100);
    }
  }, [timeLeft, isShowing, playerInput, round]);

  const generateSequence = () => {
    const length = 3 + round;
    const newSeq = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]);
    setSequence(newSeq);
    setPlayerInput([]);
    setIsShowing(true);
    setTimeLeft(0);
    setTimeout(() => { setIsShowing(false); setTimeLeft(10 + round * 2); }, 2000 + round * 500);
  };

  const handleInput = (char: string) => {
    if (isShowing) return;
    const newInput = [...playerInput, char];
    setPlayerInput(newInput);
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) { onGameEnd(false, round * 100); return; }
    if (newInput.length === sequence.length) {
      if (round >= maxRounds) onGameEnd(true, maxRounds * 200 + timeLeft * 10);
      else setRound(r => r + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-green-400 font-mono">Round {round}/{maxRounds}</div>
        {!isShowing && timeLeft > 0 && <div className={`font-mono ${timeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>{timeLeft}s</div>}
      </div>
      <div className="h-24 bg-[#0B0E14]/80 rounded-lg border border-green-500/30 flex items-center justify-center gap-2 mb-6 backdrop-blur-sm">
        {isShowing ? sequence.map((char, i) => (
          <div key={i} className="w-12 h-12 bg-green-500/20 border border-green-500 rounded flex items-center justify-center text-2xl font-bold text-green-400 font-mono" style={{ animationDelay: `${i * 0.2}s`, animation: 'fadeInDown 0.3s ease-out' }}>{char}</div>
        )) : (
          <>
            {playerInput.map((char, i) => (
              <div key={i} className={`w-12 h-12 border rounded flex items-center justify-center text-2xl font-bold font-mono ${char === sequence[i] ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>{char}</div>
            ))}
            {Array.from({ length: sequence.length - playerInput.length }).map((_, i) => <div key={`empty-${i}`} className="w-12 h-12 border border-gray-700 rounded bg-gray-900/50" />)}
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {chars.map(char => (
          <button key={char} onClick={() => handleInput(char)} disabled={isShowing} className="h-16 bg-[#0B0E14]/80 border border-green-500/30 rounded-lg text-2xl font-bold text-green-400 hover:bg-green-500/10 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 backdrop-blur-sm">{char}</button>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-gray-500 font-mono">{isShowing ? 'Memorize the sequence...' : 'Enter the sequence!'}</div>
    </div>
  );
}

// Cube Runner 3D Game
function CubeRunnerGame({ difficulty, onGameEnd }: { difficulty: Difficulty; onGameEnd: (won: boolean, score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const speed = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : difficulty === 'hard' ? 6 : 8;
    
    // Player cube
    const player = { x: canvas.width / 2, y: canvas.height - 100, size: 30, color: '#39FF14' };
    const obstacles: Array<{ x: number; y: number; size: number; speed: number }> = [];
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
    
    let frameCount = 0;
    let gameScore = 0;

    const spawnObstacle = () => {
      obstacles.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -50,
        size: 30 + Math.random() * 20,
        speed: speed + Math.random() * 2
      });
    };

    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 10; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1
        });
      }
    };

    const gameLoop = () => {
      if (!isPlaying) return;
      
      ctx.fillStyle = 'rgba(11, 14, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 3D grid floor
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
      ctx.lineWidth = 1;
      const perspective = 300;
      const horizon = canvas.height / 2;
      
      for (let i = 0; i < 20; i++) {
        const y = horizon + (i * i * 2);
        if (y > canvas.height) break;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Spawn obstacles
      frameCount++;
      const spawnRate = difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : difficulty === 'hard' ? 60 : 40;
      if (frameCount % spawnRate === 0) spawnObstacle();

      // Update and draw obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.speed;
        
        // Draw 3D cube obstacle
        const scale = 1 + (obs.y / canvas.height) * 0.5;
        const size = obs.size * scale;
        
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        
        // Front face
        ctx.fillRect(obs.x - size/2, obs.y - size/2, size, size);
        ctx.strokeRect(obs.x - size/2, obs.y - size/2, size, size);
        
        // 3D effect
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(obs.x - size/2, obs.y - size/2);
        ctx.lineTo(obs.x - size/2 + 10, obs.y - size/2 - 10);
        ctx.lineTo(obs.x + size/2 + 10, obs.y - size/2 - 10);
        ctx.lineTo(obs.x + size/2, obs.y - size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Collision detection
        const dx = player.x - obs.x;
        const dy = player.y - obs.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (player.size + size) / 2) {
          createExplosion(player.x, player.y, '#39FF14');
          onGameEnd(false, gameScore);
          setIsPlaying(false);
          return;
        }

        if (obs.y > canvas.height) {
          obstacles.splice(i, 1);
          gameScore += 10;
          setScore(gameScore);
        }
      }

      // Draw player (3D green cube)
      ctx.fillStyle = player.color;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(player.x - player.size/2 + 5, player.y - player.size/2 + 5, player.size, player.size);
      
      // 3D top face
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.moveTo(player.x - player.size/2, player.y - player.size/2);
      ctx.lineTo(player.x - player.size/2 + 8, player.y - player.size/2 - 8);
      ctx.lineTo(player.x + player.size/2 + 8, player.y - player.size/2 - 8);
      ctx.lineTo(player.x + player.size/2, player.y - player.size/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Front face
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size);
      ctx.strokeRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size);

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.fillStyle = `rgba(57, 255, 20, ${p.life})`;
        ctx.fillRect(p.x, p.y, 4, 4);
      }

      // Win condition
      if (gameScore >= 500) {
        onGameEnd(true, gameScore);
        setIsPlaying(false);
        return;
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Mouse/Touch control
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      player.x = clientX - rect.left;
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
    };
  }, [difficulty, isPlaying]);

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-400 font-mono">Score: {score}/500</div>
        <div className="text-gray-400 font-mono text-sm">Move mouse to dodge</div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full h-96 bg-[#0B0E14] rounded-xl border border-green-500/30 cursor-none"
      />
    </div>
  );
}

// AI Battle Game
function AIBattleGame({ difficulty, onGameEnd }: { difficulty: Difficulty; onGameEnd: (won: boolean, score: number) => void }) {
  const [aiHealth, setAiHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [currentRound, setCurrentRound] = useState(1);
  const [aiMove, setAiMove] = useState<string | null>(null);
  const [playerMove, setPlayerMove] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [isRoundActive, setIsRoundActive] = useState(false);

  const moves = [
    { name: 'Hack', icon: <Terminal className="w-6 h-6" />, beats: 'Shield', color: 'text-green-400' },
    { name: 'Shield', icon: <Shield className="w-6 h-6" />, beats: 'Virus', color: 'text-blue-400' },
    { name: 'Virus', icon: <Skull className="w-6 h-6" />, beats: 'Hack', color: 'text-red-400' },
  ];

  const maxRounds = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;

  const playRound = (playerChoice: string) => {
    if (isRoundActive) return;
    setIsRoundActive(true);
    setPlayerMove(playerChoice);
    
    // AI choice with difficulty-based intelligence
    let aiChoice;
    if (difficulty === 'easy') {
      aiChoice = moves[Math.floor(Math.random() * moves.length)].name;
    } else {
      // AI tries to counter player patterns
      const random = Math.random();
      if (random < 0.3) {
        // Counter player's last move if exists
        const counterMove = moves.find(m => m.beats === playerChoice);
        aiChoice = counterMove ? counterMove.name : moves[Math.floor(Math.random() * moves.length)].name;
      } else {
        aiChoice = moves[Math.floor(Math.random() * moves.length)].name;
      }
    }
    
    setAiMove(aiChoice);

    setTimeout(() => {
      // Determine winner
      const playerMoveObj = moves.find(m => m.name === playerChoice);
      let result = 'draw';
      
      if (playerChoice === aiChoice) {
        result = 'draw';
      } else if (playerMoveObj?.beats === aiChoice) {
        result = 'win';
        setAiHealth(h => Math.max(0, h - (difficulty === 'easy' ? 35 : 25)));
      } else {
        result = 'loss';
        setPlayerHealth(h => Math.max(0, h - (difficulty === 'easy' ? 20 : 30)));
      }
      
      setRoundResult(result);
      
      setTimeout(() => {
        if (aiHealth <= 0 || (result === 'win' && aiHealth <= 25)) {
          onGameEnd(true, currentRound * 100 + playerHealth);
        } else if (playerHealth <= 0 || (result === 'loss' && playerHealth <= 20)) {
          onGameEnd(false, currentRound * 50);
        } else if (currentRound >= maxRounds) {
          onGameEnd(aiHealth < playerHealth, currentRound * 100);
        } else {
          setCurrentRound(r => r + 1);
          setPlayerMove(null);
          setAiMove(null);
          setRoundResult(null);
          setIsRoundActive(false);
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Health Bars */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex-1 mr-4">
          <div className="text-green-400 font-mono text-sm mb-1">YOU</div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${playerHealth}%` }}
            />
          </div>
          <div className="text-right text-green-400 font-mono text-sm">{playerHealth}%</div>
        </div>
        <div className="text-2xl font-bold text-gray-500 font-mono">VS</div>
        <div className="flex-1 ml-4">
          <div className="text-red-400 font-mono text-sm mb-1 text-right">AI CORE</div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-500"
              style={{ width: `${aiHealth}%` }}
            />
          </div>
          <div className="text-red-400 font-mono text-sm">{aiHealth}%</div>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-gray-400 font-mono text-sm">Round {currentRound}/{maxRounds}</div>
      </div>

      {/* Battle Arena */}
      <div className="h-48 bg-[#0B0E14]/80 rounded-xl border border-green-500/30 mb-6 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
        {/* Animated background rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border border-green-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-48 h-48 border border-green-500/10 rounded-full absolute animate-ping" style={{ animationDuration: '4s' }} />
        </div>
        
        {playerMove && aiMove ? (
          <div className="flex items-center gap-8 z-10">
            <div className={`text-center ${roundResult === 'win' ? 'animate-bounce' : ''}`}>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 mb-2">
                {moves.find(m => m.name === playerMove)?.icon}
              </div>
              <div className="text-green-400 font-mono text-sm">{playerMove}</div>
            </div>
            
            <div className="text-2xl font-bold text-white">
              {roundResult === 'win' ? '>' : roundResult === 'loss' ? '<' : '='}
            </div>
            
            <div className={`text-center ${roundResult === 'loss' ? 'animate-bounce' : ''}`}>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 mb-2">
                {moves.find(m => m.name === aiMove)?.icon}
              </div>
              <div className="text-red-400 font-mono text-sm">{aiMove}</div>
            </div>
          </div>
        ) : (
          <div className="text-center z-10">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-2 animate-pulse" />
            <div className="text-purple-400 font-mono">AI Calculating...</div>
          </div>
        )}
      </div>

      {/* Move Selection */}
      <div className="grid grid-cols-3 gap-4">
        {moves.map(move => (
          <button
            key={move.name}
            onClick={() => playRound(move.name)}
            disabled={isRoundActive}
            className={`p-4 rounded-xl border transition-all ${move.color} ${isRoundActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:border-current'} bg-[#0B0E14]/80 backdrop-blur-sm`}
          >
            <div className="flex flex-col items-center gap-2">
              {move.icon}
              <span className="font-mono text-sm font-bold">{move.name}</span>
              <span className="text-xs opacity-70">beats {move.beats}</span>
            </div>
          </button>
        ))}
      </div>

      {roundResult && (
        <div className={`text-center mt-4 font-mono text-lg ${roundResult === 'win' ? 'text-green-400' : roundResult === 'loss' ? 'text-red-400' : 'text-gray-400'}`}>
          {roundResult === 'win' ? 'SYSTEM BREACHED!' : roundResult === 'loss' ? 'FIREWALL BLOCKED!' : 'STANDOFF!'}
        </div>
      )}
    </div>
  );
}

// Main Game Section
export default function GameSection() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedMode, setSelectedMode] = useState<GameMode>('breach');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [currentScore, setCurrentScore] = useState(0);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [totalCoins, setTotalCoins] = useState(1250);
  const [rewards, setRewards] = useState<Reward[]>([
    { id: '1', name: 'Script Kiddie', description: 'Complete your first hack', icon: <Terminal className="w-6 h-6" />, rarity: 'common', unlocked: true, condition: 'First game played' },
    { id: '2', name: 'Ghost in the Shell', description: 'Hack 10 nodes', icon: <Wifi className="w-6 h-6" />, rarity: 'rare', unlocked: false, condition: 'Score 1000+ in Breach' },
    { id: '3', name: 'Cube Runner', description: 'Dodge 50 obstacles', icon: <Box className="w-6 h-6" />, rarity: 'rare', unlocked: false, condition: 'Score 500+ in Cube Runner' },
    { id: '4', name: 'AI Slayer', description: 'Defeat the AI Core', icon: <Brain className="w-6 h-6" />, rarity: 'epic', unlocked: false, condition: 'Win AI Battle on Hard' },
    { id: '5', name: 'Crypto King', description: 'Mine 5 blocks', icon: <Coins className="w-6 h-6" />, rarity: 'epic', unlocked: false, condition: 'Complete Crypto on Hard' },
    { id: '6', name: 'Zero Day', description: 'Master all systems', icon: <Skull className="w-6 h-6" />, rarity: 'legendary', unlocked: false, condition: 'Complete all on Legendary' },
  ]);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.game-header', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out' });
      gsap.from('.game-card', { y: 50, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
      gsap.from('.sidebar-item', { x: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.4, ease: 'power2.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentScore(0);
  };

  const handleGameEnd = (won: boolean, score: number) => {
    setCurrentScore(score);
    const finalScore = won ? score : Math.floor(score / 2);
    setTotalCoins(c => c + finalScore);
    
    const newScore: Score = {
      mode: selectedMode,
      difficulty: selectedDifficulty,
      score: finalScore,
      date: new Date().toLocaleDateString(),
    };
    setHighScores(prev => [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10));

    // Check rewards
    if (won && score > 500) unlockReward('2');
    if (won && selectedMode === 'cube' && score >= 500) unlockReward('3');
    if (won && selectedMode === 'ai-battle' && selectedDifficulty === 'hard') unlockReward('4');
    if (won && selectedMode === 'crypto' && selectedDifficulty === 'hard') unlockReward('5');
    if (won && selectedDifficulty === 'legendary') unlockReward('6');
    
    setGameState(won ? 'victory' : 'gameOver');
  };

  const unlockReward = (id: string) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, unlocked: true } : r));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600 bg-gray-900/50';
      case 'rare': return 'text-blue-400 border-blue-500 bg-blue-900/20';
      case 'epic': return 'text-purple-400 border-purple-500 bg-purple-900/20';
      case 'legendary': return 'text-yellow-400 border-yellow-500 bg-yellow-900/20 shadow-[0_0_20px_rgba(234,179,8,0.3)]';
      default: return 'text-gray-400';
    }
  };

  const gameModes = [
    { id: 'breach' as GameMode, name: 'BREACH', icon: <Unlock className="w-6 h-6" />, desc: 'Hack the network nodes' },
    { id: 'crypto' as GameMode, name: 'CRYPTO', icon: <Cpu className="w-6 h-6" />, desc: 'Mine hash sequences' },
    { id: 'cube' as GameMode, name: 'CUBE RUNNER', icon: <Box className="w-6 h-6" />, desc: '3D obstacle dodging' },
    { id: 'ai-battle' as GameMode, name: 'AI BATTLE', icon: <Brain className="w-6 h-6" />, desc: 'Defeat the AI Core' },
  ];

  return (
    <section id="game" ref={sectionRef} className="min-h-screen bg-[#05060B] py-20 px-4 relative overflow-hidden scroll-mt-20">
      {/* 3D Animated Background */}
      <GameBackground3D />
      
      {/* Static UI Layer */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Static */}
        <div className="game-header text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider flex items-center justify-center gap-3">
            <Gamepad2 className="w-10 h-10 text-green-400" />
            CYBER ARENA
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Test your skills in the digital battlefield. 4 unique game modes. Hack, mine, run, and battle.
          </p>
          
          {/* Stats Bar - Static */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2 text-green-400 font-mono bg-green-500/10 px-4 py-2 rounded-full border border-green-500/30">
              <Coins className="w-5 h-5" />
              <span className="font-bold">{totalCoins.toLocaleString()}</span>
              <span className="text-sm opacity-70">CYBER</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400 font-mono bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/30">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{highScores.length}</span>
              <span className="text-sm opacity-70">WINS</span>
            </div>
          </div>
        </div>

        {/* Game Container - Static Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="game-card bg-[#0B0E14]/90 border border-green-500/30 rounded-2xl p-6 min-h-[500px] backdrop-blur-md">
              {gameState === 'menu' && (
                <div className="space-y-6">
                  {/* Mode Selection */}
                  <div>
                    <h3 className="text-green-400 font-mono text-sm mb-3 uppercase tracking-wider">Select Protocol</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {gameModes.map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setSelectedMode(mode.id)}
                          className={`p-4 rounded-xl border transition-all text-left ${selectedMode === mode.id ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-green-500/50'}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {mode.icon}
                            <span className="font-mono font-bold">{mode.name}</span>
                          </div>
                          <p className="text-xs opacity-70">{mode.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <h3 className="text-green-400 font-mono text-sm mb-3 uppercase tracking-wider">Security Level</h3>
                    <div className="flex gap-2">
                      {(['easy', 'medium', 'hard', 'legendary'] as Difficulty[]).map(diff => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`flex-1 py-3 rounded-lg border font-mono text-sm uppercase transition-all ${selectedDifficulty === diff ? diff === 'legendary' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-gray-500'}`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={startGame} className="w-full py-4 bg-green-500 text-black font-bold text-lg rounded-xl hover:bg-green-400 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                    <Play className="w-6 h-6" />
                    INITIATE
                  </button>
                </div>
              )}

              {gameState === 'playing' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-green-400 font-mono text-lg">{selectedMode.toUpperCase()} // {selectedDifficulty.toUpperCase()}</h3>
                    <button onClick={() => setGameState('menu')} className="text-gray-500 hover:text-red-400 font-mono text-sm">[ABORT]</button>
                  </div>
                  {selectedMode === 'breach' && <BreachGame difficulty={selectedDifficulty} onGameEnd={handleGameEnd} />}
                  {selectedMode === 'crypto' && <CryptoGame difficulty={selectedDifficulty} onGameEnd={handleGameEnd} />}
                  {selectedMode === 'cube' && <CubeRunnerGame difficulty={selectedDifficulty} onGameEnd={handleGameEnd} />}
                  {selectedMode === 'ai-battle' && <AIBattleGame difficulty={selectedDifficulty} onGameEnd={handleGameEnd} />}
                </div>
              )}

              {gameState === 'gameOver' && (
                <div className="h-96 flex flex-col items-center justify-center text-center animate-fade-in">
                  <Skull className="w-20 h-20 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-red-400 mb-2">CONNECTION TERMINATED</h3>
                  <div className="text-green-400 font-mono text-xl mb-6">REWARD: {currentScore} CYBER</div>
                  <button onClick={() => setGameState('menu')} className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Retry
                  </button>
                </div>
              )}

              {gameState === 'victory' && (
                <div className="h-96 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">BREACH SUCCESSFUL</h3>
                  <div className="text-green-400 font-mono text-2xl mb-2">+{currentScore} CYBER</div>
                  <div className="text-yellow-400 text-sm mb-6">{selectedDifficulty === 'legendary' ? 'LEGENDARY' : 'Standard'} Clear</div>
                  <button onClick={() => setGameState('menu')} className="px-8 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400">Continue</button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Static */}
          <div className="space-y-4">
            <div className="sidebar-item bg-[#0B0E14]/90 border border-gray-800 rounded-xl p-4 backdrop-blur-md">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> High Scores
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {highScores.length === 0 ? <p className="text-gray-500 text-sm text-center py-4">No runs recorded</p> : highScores.slice(0, 5).map((score, i) => (
                  <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-900/50 rounded">
                    <div><span className="text-green-400 font-mono">#{i + 1}</span><span className="text-gray-400 ml-2">{score.mode}</span></div>
                    <span className="text-white font-mono">{score.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-item bg-[#0B0E14]/90 border border-gray-800 rounded-xl p-4 backdrop-blur-md">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" /> Achievements
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {rewards.map(reward => (
                  <div key={reward.id} className={`p-3 rounded-lg border transition-all ${reward.unlocked ? getRarityColor(reward.rarity) : 'bg-gray-900/30 border-gray-800 opacity-50 grayscale'}`}>
                    <div className="flex items-start gap-3">
                      <div className={reward.unlocked ? 'text-current' : 'text-gray-600'}>{reward.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{reward.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${reward.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' : reward.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' : reward.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>{reward.rarity}</span>
                        </div>
                        <p className="text-xs opacity-70 mt-1">{reward.description}</p>
                        {!reward.unlocked && <p className="text-xs text-gray-500 mt-1">🔒 {reward.condition}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      `}</style>
    </section>
  );
}