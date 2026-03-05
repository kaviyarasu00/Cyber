import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPortal } from 'react-dom';
import {
  Trophy, Medal, Target, Zap, Shield, Code, TrendingUp, TrendingDown,
  Users, Activity, Award, Flame, BarChart3, X, ChevronUp, ChevronDown,
  Minus, Star, Lock, Eye, Cpu, Globe, GitBranch, Crosshair
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  points: number;
  events: number;
  badges: string[];
  avatar: string;
  trend: 'up' | 'down' | 'same';
  country: string;
  level: number;
  solves: number;
  joinedDays: number;
  speciality: string;
  weeklyPoints: number[];
}

interface Team {
  rank: number;
  name: string;
  points: number;
  members: number;
  avatar: string;
  tag: string;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'A. Rhea',
    handle: '@rhea_sec',
    points: 9840,
    events: 12,
    badges: ['CTF Master', 'Bug Hunter', 'Mentor'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    trend: 'same',
    country: '🇺🇸',
    level: 42,
    solves: 187,
    joinedDays: 312,
    speciality: 'Web Exploitation',
    weeklyPoints: [820, 950, 730, 1100, 880, 1040, 920],
  },
  {
    rank: 2,
    name: 'D. Marc',
    handle: '@marc_0x',
    points: 9612,
    events: 9,
    badges: ['Reverse Engineer', 'AI Security'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    trend: 'up',
    country: '🇩🇪',
    level: 38,
    solves: 154,
    joinedDays: 280,
    speciality: 'Reverse Engineering',
    weeklyPoints: [700, 800, 920, 860, 940, 780, 810],
  },
  {
    rank: 3,
    name: 'S. Joon',
    handle: '@joon_pwn',
    points: 9205,
    events: 7,
    badges: ['Web Exploit', 'OSINT Expert'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    trend: 'up',
    country: '🇰🇷',
    level: 35,
    solves: 143,
    joinedDays: 220,
    speciality: 'OSINT',
    weeklyPoints: [600, 750, 820, 700, 880, 920, 790],
  },
  {
    rank: 4,
    name: 'L. Kira',
    handle: '@kira_ai',
    points: 8890,
    events: 10,
    badges: ['ML Security', 'Researcher'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    trend: 'down',
    country: '🇯🇵',
    level: 33,
    solves: 129,
    joinedDays: 195,
    speciality: 'AI/ML Security',
    weeklyPoints: [900, 680, 750, 810, 670, 720, 740],
  },
  {
    rank: 5,
    name: 'M. Theo',
    handle: '@theo_root',
    points: 8740,
    events: 15,
    badges: ['Community Lead', 'Workshop Host'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    trend: 'same',
    country: '🇬🇧',
    level: 31,
    solves: 118,
    joinedDays: 410,
    speciality: 'Binary Exploitation',
    weeklyPoints: [750, 720, 780, 760, 740, 800, 730],
  },
  {
    rank: 6,
    name: 'P. Nico',
    handle: '@nico_bin',
    points: 8500,
    events: 6,
    badges: ['Binary Ninja', 'Forensics'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    trend: 'up',
    country: '🇫🇷',
    level: 29,
    solves: 102,
    joinedDays: 175,
    speciality: 'Forensics',
    weeklyPoints: [580, 620, 700, 650, 720, 680, 750],
  },
  {
    rank: 7,
    name: 'R. Elle',
    handle: '@elle_cyber',
    points: 8210,
    events: 8,
    badges: ['Cryptography', 'Pwn'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    trend: 'down',
    country: '🇧🇷',
    level: 27,
    solves: 96,
    joinedDays: 150,
    speciality: 'Cryptography',
    weeklyPoints: [850, 600, 680, 590, 640, 610, 580],
  },
];

const teamsData: Team[] = [
  { rank: 1, name: 'NullPointer', points: 45200, members: 4, avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80', tag: 'Elite' },
  { rank: 2, name: 'CyberWardens', points: 38900, members: 5, avatar: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200&q=80', tag: 'Veteran' },
  { rank: 3, name: 'ShellShock', points: 32100, members: 3, avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80', tag: 'Rising' },
];

const timeFilters = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'alltime', label: 'All-Time' },
];

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'CTF Master': Trophy, 'Bug Hunter': Target, 'Mentor': Shield,
  'Reverse Engineer': Code, 'AI Security': Zap, 'Web Exploit': Target,
  'OSINT Expert': Globe, 'ML Security': Cpu, 'Researcher': Code,
  'Community Lead': Shield, 'Workshop Host': Shield, 'Binary Ninja': Code,
  'Forensics': Eye, 'Cryptography': Lock, 'Pwn': Crosshair,
};

const generateActivityData = () => {
  const weeks = 12;
  const days = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      week.push(Math.floor(Math.random() * 5));
    }
    data.push(week);
  }
  return data;
};
const activityData = generateActivityData();

// Mini sparkline for weekly points
function Sparkline({ data, color = '#39FF14' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3" fill={color} />
        ) : null;
      })}
    </svg>
  );
}

