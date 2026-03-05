import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Shield, Lock, Terminal, Cpu, Zap, Activity, Radio } from 'lucide-react';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

// ─── Three.js 3D Background ───────────────────────────────────────────────────
function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const GREEN = new THREE.Color(0x39ff14);
    const GREEN_DIM = new THREE.Color(0x1a7a09);
    const CYAN = new THREE.Color(0x00ffff);

    // ── 1. Large wireframe icosahedron (centerpiece) ──
    const icoGeo = new THREE.IcosahedronGeometry(6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(8, 0, -5);
    scene.add(icosahedron);

    // ── 2. Second wireframe icosahedron (left) ──
    const ico2Geo = new THREE.IcosahedronGeometry(4, 1);
    const ico2Mat = new THREE.MeshBasicMaterial({
      color: CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const icosahedron2 = new THREE.Mesh(ico2Geo, ico2Mat);
    icosahedron2.position.set(-10, 3, -8);
    scene.add(icosahedron2);

    // ── 3. Rotating torus (ring) ──
    const torusGeo = new THREE.TorusGeometry(5, 0.06, 16, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.25,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(-6, -2, -4);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // ── 4. Second torus (accent) ──
    const torus2Geo = new THREE.TorusGeometry(3, 0.04, 16, 60);
    const torus2Mat = new THREE.MeshBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.15,
    });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.position.set(12, 5, -10);
    torus2.rotation.y = Math.PI / 4;
    scene.add(torus2);

    // ── 5. Octahedron cluster ──
    const octahedrons: THREE.Mesh[] = [];
    const octPositions = [
      [-14, 6, -6], [15, -5, -8], [-8, -8, -4],
      [10, 8, -12], [-3, 10, -10], [5, -10, -6],
    ];
    octPositions.forEach(([x, y, z]) => {
      const geo = new THREE.OctahedronGeometry(0.6 + Math.random() * 0.8, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? GREEN : CYAN,
        wireframe: true,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      octahedrons.push(mesh);
    });

    // ── 6. Particle field ──
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
      particleSpeeds[i] = 0.002 + Math.random() * 0.006;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: GREEN,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 7. Connecting lines grid (hex grid projection) ──
    const gridMat = new THREE.LineBasicMaterial({
      color: GREEN_DIM,
      transparent: true,
      opacity: 0.08,
    });
    for (let i = -5; i <= 5; i++) {
      const hGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-20, i * 2.5, -15),
        new THREE.Vector3(20, i * 2.5, -15),
      ]);
      scene.add(new THREE.Line(hGeo, gridMat));
      const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 3.5, -14, -15),
        new THREE.Vector3(i * 3.5, 14, -15),
      ]);
      scene.add(new THREE.Line(vGeo, gridMat));
    }

    // ── 8. Floating tetrahedra (small accent shapes) ──
    const tetras: { mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 }[] = [];
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.TetrahedronGeometry(0.4 + Math.random() * 0.5, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: GREEN,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      );
      scene.add(mesh);
      tetras.push({
        mesh,
        speed: 0.005 + Math.random() * 0.015,
        axis: new THREE.Vector3(
          Math.random(), Math.random(), Math.random()
        ).normalize(),
      });
    }

    // ── 9. DNA helix-like structure ──
    const helixPoints1: THREE.Vector3[] = [];
    const helixPoints2: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) {
      const t = (i / 60) * Math.PI * 4;
      const y = (i / 60) * 20 - 10;
      helixPoints1.push(new THREE.Vector3(Math.cos(t) * 1.5 + 18, y, Math.sin(t) * 1.5 - 8));
      helixPoints2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 1.5 + 18, y, Math.sin(t + Math.PI) * 1.5 - 8));
    }
    const helix1Geo = new THREE.BufferGeometry().setFromPoints(helixPoints1);
    const helix2Geo = new THREE.BufferGeometry().setFromPoints(helixPoints2);
    const helixMat = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Line(helix1Geo, helixMat));
    scene.add(new THREE.Line(helix2Geo, helixMat.clone()));

    // Cross rungs of helix
    for (let i = 0; i < 60; i += 4) {
      const rungGeo = new THREE.BufferGeometry().setFromPoints([helixPoints1[i], helixPoints2[i]]);
      const rungMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.12 });
      scene.add(new THREE.Line(rungGeo, rungMat));
    }

    // ── Mouse parallax ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Animation loop ──
    let frameId: number;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.005;

      // Smooth camera parallax
      targetX += (mouseX * 1.5 - targetX) * 0.04;
      targetY += (mouseY * 1.0 - targetY) * 0.04;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      // Main icosahedron
      icosahedron.rotation.x += 0.003;
      icosahedron.rotation.y += 0.005;
      icosahedron.rotation.z += 0.002;

      // Second icosahedron (opposite)
      icosahedron2.rotation.x -= 0.004;
      icosahedron2.rotation.y -= 0.003;

      // Torus
      torus.rotation.z += 0.006;
      torus.rotation.x += 0.002;

      // Torus2
      torus2.rotation.y += 0.008;
      torus2.rotation.z -= 0.004;

      // Octahedra — each spins + bobs
      octahedrons.forEach((oct, i) => {
        oct.rotation.x += 0.01 + i * 0.003;
        oct.rotation.y += 0.008 + i * 0.002;
        oct.position.y += Math.sin(t + i * 1.2) * 0.01;
      });

      // Tetrahedra
      tetras.forEach(({ mesh, speed, axis }) => {
        mesh.rotateOnAxis(axis, speed);
        mesh.position.y += Math.sin(t + mesh.position.x) * 0.005;
      });

      // Particle drift
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleSpeeds[i];
        if (pos[i * 3 + 1] > 20) pos[i * 3 + 1] = -20;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse particle opacity
      (particleMat as THREE.PointsMaterial).opacity = 0.4 + Math.sin(t * 2) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ──
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─── Floating Element (preserved) ────────────────────────────────────────────
function FloatingElement({
  icon: Icon,
  position,
  delay = 0,
  size = 40,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  position: { x: string; y: string };
  delay?: number;
  size?: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    gsap.to(element, {
      y: -20,
      rotation: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
    });
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.5))',
      }}
    >
      <div
        className="bg-[#39FF14]/10 border border-[#39FF14]/50 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Icon className="text-[#39FF14]" size={size * 0.5} />
      </div>
    </div>
  );
}

