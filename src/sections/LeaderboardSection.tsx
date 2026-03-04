import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal, Target, Zap, Shield, Code, TrendingUp, Users, Activity, Award, Flame, BarChart3, PieChart } from 'lucide-react';

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
  },
];

// NEW DATA: Teams
const teamsData: Team[] = [
  {
    rank: 1,
    name: 'NullPointer',
    points: 45200,
    members: 4,
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80',
    tag: 'Elite',
  },
  {
    rank: 2,
    name: 'CyberWardens',
    points: 38900,
    members: 5,
    avatar: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200&q=80',
    tag: 'Veteran',
  },
  {
    rank: 3,
    name: 'ShellShock',
    points: 32100,
    members: 3,
    avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80',
    tag: 'Rising',
  },
];

const timeFilters = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'alltime', label: 'All-Time' },
];

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'CTF Master': Trophy,
  'Bug Hunter': Target,
  'Mentor': Shield,
  'Reverse Engineer': Code,
  'AI Security': Zap,
  'Web Exploit': Target,
  'OSINT Expert': Target,
  'ML Security': Zap,
  'Researcher': Code,
  'Community Lead': Shield,
  'Workshop Host': Shield,
  'Binary Ninja': Code,
  'Forensics': Target,
  'Cryptography': Shield,
  'Pwn': Target,
};

// Helper to generate mock activity data
const generateActivityData = () => {
  const weeks = 12;
  const days = 7;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      week.push(Math.floor(Math.random() * 5)); // 0-4 intensity
    }
    data.push(week);
  }
  return data;
};

const activityData = generateActivityData();

