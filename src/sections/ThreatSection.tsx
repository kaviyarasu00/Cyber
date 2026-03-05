import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import {
  Zap, Shield, AlertTriangle, CheckCircle, XCircle, Code, Link, FileText,
  ChevronRight, RotateCcw, Eye, Lock, Database, Globe, Key, Cpu, Radio,
  AlertOctagon, Info, Copy, Check
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Three.js 3D Threat Background ───────────────────────────────────────────
function ThreatBackground({ threatLevel }: { threatLevel: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const threatRef = useRef(threatLevel);

  useEffect(() => {
    threatRef.current = threatLevel;
  }, [threatLevel]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 500);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const GREEN = new THREE.Color(0x39ff14);
    const RED = new THREE.Color(0xff2d2d);
    const ORANGE = new THREE.Color(0xff8c00);
    const CYAN = new THREE.Color(0x00ffff);

    // ── 1. Rotating DNA/helix threat strands ──
    const strand1Points: THREE.Vector3[] = [];
    const strand2Points: THREE.Vector3[] = [];
    for (let i = 0; i < 80; i++) {
      const t = (i / 80) * Math.PI * 6;
      const y = (i / 80) * 40 - 20;
      strand1Points.push(new THREE.Vector3(Math.cos(t) * 2 - 14, y, Math.sin(t) * 2));
      strand2Points.push(new THREE.Vector3(Math.cos(t + Math.PI) * 2 - 14, y, Math.sin(t + Math.PI) * 2));
    }
    const dnaGroup = new THREE.Group();
    const dna1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(strand1Points),
      new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.35 })
    );
    const dna2 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(strand2Points),
      new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.25 })
    );
    dnaGroup.add(dna1, dna2);
    for (let i = 0; i < 80; i += 5) {
      const rung = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([strand1Points[i], strand2Points[i]]),
        new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.1 })
      );
      dnaGroup.add(rung);
    }
    scene.add(dnaGroup);

    // ── 2. Large wireframe dodecahedron (right side) ──
    const dodecGeo = new THREE.DodecahedronGeometry(7, 0);
    const dodecMat = new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.08 });
    const dodec = new THREE.Mesh(dodecGeo, dodecMat);
    dodec.position.set(16, 2, -8);
    scene.add(dodec);

    // ── 3. Icosahedron cluster (top-left) ──
    const ico1 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(5, 1),
      new THREE.MeshBasicMaterial({ color: RED, wireframe: true, transparent: true, opacity: 0.07 })
    );
    ico1.position.set(-16, 8, -10);
    scene.add(ico1);

    // ── 4. Torus rings (background) ──
    const torusA = new THREE.Mesh(
      new THREE.TorusGeometry(8, 0.05, 16, 100),
      new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.12 })
    );
    torusA.position.set(5, -5, -12);
    torusA.rotation.x = Math.PI / 2.5;
    scene.add(torusA);

    const torusB = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.04, 16, 80),
      new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.1 })
    );
    torusB.position.set(-8, 4, -6);
    torusB.rotation.y = Math.PI / 3;
    scene.add(torusB);

    // ── 5. Floating octahedra (threat nodes) ──
    const threatNodes: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; baseY: number; speed: number }[] = [];
    const nodePositions = [[-18, 5, -4], [18, -6, -6], [-10, -8, -2], [12, 9, -8], [0, 12, -10], [-6, -12, -4], [8, -12, -8]];
    nodePositions.forEach(([x, y, z], i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? GREEN : i % 3 === 1 ? RED : ORANGE,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.5 + Math.random() * 0.6, 0), mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      threatNodes.push({ mesh, mat, baseY: y, speed: 0.008 + Math.random() * 0.012 });
    });

    // ── 6. Particle stream (data flow) ──
    const pCount = 600;
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 70;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
      pSpeeds[i] = 0.01 + Math.random() * 0.03;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: GREEN, size: 0.07, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── 7. Perspective grid ──
    const gridMat = new THREE.LineBasicMaterial({ color: 0x0d2200, transparent: true, opacity: 1 });
    for (let i = -8; i <= 8; i++) {
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-30, i * 2.2, -18), new THREE.Vector3(30, i * 2.2, -18)]),
        gridMat
      ));
      scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i * 3.5, -20, -18), new THREE.Vector3(i * 3.5, 20, -18)]),
        gridMat
      ));
    }

    // ── 8. Scanning ring (animated) ──
    const scanRingGeo = new THREE.TorusGeometry(12, 0.03, 8, 60);
    const scanMat = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.0 });
    const scanRing = new THREE.Mesh(scanRingGeo, scanMat);
    scanRing.rotation.x = Math.PI / 2;
    scanRing.position.z = -5;
    scene.add(scanRing);

    // ── 9. Tetrahedra accent ──
    const tetras: { mesh: THREE.Mesh; axis: THREE.Vector3; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.3 });
      const mesh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4 + Math.random() * 0.5), mat);
      mesh.position.set((Math.random() - 0.5) * 35, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 8 - 4);
      scene.add(mesh);
      tetras.push({ mesh, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 0.008 + Math.random() * 0.015 });
    }

    // Mouse parallax
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // Scan ring pulse animation (triggered when scanning)
    const pulseScan = () => {
      gsap.to(scanMat, { opacity: 0.4, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut',
        onComplete: () => { scanMat.opacity = 0; }
      });
      gsap.to(scanRing.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.5, ease: 'power2.out',
        onComplete: () => { scanRing.scale.set(1, 1, 1); }
      });
    };
    (window as any).__threatScanPulse = pulseScan;

    let frameId: number;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.004;

      // Camera parallax
      tx += (mx * 1.8 - tx) * 0.04;
      ty += (my * 1.2 - ty) * 0.04;
      camera.position.x = tx;
      camera.position.y = ty;
      camera.lookAt(0, 0, 0);

      // Threat-level color reactive
      const tl = threatRef.current;
      const heatColor = tl > 60 ? RED : tl > 30 ? ORANGE : GREEN;
      pMat.color.lerp(heatColor, 0.02);
      dodecMat.color.lerp(tl > 60 ? RED : GREEN, 0.015);

      dnaGroup.rotation.y += 0.003;
      dodec.rotation.x += 0.004;
      dodec.rotation.y += 0.006;
      ico1.rotation.x -= 0.003;
      ico1.rotation.z += 0.005;
      torusA.rotation.z += 0.005;
      torusB.rotation.x += 0.007;
      scanRing.rotation.z += 0.008;

      threatNodes.forEach(({ mesh, speed, baseY }, i) => {
        mesh.rotation.x += speed;
        mesh.rotation.y += speed * 0.7;
        mesh.position.y = baseY + Math.sin(t + i * 1.3) * 0.8;
      });

      tetras.forEach(({ mesh, axis, speed }) => {
        mesh.rotateOnAxis(axis, speed);
      });

      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3] += pSpeeds[i] * 0.3;
        pos[i * 3 + 1] += pSpeeds[i] * 0.15;
        if (pos[i * 3] > 35) pos[i * 3] = -35;
        if (pos[i * 3 + 1] > 25) pos[i * 3 + 1] = -25;
      }
      pGeo.attributes.position.needsUpdate = true;
      pMat.opacity = 0.35 + Math.sin(t * 1.5) * 0.15;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
}