// ─── Live Activity Indicator (preserved) ─────────────────────────────────────
function LiveActivity({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full">
      <Radio className="w-3 h-3 text-[#ff0d00] animate-pulse" />
      <span className="font-mono text-xs text-[#39FF14]">{label}:</span>
      <span className="font-mono text-xs text-white">{value}</span>
    </div>
  );
}

// ─── Matrix Rain (preserved) ──────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 6, 11, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#39FF14';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />;
}

// ─── Animated Counter (preserved) ────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHasStarted(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const easeOut = 1 - Math.pow(1 - step / steps, 4);
      setCount(Math.floor(target * easeOut));
      if (step >= steps) { setCount(target); clearInterval(timer); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <div className="text-center min-w-[100px]">
      <div className="font-orbitron font-bold text-xl md:text-2xl text-[#39FF14]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-mono text-xs text-[#A6A9B6] mt-1">{label}</div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING...');
  const [showContent, setShowContent] = useState(false);
  const [liveStats, setLiveStats] = useState({ online: 156, attacks: 1247, defenses: 3892 });

  const { user } = useAuth();

  // Loading simulation (preserved)
  useEffect(() => {
    const hackingTexts = [
      'BYPASSING_FIREWALL...', 'DECRYPTING_PACKETS...', 'INJECTING_PAYLOAD...',
      'ROOT_ACCESS_GRANTED...', 'UPLOADING_VIRUS...', 'SYSTEM_OVERRIDE...', 'NEURAL_SYNC_INIT...',
    ];
    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < hackingTexts.length) setLoadingText(hackingTexts[textIndex++]);
    }, 350);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => { setIsLoading(false); setTimeout(() => setShowContent(true), 300); }, 400);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);
    return () => { clearInterval(progressInterval); clearInterval(textInterval); };
  }, []);

  // Robot float (preserved)
  useEffect(() => {
    if (!isLoading || !robotRef.current) return;
    gsap.to(robotRef.current, { y: -8, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, [isLoading]);

  // Live stats updates (preserved)
  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        online: prev.online + Math.floor(Math.random() * 10) - 5,
        attacks: prev.attacks + Math.floor(Math.random() * 50),
        defenses: prev.defenses + Math.floor(Math.random() * 30),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [showContent]);

  // Entrance animations (preserved)
  useEffect(() => {
    if (!showContent) return;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const decor = decorRef.current;
    if (!headline || !subheadline || !cta || !decor) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      const chars = headline.querySelectorAll('.char');
      tl.fromTo(chars, { opacity: 0, y: 24, rotateX: 35 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.6 });
      tl.fromTo(subheadline, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
      tl.fromTo(cta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25');
      tl.fromTo(decor.querySelectorAll('.decor-item'), { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5 }, '-=0.5');
    });
    return () => ctx.revert();
  }, [showContent]);

  const scrollToEvents = () => {
    document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineText = 'AI×CYBERSECURITY';

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#05060B] py-12"
    >
      {/* ── Loading Overlay (preserved) ── */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#05060B] z-50 flex flex-col items-center justify-center">
          <MatrixRain />
          <div ref={robotRef} className="relative z-10 mb-8">
            <div className="w-24 h-24 bg-[#0B0E14]/80 border-2 border-[#39FF14] rounded-2xl flex items-center justify-center relative backdrop-blur-sm">
              <div className="w-14 h-12 bg-[#39FF14]/20 rounded-lg flex items-center justify-center gap-2 border border-[#39FF14]/30">
                <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_#39FF14]" />
                <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_10px_#39FF14]" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-[#39FF14]" />
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#39FF14] rounded-full animate-ping" />
              <div className="absolute top-1/2 -left-3 w-3 h-8 bg-[#39FF14]/30 rounded-full -rotate-12 border border-[#39FF14]/50" />
              <div className="absolute top-1/2 -right-3 w-3 h-8 bg-[#39FF14]/30 rounded-full rotate-12 border border-[#39FF14]/50" />
              <div className="absolute inset-0 bg-[#39FF14]/5 rounded-2xl blur-xl -z-10" />
            </div>
            <div
              className="absolute -inset-3 rounded-3xl border-2 border-[#39FF14]/20"
              style={{
                background: `conic-gradient(#39FF14 ${loadingProgress * 3.6}deg, transparent 0deg)`,
                mask: 'radial-gradient(transparent 65%, black 66%)',
                WebkitMask: 'radial-gradient(transparent 65%, black 66%)',
              }}
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#39FF14] text-[#05060B] px-4 py-1.5 rounded-full font-mono font-bold text-lg border-2 border-[#0B0E14] shadow-lg shadow-[#39FF14]/50">
              {Math.floor(loadingProgress)}%
            </div>
          </div>
          <div className="relative z-10 font-mono text-[#39FF14] text-sm tracking-widest animate-pulse">{loadingText}</div>
          <div className="relative z-10 mt-4 font-mono text-[10px] text-[#39FF14]/50 max-w-xs text-center">
            {'>'} {Array(20).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('')}
          </div>
        </div>
      )}

      {/* ── NEW: Three.js 3D Animated Background ── */}
      {!isLoading && <ThreeBackground />}

      {/* ── Radial glow overlays for depth ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(57,255,20,0.04) 0%, transparent 70%)' }} />
        {/* top-right accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(0,255,255,0.04) 0%, transparent 60%)' }} />
        {/* bottom-left accent */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px]"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(57,255,20,0.05) 0%, transparent 60%)' }} />
        {/* scan line overlay */}
        <div className="absolute inset-0 scan-lines" />
      </div>

      {/* ── Floating UI Elements (preserved) ── */}
      <FloatingElement icon={Shield} position={{ x: '10%', y: '20%' }} delay={0} size={50} />
      <FloatingElement icon={Lock} position={{ x: '85%', y: '25%' }} delay={0.5} size={45} />
      <FloatingElement icon={Terminal} position={{ x: '8%', y: '60%' }} delay={1} size={40} />
      <FloatingElement icon={Cpu} position={{ x: '88%', y: '65%' }} delay={1.5} size={45} />
      <FloatingElement icon={Zap} position={{ x: '15%', y: '75%' }} delay={2} size={35} />
      <FloatingElement icon={Activity} position={{ x: '80%', y: '80%' }} delay={2.5} size={40} />

      {/* ── Decorative text elements (preserved) ── */}
      <div ref={decorRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
        <div className="decor-item absolute top-[15%] left-[5%] font-mono text-xs text-[#39FF14]/10">01001000 01001001</div>
        <div className="decor-item absolute top-[30%] right-[8%] font-mono text-xs text-[#39FF14]/10">10110110 11001100</div>
        <div className="decor-item absolute bottom-[25%] left-[12%] font-mono text-xs text-[#39FF14]/10">00110011 01010101</div>
        <div className="decor-item absolute bottom-[35%] right-[5%] font-mono text-xs text-[#39FF14]/10">11110000 00001111</div>
        <div className="decor-item absolute top-[18%] right-[18%] w-16 h-16 border border-[#39FF14]/20 rotate-45" />
        <div className="decor-item absolute bottom-[30%] left-[8%] w-12 h-12 border border-[#39FF14]/15 rotate-12" />
        <div className="decor-item absolute top-[70%] right-[12%] w-8 h-8 bg-[#39FF14]/10 rotate-45" />
      </div>

      {/* ── Main content (preserved) ── */}
      <div
        className={`relative flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: 10 }}
      >
        {/* ── Welcome banner — always visible, shows user name when logged in ── */}
        {user ? (
          <div className="mb-5 inline-flex items-center gap-3 px-5 py-2.5 bg-[#39FF14]/15 border border-[#39FF14]/60 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.2)]">
            {/* Avatar initial */}
            <div className="w-7 h-7 rounded-full bg-[#39FF14] flex items-center justify-center flex-shrink-0">
              <span className="font-orbitron font-bold text-black text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#A6A9B6]">WELCOME BACK,</span>
              <span className="font-orbitron font-bold text-[#39FF14] text-sm tracking-wide">
                {user.name?.toUpperCase()}
              </span>
            </div>
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
          </div>
        ) : (
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full">
            <Zap className="w-4 h-4 text-[#39FF14]" />
            <span className="font-mono text-sm text-[#39FF14]">JOIN THE COMMUNITY</span>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <LiveActivity label="Online" value={liveStats.online.toString()} />
          <LiveActivity label="Attacks Blocked" value={liveStats.attacks.toLocaleString()} />
          <LiveActivity label="Defenses Active" value={liveStats.defenses.toLocaleString()} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full mb-6">
          <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
          <span className="font-mono text-xs text-[#39FF14] tracking-wider">AI × CYBERSECURITY COMMUNITY</span>
        </div>

        <h1
          ref={headlineRef}
          className="glitch-title font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider text-white mb-4 relative"
          data-text={headlineText}
        >
          {headlineText.split('').map((char, index) => (
            <span key={index} className="char inline-block hover:text-[#39FF14] transition-colors duration-100">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p ref={subheadlineRef} className="font-mono text-lg md:text-xl text-[#cadc21] mb-6 max-w-2xl">
          NOT A CLUB. A COMMUNITY <br /> BUILD .SECURE. LEAD
        </p>

        <button
          ref={ctaRef}
          onClick={scrollToEvents}
          className="cyber-button pulse-cta px-10 py-4 bg-[#39FF14]/10 border border-[#39FF14] rounded font-orbitron font-bold text-[#39FF14] text-lg tracking-wider hover:bg-[#39FF14]/20 transition-all duration-300 mb-6"
        >
          ENTER THE COMMUNITY
        </button>

        {showContent && (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-4">
            <AnimatedCounter target={2500} suffix="+" label="Members" />
            <AnimatedCounter target={150} suffix="+" label="Events" />
            <AnimatedCounter target={50} suffix="+" label="CTF Wins" />
          </div>
        )}

        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="font-mono text-xs text-[#A6A9B6]">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-[#39FF14] animate-bounce" />
        </div>
      </div>

      {/* ── Glitch + scan-line styles (preserved + extended) ── */}
      <style>{`
        .glitch-title {
          position: relative;
        }
        .glitch-title::before,
        .glitch-title::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-title::before {
          left: 2px;
          text-shadow: -2px 0 #ff00ff;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        .glitch-title::after {
          left: -2px;
          text-shadow: -2px 0 #00ffff;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0%   { clip: rect(10px, 9999px, 85px, 0); }
          20%  { clip: rect(65px, 9999px, 99px, 0); }
          40%  { clip: rect(15px, 9999px, 135px, 0); }
          60%  { clip: rect(80px, 9999px, 5px, 0); }
          80%  { clip: rect(40px, 9999px, 110px, 0); }
          100% { clip: rect(95px, 9999px, 60px, 0); }
        }
        @keyframes glitch-anim-2 {
          0%   { clip: rect(65px, 9999px, 140px, 0); }
          20%  { clip: rect(5px,  9999px, 50px,  0); }
          40%  { clip: rect(90px, 9999px, 120px, 0); }
          60%  { clip: rect(25px, 9999px, 75px,  0); }
          80%  { clip: rect(110px,9999px, 15px,  0); }
          100% { clip: rect(50px, 9999px, 100px, 0); }
        }
        .glitch-title:hover::before {
          animation: glitch-anim 0.3s infinite linear alternate-reverse;
        }
        .glitch-title:hover::after {
          animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
        }

        /* Subtle CRT scan lines */
        .scan-lines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(57, 255, 20, 0.012) 2px,
            rgba(57, 255, 20, 0.012) 4px
          );
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}