export default function LeaderboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('alltime');

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

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        title,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        list,
        { rotateY: -90, rotateX: 12, z: -400, opacity: 0 },
        { rotateY: 0, rotateX: 0, z: 0, opacity: 1, ease: 'none' },
        0
      );

      // Animate each row
      const rows = list.querySelectorAll('.leaderboard-row');
      scrollTl.fromTo(
        rows,
        { x: '18vw', opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.05
      );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        list,
        { rotateY: 0, opacity: 1 },
        { rotateY: 90, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        title,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // PRESERVED: Original Helper Functions
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

  const maxPoints = Math.max(...leaderboardData.map(d => d.points));

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      className="section-pinned flex flex-col justify-center relative overflow-hidden min-h-screen"
      style={{ perspective: '1000px' }}
    >
      {/* Title and Filters */}
      <div ref={titleRef} className="px-6 lg:px-16 mb-8">
        <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
          LEADERBOARD
        </h2>
        
        {/* Time filters */}
        <div className="flex gap-3">
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
      </div>

      {/* 
        ENHANCED CONTENT LAYOUT 
        Changed from simple centering to a Grid to accommodate Dashboard, List, and Sidebar
      */}
      <div
        ref={listRef}
        className="flex-1 px-6 lg:px-16 overflow-y-auto"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* LEFT COLUMN: User Dashboard & Activity (3 cols) */}
          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            
            {/* User Mini Dashboard */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#39FF14]/10 rounded-lg">
                  <Activity className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h3 className="font-orbitron font-bold text-white">Your Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Global Rank</span>
                  <span className="font-orbitron text-[#39FF14]">#42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Win Rate</span>
                  <span className="font-orbitron text-white">68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-[#A6A9B6]">Current Streak</span>
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="font-orbitron">12 Days</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#39FF14]/20">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs text-[#A6A9B6]">Next Rank</span>
                    <span className="font-mono text-xs text-[#39FF14]">450 pts</span>
                  </div>
                  <div className="h-1.5 bg-[#0B0E14] rounded-full overflow-hidden">
                    <div className="h-full bg-[#39FF14] w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Graph */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-bold text-white text-sm">Activity</h3>
                <BarChart3 className="w-4 h-4 text-[#39FF14]" />
              </div>
              
              {/* Heatmap Grid */}
              <div className="grid grid-cols-7 gap-1">
                {activityData.flat().map((level, i) => (
                  <div 
                    key={i}
                    className={`aspect-square rounded-sm ${
                      level === 0 ? 'bg-[#0B0E14]' : 
                      level === 1 ? 'bg-[#39FF14]/20' : 
                      level === 2 ? 'bg-[#39FF14]/40' : 
                      level === 3 ? 'bg-[#39FF14]/60' : 'bg-[#39FF14]'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-[#A6A9B6]">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#0B0E14] rounded-sm" />
                  <div className="w-2 h-2 bg-[#39FF14]/40 rounded-sm" />
                  <div className="w-2 h-2 bg-[#39FF14] rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <h3 className="font-orbitron font-bold text-white text-sm mb-4">Weekly Impact</h3>
              <div className="flex items-end justify-between h-24 gap-2">
                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                  <div key={i} className="w-full bg-[#0B0E14] rounded-t-sm relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-[#39FF14]/60 rounded-t-sm transition-all duration-500 group-hover:bg-[#39FF14]"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 font-mono text-[10px] text-[#A6A9B6]">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Leaderboard List (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.handle}
                className="leaderboard-row cyber-card corner-brackets rounded-lg p-4 flex items-center gap-4 group hover:border-[#39FF14] transition-all duration-300 bg-[#0B0E14]/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Rank */}
                <div className={`w-12 flex justify-center ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#39FF14]/30"
                    style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
                  />
                  {entry.trend === 'up' && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-orbitron font-bold text-white group-hover:text-[#39FF14] transition-colors">
                      {entry.name}
                    </h3>
                    <span className="font-mono text-sm text-[#A6A9B6]">{entry.handle}</span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {entry.badges.map((badge) => {
                      const Icon = badgeIcons[badge] || Shield;
                      return (
                        <span
                          key={badge}
                          className="flex items-center gap-1 px-2 py-0.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded text-xs font-mono text-[#39FF14]"
                        >
                          <Icon className="w-3 h-3" />
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="text-right">
                    <div className="font-mono text-xs text-[#A6A9B6]">Events</div>
                    <div className="font-orbitron font-bold text-white">{entry.events}</div>
                  </div>
                  
                  <div className="w-32">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-xs text-[#A6A9B6]">Points</span>
                      <span className="font-orbitron font-bold text-[#39FF14]">{entry.points.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[#0B0E14] border border-[#39FF14]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#39FF14]/40 to-[#39FF14] transition-all duration-1000"
                        style={{ width: `${(entry.points / maxPoints) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile points */}
                <div className="md:hidden text-right">
                  <div className="font-orbitron font-bold text-[#39FF14]">{entry.points.toLocaleString()}</div>
                  <div className="font-mono text-xs text-[#A6A9B6]">pts</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Teams & Misc (3 cols) */}
          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            
            {/* Top Teams */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Top Squads</h3>
              </div>
              
              <div className="space-y-4">
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
                        <h4 className="font-orbitron font-bold text-white group-hover:text-[#39FF14] transition-colors">{team.name}</h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#39FF14]/10 text-[#39FF14] rounded border border-[#39FF14]/30">
                          {team.tag}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-mono text-xs text-[#A6A9B6]">{team.members} members</span>
                        <span className="font-mono text-xs text-[#39FF14]">{team.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 border border-[#39FF14]/30 rounded font-mono text-xs text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-colors">
                View All Teams
              </button>
            </div>

            {/* Recent Achievements */}
            <div className="cyber-card corner-brackets rounded-lg p-5 border-[#39FF14]/30">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-[#39FF14]" />
                <h3 className="font-orbitron font-bold text-white">Latest Badges</h3>
              </div>
              <div className="space-y-3">
                {['First Blood', 'Speed Demon', 'Bug Bounty'].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 border border-[#39FF14]/10 rounded bg-[#050507]">
                    <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-[#39FF14]" />
                    </div>
                    <div>
                      <div className="font-mono text-sm text-white">{badge}</div>
                      <div className="font-mono text-[10px] text-[#A6A9B6]">Unlocked 2h ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#39FF14]/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#39FF14]/15 rounded-full" />
      </div>
    </section>
  );
}