// Level badge
function LevelBadge({ level }: { level: number }) {
  const tier = level >= 40 ? { label: 'ELITE', color: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' }
    : level >= 30 ? { label: 'PRO', color: 'text-purple-400 border-purple-400/50 bg-purple-400/10' }
    : { label: 'ADV', color: 'text-blue-400 border-blue-400/50 bg-blue-400/10' };
  return (
    <span className={`px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold ${tier.color}`}>
      {tier.label} {level}
    </span>
  );
}

// Profile modal
function ProfileModal({ entry, onClose }: { entry: LeaderboardEntry; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const maxW = Math.max(...entry.weeklyPoints);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-r from-[#39FF14]/10 via-[#0B0E14] to-[#39FF14]/5 border-b border-[#39FF14]/20">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute h-px bg-[#39FF14]/10" style={{ top: `${i * 14}%`, left: 0, right: 0 }} />
            ))}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#0B0E14]/80 border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] transition-colors z-10">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 left-6 translate-y-1/2 flex items-end gap-4">
            <div className="relative">
              <img src={entry.avatar} alt={entry.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#39FF14]" style={{ filter: 'saturate(0.8) contrast(1.1)' }} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#39FF14] rounded-full flex items-center justify-center font-orbitron text-[9px] text-black font-bold">{entry.rank}</div>
            </div>
          </div>
        </div>

        <div className="pt-10 px-6 pb-6">
          {/* Name row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-orbitron font-bold text-xl text-white">{entry.name}</h3>
                <span className="text-lg">{entry.country}</span>
                <LevelBadge level={entry.level} />
              </div>
              <p className="font-mono text-sm text-[#39FF14]">{entry.handle}</p>
              <p className="font-mono text-xs text-[#A6A9B6] mt-0.5">Speciality: <span className="text-white">{entry.speciality}</span></p>
            </div>
            <div className="text-right">
              <div className="font-orbitron font-bold text-2xl text-[#39FF14]">{entry.points.toLocaleString()}</div>
              <div className="font-mono text-xs text-[#A6A9B6]">total points</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Events', value: entry.events, icon: Trophy },
              { label: 'Solves', value: entry.solves, icon: Target },
              { label: 'Days Active', value: entry.joinedDays, icon: Flame },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-[#05060B] border border-[#39FF14]/15 rounded-lg p-3 text-center">
                <Icon className="w-4 h-4 text-[#39FF14] mx-auto mb-1" />
                <div className="font-orbitron font-bold text-white text-lg">{value}</div>
                <div className="font-mono text-[10px] text-[#A6A9B6]">{label}</div>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div className="bg-[#05060B] border border-[#39FF14]/15 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-mono text-xs text-[#A6A9B6] uppercase tracking-wider">Weekly Performance</h4>
              <Sparkline data={entry.weeklyPoints} />
            </div>
            <div className="flex items-end justify-between h-16 gap-1.5">
              {entry.weeklyPoints.map((pts, i) => {
                const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-[#0B0E14] rounded-sm relative overflow-hidden" style={{ height: '48px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#39FF14]/60 to-[#39FF14]/20 rounded-sm transition-all duration-700"
                        style={{ height: `${(pts / maxW) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-[#A6A9B6]">{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h4 className="font-mono text-xs text-[#A6A9B6] uppercase tracking-wider mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              {entry.badges.map((badge) => {
                const Icon = badgeIcons[badge] || Shield;
                return (
                  <span key={badge} className="flex items-center gap-1 px-2 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded text-xs font-mono text-[#39FF14]">
                    <Icon className="w-3 h-3" />
                    {badge}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Compare modal
function CompareModal({ a, b, onClose }: { a: LeaderboardEntry; b: LeaderboardEntry; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const stats = [
    { label: 'Points', aVal: a.points, bVal: b.points, format: (v: number) => v.toLocaleString() },
    { label: 'Events', aVal: a.events, bVal: b.events, format: (v: number) => String(v) },
    { label: 'Solves', aVal: a.solves, bVal: b.solves, format: (v: number) => String(v) },
    { label: 'Level', aVal: a.level, bVal: b.level, format: (v: number) => String(v) },
    { label: 'Days Active', aVal: a.joinedDays, bVal: b.joinedDays, format: (v: number) => String(v) },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-5 border-b border-[#39FF14]/20">
          <h3 className="font-orbitron font-bold text-white">COMPARE</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#05060B] border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player headers */}
        <div className="grid grid-cols-3 gap-4 p-5 border-b border-[#39FF14]/10">
          {[a, b].map((p, i) => (
            <div key={i} className={`${i === 1 ? 'col-start-3' : ''} text-center`}>
              <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#39FF14]/40 mx-auto mb-2" style={{ filter: 'saturate(0.8)' }} />
              <div className="font-orbitron font-bold text-white text-sm">{p.name}</div>
              <div className="font-mono text-xs text-[#39FF14]">#{p.rank}</div>
            </div>
          ))}
          <div className="col-start-2 row-start-1 flex items-center justify-center">
            <span className="font-orbitron text-[#39FF14]/50 text-lg">VS</span>
          </div>
        </div>

        {/* Stat rows */}
        <div className="p-5 space-y-3">
          {stats.map(({ label, aVal, bVal, format }) => {
            const aWins = aVal > bVal;
            const tied = aVal === bVal;
            const total = aVal + bVal || 1;
            const aPct = (aVal / total) * 100;
            return (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className={`font-orbitron text-sm font-bold ${aWins ? 'text-[#39FF14]' : tied ? 'text-white' : 'text-[#A6A9B6]'}`}>{format(aVal)}</span>
                  <span className="font-mono text-xs text-[#A6A9B6] uppercase tracking-wider">{label}</span>
                  <span className={`font-orbitron text-sm font-bold ${!aWins && !tied ? 'text-[#39FF14]' : tied ? 'text-white' : 'text-[#A6A9B6]'}`}>{format(bVal)}</span>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden bg-[#05060B]">
                  <div className="bg-[#39FF14] transition-all duration-700" style={{ width: `${aPct}%` }} />
                  <div className="bg-blue-400 flex-1 transition-all duration-700" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <div className="flex gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#39FF14] rounded-full" />{a.name}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-400 rounded-full" />{b.name}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function LeaderboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('alltime');
  const [profileEntry, setProfileEntry] = useState<LeaderboardEntry | null>(null);
  const [compareA, setCompareA] = useState<LeaderboardEntry | null>(null);
  const [compareB, setCompareB] = useState<LeaderboardEntry | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'points' | 'events' | 'solves'>('points');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // PRESERVED: Original Animation Logic
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const list = listRef.current;
    if (!section || !title || !list) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.7,
        },
      });

      scrollTl.fromTo(title, { x: '-10vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(list, { rotateY: -90, rotateX: 12, z: -400, opacity: 0 }, { rotateY: 0, rotateX: 0, z: 0, opacity: 1, ease: 'none' }, 0);

      const rows = list.querySelectorAll('.leaderboard-row');
      scrollTl.fromTo(rows, { x: '18vw', opacity: 0 }, { x: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0.05);

      scrollTl.fromTo(list, { rotateY: 0, opacity: 1 }, { rotateY: 90, opacity: 0, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(title, { opacity: 1 }, { opacity: 0, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-[#A6A9B6]';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-orbitron font-bold text-lg">{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp className="w-3 h-3 text-[#39FF14]" />;
    if (trend === 'down') return <ChevronDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-[#A6A9B6]" />;
  };

  const sortedData = [...leaderboardData]
    .filter(e => !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.handle.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const maxPoints = Math.max(...leaderboardData.map(d => d.points));

  const handleCompareSelect = (entry: LeaderboardEntry) => {
    if (!compareA) {
      setCompareA(entry);
    } else if (!compareB && entry.handle !== compareA.handle) {
      setCompareB(entry);
      setShowCompare(true);
    } else {
      setCompareA(entry);
      setCompareB(null);
    }
  };

  const isSelectedForCompare = (entry: LeaderboardEntry) =>
    compareA?.handle === entry.handle || compareB?.handle === entry.handle;

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="section-pinned flex flex-col justify-center relative overflow-hidden min-h-screen"
      style={{ perspective: '1000px' }}
    >
      {/* Title and Filters — PRESERVED */}
      <div ref={titleRef} className="px-6 lg:px-16 mb-6">
        <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4">
          LEADERBOARD
        </h2>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time filters */}
          <div className="flex gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full border font-mono text-sm transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]'
                    : 'bg-transparent border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]/60'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#39FF14]/20 hidden sm:block" />

          {/* Sort controls */}
          <div className="flex gap-2">
            {(['points', 'events', 'solves'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded border font-mono text-xs transition-all duration-300 capitalize ${
                  sortBy === s
                    ? 'bg-[#39FF14]/10 border-[#39FF14]/60 text-[#39FF14]'
                    : 'border-[#39FF14]/20 text-[#A6A9B6] hover:border-[#39FF14]/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#39FF14]/20 hidden sm:block" />

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search player..."
              className="pl-3 pr-8 py-1.5 bg-[#05060B] border border-[#39FF14]/20 rounded-lg font-mono text-xs text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14]/60 focus:outline-none w-36 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A6A9B6] hover:text-[#39FF14]">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Compare hint */}
          {compareA && !showCompare && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-400/10 border border-blue-400/30 rounded-lg">
              <GitBranch className="w-3 h-3 text-blue-400" />
              <span className="font-mono text-xs text-blue-400">Select 2nd to compare</span>
              <button onClick={() => setCompareA(null)} className="text-blue-400/60 hover:text-blue-400">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main grid — PRESERVED structure */}
      <div
        ref={listRef}
        className="flex-1 px-6 lg:px-16 overflow-y-auto"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

          {/* LEFT COLUMN — PRESERVED + enhanced */}
          <div className="lg:col-span-3 space-y-4 hidden lg:block">

            {/* User Stats */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#39FF14]/10 rounded-lg">
                  <Activity className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h3 className="font-orbitron font-bold text-white">Your Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Global Rank</span>
                  <span className="font-orbitron text-[#39FF14]">#42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Win Rate</span>
                  <span className="font-orbitron text-white">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Streak</span>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-orbitron">12 Days</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#39FF14]/20">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs text-[#A6A9B6]">Next Rank</span>
                    <span className="font-mono text-xs text-[#39FF14]">450 pts</span>
                  </div>
                  <div className="h-1.5 bg-[#0B0E14] rounded-full overflow-hidden">
                    <div className="h-full bg-[#39FF14] w-[75%] transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity heatmap */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-bold text-white text-sm">Activity</h3>
                <BarChart3 className="w-4 h-4 text-[#39FF14]" />
              </div>
              <div className="grid grid-cols-7 gap-1">
                {activityData.flat().map((level, i) => (
                  <div
                    key={i}
                    title={`${level} contributions`}
                    className={`aspect-square rounded-sm cursor-pointer hover:ring-1 hover:ring-[#39FF14]/50 transition-all ${
                      level === 0 ? 'bg-[#0B0E14]'
                      : level === 1 ? 'bg-[#39FF14]/20'
                      : level === 2 ? 'bg-[#39FF14]/40'
                      : level === 3 ? 'bg-[#39FF14]/60'
                      : 'bg-[#39FF14]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-[#A6A9B6]">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-[#0B0E14] rounded-sm" />
                  <div className="w-2 h-2 bg-[#39FF14]/40 rounded-sm" />
                  <div className="w-2 h-2 bg-[#39FF14] rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Weekly chart */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <h3 className="font-orbitron font-bold text-white text-sm mb-4">Weekly Impact</h3>
              <div className="flex items-end justify-between h-24 gap-2">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                  <div key={i} className="w-full bg-[#0B0E14] rounded-t-sm relative group cursor-pointer">
                    <div
                      className="absolute bottom-0 w-full bg-[#39FF14]/60 rounded-t-sm transition-all duration-500 group-hover:bg-[#39FF14]"
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B0E14] border border-[#39FF14]/40 rounded px-1 py-0.5 font-mono text-[9px] text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {h * 12} pts
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-[#A6A9B6]">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            {/* Compare button */}
            <button
              onClick={() => { setCompareA(null); setCompareB(null); setShowCompare(false); }}
              className="w-full py-2.5 border border-[#39FF14]/30 rounded-lg font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-colors flex items-center justify-center gap-2"
            >
              <GitBranch className="w-3.5 h-3.5" />
              {compareA ? `Comparing: ${compareA.name}` : 'Compare Players'}
            </button>
          </div>

          {/* CENTER — leaderboard rows */}
          <div className="lg:col-span-6 space-y-2">
            {sortedData.length === 0 && (
              <div className="text-center py-12 font-mono text-[#A6A9B6] text-sm">No players found</div>
            )}
            {sortedData.map((entry, index) => (
              <div key={entry.handle}>
                <div
                  className={`leaderboard-row cyber-card corner-brackets rounded-lg p-4 flex items-center gap-3 group transition-all duration-300 bg-[#0B0E14]/80 backdrop-blur-sm cursor-pointer
                    ${isSelectedForCompare(entry) ? 'border-blue-400/50 bg-blue-400/5' : 'hover:border-[#39FF14]'}
                    ${expandedRow === entry.rank ? 'border-[#39FF14]/60' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onMouseEnter={() => setHoveredRow(entry.rank)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Rank */}
                  <div className={`w-10 flex justify-center flex-shrink-0 ${getRankColor(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#39FF14]/30 group-hover:border-[#39FF14]/60 transition-colors"
                      style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
                    />
                    {/* Trend */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#0B0E14] rounded-full flex items-center justify-center border border-[#39FF14]/20">
                      {getTrendIcon(entry.trend)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-orbitron font-bold text-white group-hover:text-[#39FF14] transition-colors text-sm truncate">
                        {entry.name}
                      </h3>
                      <span className="text-sm flex-shrink-0">{entry.country}</span>
                      <LevelBadge level={entry.level} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#A6A9B6]">{entry.handle}</span>
                    </div>
                    {/* Badges — show on hover */}
                    <div className={`flex flex-wrap gap-1 mt-1.5 transition-all duration-200 overflow-hidden ${hoveredRow === entry.rank ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                      {entry.badges.slice(0, 2).map((badge) => {
                        const Icon = badgeIcons[badge] || Shield;
                        return (
                          <span key={badge} className="flex items-center gap-1 px-1.5 py-0.5 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded text-[10px] font-mono text-[#39FF14]">
                            <Icon className="w-2.5 h-2.5" />
                            {badge}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sparkline — hidden on small */}
                  <div className="hidden xl:block flex-shrink-0">
                    <Sparkline data={entry.weeklyPoints} />
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-5 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-[#A6A9B6]">Solves</div>
                      <div className="font-orbitron font-bold text-white text-sm">{entry.solves}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] text-[#A6A9B6]">Events</div>
                      <div className="font-orbitron font-bold text-white text-sm">{entry.events}</div>
                    </div>
                    <div className="w-28">
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-[10px] text-[#A6A9B6]">Points</span>
                        <span className="font-orbitron font-bold text-[#39FF14] text-xs">{entry.points.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-[#0B0E14] border border-[#39FF14]/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#39FF14]/40 to-[#39FF14] transition-all duration-1000"
                          style={{ width: `${(entry.points / maxPoints) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile points */}
                  <div className="md:hidden text-right flex-shrink-0">
                    <div className="font-orbitron font-bold text-[#39FF14] text-sm">{entry.points.toLocaleString()}</div>
                    <div className="font-mono text-[10px] text-[#A6A9B6]">pts</div>
                  </div>

                  {/* Action buttons */}
                  <div className={`flex gap-1.5 flex-shrink-0 transition-all duration-200 ${hoveredRow === entry.rank ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                      onClick={e => { e.stopPropagation(); setProfileEntry(entry); }}
                      title="View Profile"
                      className="w-7 h-7 flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 rounded hover:bg-[#39FF14]/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#39FF14]" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleCompareSelect(entry); }}
                      title="Compare"
                      className={`w-7 h-7 flex items-center justify-center border rounded transition-colors ${
                        isSelectedForCompare(entry)
                          ? 'bg-blue-400/20 border-blue-400/50'
                          : 'bg-[#39FF14]/10 border-[#39FF14]/30 hover:bg-[#39FF14]/20'
                      }`}
                    >
                      <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setExpandedRow(expandedRow === entry.rank ? null : entry.rank); }}
                      title="Quick Stats"
                      className="w-7 h-7 flex items-center justify-center bg-[#39FF14]/10 border border-[#39FF14]/30 rounded hover:bg-[#39FF14]/20 transition-colors"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-[#39FF14]" />
                    </button>
                  </div>
                </div>

                {/* Expandable quick stats */}
                {expandedRow === entry.rank && (
                  <div className="mx-1 bg-[#05060B] border border-[#39FF14]/20 border-t-0 rounded-b-lg px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div>
                      <div className="font-mono text-[10px] text-[#A6A9B6] mb-0.5">Speciality</div>
                      <div className="font-mono text-xs text-white">{entry.speciality}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#A6A9B6] mb-0.5">Days Active</div>
                      <div className="font-orbitron text-xs text-[#39FF14]">{entry.joinedDays}d</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#A6A9B6] mb-1">This Week</div>
                      <Sparkline data={entry.weeklyPoints} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[#A6A9B6] mb-0.5">Badges</div>
                      <div className="font-orbitron text-xs text-white">{entry.badges.length} earned</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN — PRESERVED + enhanced */}
          <div className="lg:col-span-3 space-y-4 hidden lg:block">

            {/* Top Teams */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Top Squads</h3>
              </div>
              <div className="space-y-3">
                {teamsData.map((team) => (
                  <div key={team.name} className="flex items-center gap-3 p-2 rounded hover:bg-[#39FF14]/5 transition-colors cursor-pointer group">
                    <div className="relative">
                      <img src={team.avatar} alt={team.name} className="w-10 h-10 rounded-lg object-cover border border-[#39FF14]/30" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0B0E14] border border-[#39FF14] rounded-full flex items-center justify-center font-orbitron text-[8px] text-[#39FF14]">
                        {team.rank}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-orbitron font-bold text-white group-hover:text-[#39FF14] transition-colors text-sm">{team.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#39FF14]/10 text-[#39FF14] rounded border border-[#39FF14]/30">{team.tag}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-mono text-xs text-[#A6A9B6]">{team.members} members</span>
                        <span className="font-mono text-xs text-[#39FF14]">{team.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 border border-[#39FF14]/30 rounded font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-colors">
                View All Teams
              </button>
            </div>

            {/* Recent Achievements */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Latest Badges</h3>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'First Blood', time: '2h ago', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
                  { name: 'Speed Demon', time: '5h ago', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
                  { name: 'Bug Bounty', time: '1d ago', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
                ].map((badge, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 border rounded ${badge.bg} group hover:scale-[1.01] transition-transform cursor-pointer`}>
                    <div className="w-8 h-8 rounded-full bg-[#0B0E14] flex items-center justify-center flex-shrink-0">
                      <Star className={`w-4 h-4 ${badge.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`font-mono text-sm ${badge.color}`}>{badge.name}</div>
                      <div className="font-mono text-[10px] text-[#A6A9B6]">Unlocked {badge.time}</div>
                    </div>
                    <Zap className={`w-3.5 h-3.5 ${badge.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Live feed */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
                <h3 className="font-orbitron font-bold text-white text-sm">Live Feed</h3>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { user: '@rhea_sec', action: 'solved Web #42', pts: '+120', time: '1m' },
                  { user: '@marc_0x', action: 'joined Deploython', pts: '', time: '4m' },
                  { user: '@joon_pwn', action: 'earned First Blood', pts: '+500', time: '9m' },
                  { user: '@kira_ai', action: 'solved Crypto #17', pts: '+80', time: '12m' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5 border-b border-[#39FF14]/10 last:border-0">
                    <span className="text-[#39FF14] flex-shrink-0">{item.user}</span>
                    <span className="text-[#A6A9B6] flex-1">{item.action}</span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.pts && <span className="text-[#39FF14]">{item.pts}</span>}
                      <span className="text-[#A6A9B6]/50">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background decoration — PRESERVED */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#39FF14]/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#39FF14]/15 rounded-full" />
      </div>

      {/* Profile modal */}
      {profileEntry && <ProfileModal entry={profileEntry} onClose={() => setProfileEntry(null)} />}

      {/* Compare modal */}
      {showCompare && compareA && compareB && (
        <CompareModal
          a={compareA}
          b={compareB}
          onClose={() => { setShowCompare(false); setCompareA(null); setCompareB(null); }}
        />
      )}
    </section>
  );
}