// ─── OWASP Vulnerability Patterns ─────────────────────────────────────────────
const OWASP_PATTERNS = [
  {
    id: 'A01', name: 'SQL Injection', severity: 'critical', icon: Database,
    color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/40',
    patterns: [/SELECT\s+.*\s+FROM/i, /INSERT\s+INTO/i, /DROP\s+TABLE/i, /;\s*--/i, /UNION\s+SELECT/i, /OR\s+1\s*=\s*1/i, /'\s*OR\s*'/i, /exec\s*\(/i, /xp_cmdshell/i],
    description: 'Untrusted data sent to an interpreter as part of a command or query.',
  },
  {
    id: 'A02', name: 'Broken Authentication', severity: 'high', icon: Key,
    color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/40',
    patterns: [/password\s*=\s*["'][^"']+["']/i, /admin.*password/i, /hardcoded.*secret/i, /token\s*=\s*["'][^"']{5,}["']/i, /api_key\s*=\s*["'][^"']+["']/i],
    description: 'Application functions related to authentication and session management are implemented incorrectly.',
  },
  {
    id: 'A03', name: 'XSS', severity: 'high', icon: Globe,
    color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/40',
    patterns: [/<script[\s>]/i, /javascript:/i, /onerror\s*=/i, /onload\s*=/i, /innerHTML\s*=/i, /document\.write/i, /eval\s*\(/i, /\.html\s*\(/i],
    description: 'XSS flaws occur when an application includes untrusted data in a new web page.',
  },
  {
    id: 'A04', name: 'Insecure Design', severity: 'medium', icon: AlertOctagon,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40',
    patterns: [/TODO.*security/i, /FIXME.*auth/i, /hack\s*:/i, /bypass.*check/i, /skip.*validation/i],
    description: 'Missing or ineffective control design — security is not considered in design phase.',
  },
  {
    id: 'A05', name: 'Security Misconfiguration', severity: 'medium', icon: Cpu,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40',
    patterns: [/DEBUG\s*=\s*True/i, /CORS.*\*/i, /allow_all/i, /verify\s*=\s*False/i, /ssl_verify.*false/i, /debug.*true/i],
    description: 'Improperly configured permissions, unnecessary features enabled, or default credentials.',
  },
  {
    id: 'A06', name: 'Vulnerable Components', severity: 'medium', icon: Zap,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40',
    patterns: [/require\s+['"]lodash@3/i, /jquery@1\.[0-9]/i, /version.*1\.0\.[0-9]/i, /md5\s*\(/i, /sha1\s*\(/i],
    description: 'Components such as libraries, frameworks running with known vulnerabilities.',
  },
  {
    id: 'A07', name: 'Auth & Access Failures', severity: 'high', icon: Lock,
    color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/40',
    patterns: [/is_admin\s*=\s*True/i, /role\s*=\s*['"]admin['"]/i, /bypass.*auth/i, /skip.*auth/i, /no.*auth/i],
    description: 'Improper enforcement of authentication and authorization.',
  },
  {
    id: 'A08', name: 'Integrity Failures', severity: 'medium', icon: Shield,
    color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/40',
    patterns: [/deserializ/i, /pickle\.loads/i, /yaml\.load\s*\(/i, /unserializ/i, /marshal\.loads/i],
    description: 'Code and infrastructure that does not protect against integrity violations.',
  },
  {
    id: 'A09', name: 'Logging Failures', severity: 'low', icon: Eye,
    color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/40',
    patterns: [/catch\s*\([^)]*\)\s*\{\s*\}/i, /except.*pass/i, /swallow.*error/i, /silent.*fail/i],
    description: 'Failure to log, monitor or alert on security-relevant events.',
  },
  {
    id: 'A10', name: 'SSRF', severity: 'high', icon: Radio,
    color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/40',
    patterns: [/requests\.get\s*\(\s*[^)]*user/i, /fetch\s*\(\s*[^)]*user/i, /urllib.*open.*input/i, /curl.*\$_GET/i, /url=.*request\./i],
    description: 'Server-Side Request Forgery — server fetches a remote resource from user-supplied URL.',
  },
];

interface Finding {
  owaspId: string;
  name: string;
  severity: string;
  color: string;
  bg: string;
  border: string;
  line?: number;
  snippet: string;
  description: string;
}

// Demo presets
const DEMOS = {
  'SQL Injection': `# Python endpoint — vulnerable:
def get_user(email):
    query = f"SELECT * FROM users WHERE email = '{email}'"
    db.execute(query)`,
  'XSS': `// Vulnerable JS:
function renderComment(userInput) {
  document.getElementById('out').innerHTML = userInput;
  eval(userInput);
}`,
  'Hardcoded Creds': `# Config file — exposed secrets:
API_KEY = "sk-abc123supersecret"
password = "admin123"
DB_URL = "postgres://admin:password123@db"`,
  'JWT None Alg': `// JWT bypass vulnerability:
const token = jwt.sign(payload, '', { algorithm: 'none' });
is_admin = True  // bypass auth check
verify = False`,
  'Clean code': `// Clean React component:
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(\`/api/users/\${encodeURIComponent(userId)}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);
  return <div>{user?.name}</div>;
}`,
};

// ─── Threat Score Ring ─────────────────────────────────────────────────────────
function ThreatRing({ score, findings }: { score: number; findings: Finding[] }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? '#ff2d2d' : score >= 40 ? '#ff8c00' : score >= 10 ? '#facc15' : '#39ff14';
  const label = score >= 70 ? 'CRITICAL' : score >= 40 ? 'HIGH RISK' : score >= 10 ? 'MEDIUM' : 'CLEAN';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#0d1a0a" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-orbitron font-bold text-2xl" style={{ color }}>{score}</span>
          <span className="font-mono text-[10px] text-[#A6A9B6]">/100</span>
        </div>
      </div>
      <div className="text-center">
        <div className="font-orbitron font-bold text-sm" style={{ color }}>{label}</div>
        <div className="font-mono text-xs text-[#A6A9B6] mt-0.5">
          {findings.length} pattern{findings.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  );
}

// ─── Terminal Log ─────────────────────────────────────────────────────────────
function TerminalLog({ lines, isScanning }: { lines: string[]; isScanning: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="bg-[#030804] border border-[#39FF14]/20 rounded-lg overflow-hidden font-mono text-xs">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#39FF14]/10 bg-[#050f04]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[#39FF14]/50 ml-2">sys@cyberverse:~$</span>
        {isScanning && <div className="ml-auto flex items-center gap-1.5 text-[#39FF14]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
          <span className="text-[10px]">SCANNING</span>
        </div>}
      </div>
      <div className="p-4 h-52 overflow-y-auto space-y-1 scrollbar-thin">
        {lines.map((line, i) => (
          <div key={i} className={`flex items-start gap-2 ${line.startsWith('>') ? 'text-[#39FF14]/70' : line.includes('WARN') ? 'text-yellow-400' : line.includes('CRIT') || line.includes('ERR') ? 'text-red-400' : line.includes('complete') || line.includes('CLEAN') ? 'text-[#39FF14]' : 'text-[#A6A9B6]/80'}`}>
            <span className="opacity-40 flex-shrink-0">›</span>
            <span>{line}</span>
          </div>
        ))}
        {isScanning && (
          <div className="flex items-center gap-1 text-[#39FF14]">
            <span className="opacity-40">›</span>
            <span className="animate-pulse">█</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Finding Card ─────────────────────────────────────────────────────────────
function FindingCard({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(finding.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`rounded-lg border ${finding.border} ${finding.bg} overflow-hidden transition-all duration-300`}>
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`flex-shrink-0 w-7 h-7 rounded flex items-center justify-center ${finding.bg} border ${finding.border}`}>
          <AlertTriangle className={`w-3.5 h-3.5 ${finding.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#A6A9B6]">{finding.owaspId}</span>
            <span className={`font-orbitron font-bold text-xs ${finding.color}`}>{finding.name}</span>
          </div>
          {finding.line && (
            <div className="font-mono text-[10px] text-[#A6A9B6]/60">Line {finding.line}</div>
          )}
        </div>
        <span className={`px-2 py-0.5 rounded border font-mono text-[10px] uppercase ${finding.color} ${finding.border} ${finding.bg} flex-shrink-0`}>
          {finding.severity}
        </span>
        <ChevronRight className={`w-3.5 h-3.5 text-[#A6A9B6] flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-white/5 pt-2">
          <p className="font-mono text-xs text-[#A6A9B6]">{finding.description}</p>
          {finding.snippet && (
            <div className="relative bg-[#030804] rounded border border-[#39FF14]/10 p-2">
              <pre className={`font-mono text-[10px] ${finding.color} overflow-x-auto whitespace-pre-wrap`}>{finding.snippet}</pre>
              <button onClick={copy} className="absolute top-1.5 right-1.5 p-1 hover:bg-white/10 rounded transition-colors">
                {copied ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3 text-[#A6A9B6]" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main ThreatSection ───────────────────────────────────────────────────────
export default function ThreatSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'code' | 'url' | 'text'>('code');
  const [inputValue, setInputValue] = useState(DEMOS['SQL Injection']);
  const [urlValue, setUrlValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [threatScore, setThreatScore] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '> sys@cyberverse:~$',
    '> Initializing OWASP threat scan engine…',
    '> Pattern database loaded: 10 rules',
    '> Awaiting input…',
  ]);
  const [hasScanned, setHasScanned] = useState(false);

  // GSAP scroll animation
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    if (!section || !title || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.7,
        },
      });
      tl.fromTo(title, { x: '-10vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      tl.fromTo(content, { y: '40vh', rotateX: 40, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, ease: 'none' }, 0);
      tl.fromTo(content, { y: 0, opacity: 1 }, { y: '-20vh', rotateX: -25, opacity: 0, ease: 'power2.in' }, 0.75);
      tl.fromTo(title, { opacity: 1 }, { opacity: 0, ease: 'power2.in' }, 0.75);
    }, section);

    return () => ctx.revert();
  }, []);

  const getContent = useCallback((): string => {
    if (activeTab === 'code' || activeTab === 'text') return inputValue;
    return urlValue;
  }, [activeTab, inputValue, urlValue]);

  const runScan = useCallback(async () => {
    const content = getContent();
    if (!content.trim() || isScanning) return;

    setIsScanning(true);
    setFindings([]);
    setThreatScore(0);
    setHasScanned(false);

    // Trigger 3D scan pulse
    if ((window as any).__threatScanPulse) (window as any).__threatScanPulse();

    const logs: string[] = [
      '> sys@cyberverse:~$',
      '> Initializing OWASP threat scan engine…',
      '> Pattern database loaded: 10 rules',
      '> Scanning input for injection vectors…',
    ];
    setTerminalLines([...logs]);

    const addLog = async (line: string, delay = 280) => {
      await new Promise(r => setTimeout(r, delay));
      logs.push(line);
      setTerminalLines([...logs]);
    };

    await addLog('> Checking cryptographic weaknesses…');
    await addLog('> Analyzing authentication patterns…');
    await addLog('> Cross-referencing OWASP Top 10 (2021)…');
    await addLog('> Scanning for XSS vectors…');
    await addLog('> Checking server-side vulnerabilities…');

    // Run pattern matching
    const detectedFindings: Finding[] = [];
    const lines = content.split('\n');

    OWASP_PATTERNS.forEach(pattern => {
      lines.forEach((line, lineIdx) => {
        pattern.patterns.forEach(regex => {
          if (regex.test(line)) {
            const alreadyFound = detectedFindings.some(f => f.owaspId === pattern.id);
            if (!alreadyFound) {
              detectedFindings.push({
                owaspId: pattern.id,
                name: pattern.name,
                severity: pattern.severity,
                color: pattern.color,
                bg: pattern.bg,
                border: pattern.border,
                line: lineIdx + 1,
                snippet: line.trim().substring(0, 120),
                description: pattern.description,
              });
            }
          }
        });
      });
    });

    // Score calculation
    const severityWeights: Record<string, number> = { critical: 35, high: 20, medium: 10, low: 5 };
    const rawScore = detectedFindings.reduce((sum, f) => sum + (severityWeights[f.severity] || 5), 0);
    const score = Math.min(100, rawScore);

    await addLog('> Generating threat report…');
    await addLog(score === 0 ? '> CLEAN — No threats detected.' : `> ${detectedFindings.length} threat(s) detected. Score: ${score}/100`, 400);
    await addLog('> Scan complete.', 200);

    setFindings(detectedFindings);
    setThreatScore(score);
    setIsScanning(false);
    setHasScanned(true);
  }, [getContent, isScanning]);

  const reset = () => {
    setFindings([]);
    setThreatScore(0);
    setHasScanned(false);
    setTerminalLines(['> sys@cyberverse:~$', '> Awaiting input…']);
  };

  const tabs = [
    { key: 'code', label: 'Code', icon: Code },
    { key: 'url', label: 'URL', icon: Link },
    { key: 'text', label: 'Text', icon: FileText },
  ] as const;

  return (
    <section
      ref={sectionRef}
      id="threat"
      className="section-pinned flex flex-col justify-center relative overflow-hidden min-h-screen bg-[#05060B]"
      style={{ perspective: '1200px' }}
    >
      {/* ── 3D Background ── */}
      <ThreatBackground threatLevel={threatScore} />

      {/* ── Depth overlays ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(57,255,20,0.03) 0%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.008) 2px, rgba(57,255,20,0.008) 4px)'
        }} />
      </div>

      {/* ── Title ── */}
      <div ref={titleRef} className="relative w-full px-4 sm:px-6 lg:px-16 mb-5" style={{ zIndex: 10 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-xs text-red-400 uppercase tracking-widest">OWASP Top 10 Scanner</span>
            </div>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-5xl text-white">
              THREAT <span className="text-[#39FF14]">SCANNER</span>
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono text-xs text-red-400">EDUCATIONAL TOOL</span>
          </div>
        </div>
        <p className="font-mono text-sm text-[#A6A9B6] mt-1.5 max-w-xl">
          Paste code, URLs, or text to detect OWASP Top 10 vulnerability patterns instantly.
        </p>
      </div>

      {/* ── Main content ── */}
      <div
        ref={contentRef}
        className="relative flex-1 px-4 sm:px-6 lg:px-16 overflow-y-auto"
        style={{ zIndex: 10, transformStyle: 'preserve-3d' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto pb-4">

          {/* LEFT — Input panel */}
          <div className="space-y-4">

            {/* Educational disclaimer */}
            <div className="flex items-start gap-2 px-4 py-2.5 bg-yellow-400/5 border border-yellow-400/20 rounded-lg">
              <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="font-mono text-xs text-yellow-400/80">
                EDUCATIONAL TOOL — For learning & awareness. Not a substitute for a professional security audit.
              </p>
            </div>

            {/* Tab bar */}
            <div className="cyber-card corner-brackets rounded-lg overflow-hidden">
              <div className="flex border-b border-[#39FF14]/15">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 font-mono text-sm transition-all flex-1 justify-center ${
                      activeTab === key
                        ? 'bg-[#39FF14]/10 text-[#39FF14] border-b-2 border-[#39FF14]'
                        : 'text-[#A6A9B6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Input area */}
              <div className="p-4 bg-[#030804]">
                {activeTab === 'url' ? (
                  <input
                    type="url"
                    value={urlValue}
                    onChange={e => setUrlValue(e.target.value)}
                    placeholder="https://example.com/api/endpoint"
                    className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/20 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/40 focus:border-[#39FF14]/50 focus:outline-none transition-all"
                  />
                ) : (
                  <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={activeTab === 'code' ? '// Paste your code here…' : 'Paste text content to scan…'}
                    rows={10}
                    className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/20 rounded-lg font-mono text-sm text-[#39FF14]/90 placeholder-[#A6A9B6]/40 focus:border-[#39FF14]/50 focus:outline-none transition-all resize-none leading-relaxed"
                    style={{ fontFamily: "'Fira Code', 'Courier New', monospace" }}
                  />
                )}
              </div>

              {/* Demo presets */}
              <div className="px-4 pb-4 bg-[#030804]">
                <div className="text-[#A6A9B6] font-mono text-xs mb-2">Load demo:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(DEMOS).map(key => (
                    <button
                      key={key}
                      onClick={() => { setInputValue(DEMOS[key as keyof typeof DEMOS]); setActiveTab('code'); reset(); }}
                      className="px-3 py-1 border border-[#39FF14]/25 rounded font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14]/60 hover:text-[#39FF14] transition-all"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scan button */}
            <button
              onClick={runScan}
              disabled={isScanning || (!inputValue.trim() && !urlValue.trim())}
              className="w-full py-4 rounded-lg font-orbitron font-bold text-lg tracking-wider flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: isScanning
                  ? 'linear-gradient(135deg, #1a0000, #330000)'
                  : 'linear-gradient(135deg, #ff2d00, #39ff14)',
                border: '1px solid rgba(255,45,0,0.5)',
                color: '#fff',
                textShadow: '0 0 10px rgba(255,255,255,0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  SCANNING…
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  RUN THREAT SCAN
                </>
              )}
            </button>
          </div>

          {/* RIGHT — Results panel */}
          <div className="space-y-4">

            {/* Terminal */}
            <TerminalLog lines={terminalLines} isScanning={isScanning} />

            {/* Score + findings header */}
            {hasScanned && (
              <div className="cyber-card corner-brackets rounded-lg p-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="flex items-center gap-4">
                  <ThreatRing score={threatScore} findings={findings} />
                  <div className="flex-1">
                    {findings.length === 0 ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                          <span className="font-orbitron font-bold text-[#39FF14]">CLEAN</span>
                        </div>
                        <p className="font-mono text-xs text-[#A6A9B6]">No obvious vulnerabilities detected. Content appears clean.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="font-orbitron font-bold text-red-400">THREATS FOUND</span>
                        </div>
                        <div className="space-y-1 font-mono text-xs">
                          {['critical', 'high', 'medium', 'low'].map(sev => {
                            const count = findings.filter(f => f.severity === sev).length;
                            if (!count) return null;
                            const colors: Record<string, string> = { critical: 'text-red-400', high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-blue-400' };
                            return (
                              <div key={sev} className="flex items-center gap-2">
                                <span className={`capitalize ${colors[sev]}`}>{sev}:</span>
                                <span className="text-white font-bold">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={reset}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 border border-[#39FF14]/30 rounded font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Findings list */}
            {findings.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div className="font-mono text-xs text-[#A6A9B6] uppercase tracking-wider mb-2">
                  Detected Vulnerabilities ({findings.length})
                </div>
                {findings.map((f, i) => <FindingCard key={i} finding={f} />)}
              </div>
            )}

            {/* OWASP reference */}
            {!hasScanned && (
              <div className="cyber-card corner-brackets rounded-lg p-4">
                <h4 className="font-orbitron font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#39FF14]" />
                  OWASP Top 10 Coverage
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {OWASP_PATTERNS.map(p => {
                    const Icon = p.icon;
                    return (
                      <div key={p.id} className={`flex items-center gap-2 p-2 rounded border ${p.border} ${p.bg}`}>
                        <Icon className={`w-3 h-3 ${p.color} flex-shrink-0`} />
                        <div className="min-w-0">
                          <div className="font-mono text-[9px] text-[#A6A9B6]">{p.id}</div>
                          <div className={`font-mono text-[10px] ${p.color} truncate`}>{p.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}