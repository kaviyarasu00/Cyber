import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, Github, Linkedin, Shield, Code, Cpu, Globe, Filter, 
  BookOpen, X, Play, CheckCircle, Lock, ChevronRight, Award, Terminal,
  Edit3, Save, Plus, Trash2, Trophy, Star, Medal, Crown, Sparkles,
  FileBadge, ScrollText, Zap, Target, Flame, Gem
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Member {
  id: number;
  name: string;
  role: string;
  specialty: string;
  events: number;
  points: number;
  avatar: string;
  github?: string;
  linkedin?: string;
  skills: string[];
}

interface LearningModule {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  completed: boolean;
  locked: boolean;
  icon: typeof Shield;
  content?: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: typeof Trophy;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Special';
  unlocked: boolean;
  unlockedDate?: string;
  rarity: number;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  icon: typeof ScrollText;
  color: string;
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: 'Dhanuja',
    role: 'Security Lead',
    specialty: 'Penetration Testing',
    events: 12,
    points: 3200,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    skills: ['Web Exploit', 'Network Security', 'OSCP'],
  },
  {
    id: 2,
    name: 'Kavi',
    role: 'CTF Player',
    specialty: 'Reverse Engineering',
    events: 9,
    points: 2800,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    github: 'https://github.com',
    skills: ['Binary Exploitation', 'Assembly', 'Ghidra'],
  },
  {
    id: 3,
    name: 'Sanjay',
    role: 'AI Research',
    specialty: 'ML Security',
    events: 7,
    points: 2500,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    skills: ['Adversarial ML', 'Python', 'TensorFlow'],
  },
  {
    id: 4,
    name: 'Tharik',
    role: 'Developer',
    specialty: 'Secure Coding',
    events: 10,
    points: 2900,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    github: 'https://github.com',
    skills: ['Rust', 'Go', 'Smart Contracts'],
  },
  {
    id: 5,
    name: 'Rohit',
    role: 'Community',
    specialty: 'Event Organization',
    events: 15,
    points: 3500,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    linkedin: 'https://linkedin.com',
    skills: ['Leadership', 'Public Speaking', 'Mentoring'],
  },
  {
    id: 6,
    name: 'Aura',
    role: 'Mentor',
    specialty: 'Cryptography',
    events: 6,
    points: 2100,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    github: 'https://github.com',
    skills: ['Cryptanalysis', 'Mathematics', 'Zero-Knowledge'],
  },
];

const roleFilters = [
  { key: 'all', label: 'All Roles', icon: Filter },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'ai', label: 'AI/ML', icon: Cpu },
  { key: 'dev', label: 'Developer', icon: Code },
  { key: 'ops', label: 'Community', icon: Globe },
];

const iconMap: { [key: string]: typeof Shield } = {
  Shield,
  Globe,
  Terminal,
  Code,
  Cpu,
};

const initialLearningModules: LearningModule[] = [
  {
    id: 1,
    title: 'Web Security Fundamentals',
    description: 'Master the basics of web application security, including OWASP Top 10 vulnerabilities and secure coding practices.',
    difficulty: 'Beginner',
    duration: '4 weeks',
    lessons: 12,
    completed: true,
    locked: false,
    icon: Globe,
    content: 'Module content for Web Security...',
  },
  {
    id: 2,
    title: 'Advanced Penetration Testing',
    description: 'Deep dive into network penetration testing, exploitation techniques, and post-exploitation methodologies.',
    difficulty: 'Advanced',
    duration: '6 weeks',
    lessons: 18,
    completed: false,
    locked: false,
    icon: Terminal,
    content: 'Module content for Penetration Testing...',
  },
  {
    id: 3,
    title: 'Reverse Engineering Mastery',
    description: 'Learn to analyze and reverse engineer binary applications using industry-standard tools like Ghidra and IDA Pro.',
    difficulty: 'Intermediate',
    duration: '5 weeks',
    lessons: 15,
    completed: false,
    locked: true,
    icon: Code,
    content: 'Module content for Reverse Engineering...',
  },
  {
    id: 4,
    title: 'AI Security & Adversarial ML',
    description: 'Explore vulnerabilities in machine learning systems and learn to defend against adversarial attacks.',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    lessons: 10,
    completed: false,
    locked: true,
    icon: Cpu,
    content: 'Module content for AI Security...',
  },
  {
    id: 5,
    title: 'Cryptography & Zero-Knowledge Proofs',
    description: 'Understanding modern cryptographic protocols and implementing zero-knowledge proof systems.',
    difficulty: 'Advanced',
    duration: '8 weeks',
    lessons: 24,
    completed: false,
    locked: true,
    icon: Shield,
    content: 'Module content for Cryptography...',
  },
];

const initialBadges: Badge[] = [
  {
    id: 1,
    name: 'First Blood',
    description: 'Completed your first CTF challenge',
    icon: Target,
    tier: 'Bronze',
    unlocked: true,
    unlockedDate: '2024-01-15',
    rarity: 85,
  },
  {
    id: 2,
    name: 'Bug Hunter',
    description: 'Found and reported 5 valid security vulnerabilities',
    icon: Shield,
    tier: 'Silver',
    unlocked: true,
    unlockedDate: '2024-02-20',
    rarity: 45,
  },
  {
    id: 3,
    name: 'Code Breaker',
    description: 'Solved 10 cryptography challenges',
    icon: Lock,
    tier: 'Gold',
    unlocked: true,
    unlockedDate: '2024-03-10',
    rarity: 25,
  },
  {
    id: 4,
    name: 'Elite Hacker',
    description: 'Reached top 10 in global CTF leaderboard',
    icon: Crown,
    tier: 'Platinum',
    unlocked: false,
    rarity: 5,
  },
  {
    id: 5,
    name: 'Zero Day',
    description: 'Discovered a critical zero-day vulnerability',
    icon: Zap,
    tier: 'Special',
    unlocked: false,
    rarity: 1,
  },
  {
    id: 6,
    name: 'Team Player',
    description: 'Participated in 10 team events',
    icon: Star,
    tier: 'Silver',
    unlocked: true,
    unlockedDate: '2024-01-28',
    rarity: 60,
  },
  {
    id: 7,
    name: 'Mentor',
    description: 'Mentored 5 new club members',
    icon: Sparkles,
    tier: 'Gold',
    unlocked: true,
    unlockedDate: '2024-03-01',
    rarity: 30,
  },
  {
    id: 8,
    name: 'Speed Demon',
    description: 'Completed a challenge in under 5 minutes',
    icon: Flame,
    tier: 'Bronze',
    unlocked: true,
    unlockedDate: '2024-02-14',
    rarity: 70,
  },
  {
    id: 9,
    name: 'Diamond Hand',
    description: 'Maintained 30-day learning streak',
    icon: Gem,
    tier: 'Gold',
    unlocked: false,
    rarity: 15,
  },
  {
    id: 10,
    name: 'Grand Master',
    description: 'Completed all learning modules',
    icon: Trophy,
    tier: 'Platinum',
    unlocked: false,
    rarity: 3,
  },
];

const initialCertificates: Certificate[] = [
  {
    id: 1,
    title: 'Certified Ethical Hacker (CEH)',
    issuer: 'EC-Council',
    date: '2024-02-15',
    credentialId: 'ECC-2024-8842',
    icon: FileBadge,
    color: '#39FF14',
  },
  {
    id: 2,
    title: 'Offensive Security Certified Professional',
    issuer: 'Offensive Security',
    date: '2024-03-20',
    credentialId: 'OSCP-2024-1156',
    icon: ScrollText,
    color: '#FFD700',
  },
  {
    id: 3,
    title: 'AI Security Specialist',
    issuer: 'CyberLearn Academy',
    date: '2024-01-10',
    credentialId: 'CAS-2024-0092',
    icon: Award,
    color: '#00BFFF',
  },
];

export default function MembersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('all');
  const [showCyberLearn, setShowCyberLearn] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeRewardTab, setActiveRewardTab] = useState<'badges' | 'certificates'>('badges');
  
  // States that can be updated
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [learningModules, setLearningModules] = useState<LearningModule[]>(initialLearningModules);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  
  // Edit form state
  const [editForm, setEditForm] = useState<Partial<LearningModule>>({});

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRole === 'all' || 
                       member.role.toLowerCase().includes(activeRole) ||
                       member.specialty.toLowerCase().includes(activeRole);
    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!section || !title || !grid) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
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
        grid,
        { rotateX: 45, y: '70vh', opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, ease: 'none' },
        0
      );

      // Cards stagger
      const cards = grid.querySelectorAll('.member-card');
      scrollTl.fromTo(
        cards,
        { z: -300, opacity: 0, scale: 0.92 },
        { z: 0, opacity: 1, scale: 1, stagger: 0.02, ease: 'none' },
        0.05
      );

      // SETTLE (30% - 70%): Hold position

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        grid,
        { rotateX: 0, y: 0, opacity: 1 },
        { rotateX: -40, y: '-18vh', opacity: 0, ease: 'power2.in' },
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

  // UPDATE FUNCTIONS
  const handleEditModule = (module: LearningModule) => {
    setEditForm({ ...module });
    setIsEditing(true);
  };

  const handleSaveModule = () => {
    if (editForm.id) {
      setLearningModules(prev => prev.map(m => 
        m.id === editForm.id ? { ...m, ...editForm } as LearningModule : m
      ));
      setIsEditing(false);
      setEditForm({});
      // Update selected module if currently viewing
      if (selectedModule?.id === editForm.id) {
        setSelectedModule({ ...selectedModule, ...editForm } as LearningModule);
      }
    }
  };

  const handleDeleteModule = (id: number) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setLearningModules(prev => prev.filter(m => m.id !== id));
      if (selectedModule?.id === id) {
        setSelectedModule(null);
      }
    }
  };

  const handleAddModule = () => {
    const newModule: LearningModule = {
      id: Date.now(),
      title: 'New Module',
      description: 'Module description...',
      difficulty: 'Beginner',
      duration: '4 weeks',
      lessons: 10,
      completed: false,
      locked: false,
      icon: Shield,
      content: '',
    };
    setLearningModules(prev => [...prev, newModule]);
    handleEditModule(newModule);
  };

  const handleToggleComplete = (id: number) => {
    setLearningModules(prev => prev.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const handleToggleLock = (id: number) => {
    setLearningModules(prev => prev.map(m => 
      m.id === id ? { ...m, locked: !m.locked } : m
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10';
      case 'Intermediate': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Advanced': return 'text-red-400 border-red-400/50 bg-red-400/10';
      default: return 'text-[#39FF14]';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'from-orange-700 to-orange-900 border-orange-600 text-orange-400';
      case 'Silver': return 'from-slate-400 to-slate-600 border-slate-400 text-slate-300';
      case 'Gold': return 'from-yellow-500 to-yellow-700 border-yellow-500 text-yellow-400';
      case 'Platinum': return 'from-cyan-400 to-blue-600 border-cyan-400 text-cyan-300';
      case 'Special': return 'from-purple-500 to-pink-600 border-purple-500 text-purple-400';
      default: return 'from-[#39FF14] to-[#39FF14]/50 border-[#39FF14] text-[#39FF14]';
    }
  };

  const getRarityLabel = (rarity: number) => {
    if (rarity <= 5) return 'Legendary';
    if (rarity <= 15) return 'Epic';
    if (rarity <= 30) return 'Rare';
    if (rarity <= 60) return 'Uncommon';
    return 'Common';
  };

  return (
    <section
      ref={sectionRef}
      id="members"
      className="section-pinned flex flex-col justify-center relative overflow-hidden"
      style={{ perspective: '1100px' }}
    >
      {/* Title and Controls */}
      <div ref={titleRef} className="px-6 lg:px-16 mb-8">
        <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-6">
          MEMBERS
        </h2>
        
        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6A9B6]" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input w-64"
            />
          </div>

          {/* Role filters */}
          <div className="flex gap-2 flex-wrap">
            {roleFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveRole(filter.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-xs transition-all duration-300 ${
                  activeRole === filter.key
                    ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]'
                    : 'bg-transparent border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]/60'
                }`}
              >
                <filter.icon className="w-3 h-3" />
                {filter.label}
              </button>
            ))}
            
            {/* CyberLearn Button */}
            <button
              onClick={() => setShowCyberLearn(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-mono text-xs text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all duration-300 group"
            >
              <BookOpen className="w-3 h-3 group-hover:scale-110 transition-transform" />
              CyberLearn
            </button>

            {/* Rewards Button - NEXT TO CYBERLEARN */}
            <button
              onClick={() => setShowRewards(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#39FF14]/20 to-[#39FF14]/10 border border-[#39FF14] rounded-lg font-mono text-xs text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all duration-300 group"
            >
              <Trophy className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div
        ref={gridRef}
        className="flex-1 flex items-center justify-center px-6 lg:px-16"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className="member-card cyber-card corner-brackets rounded-lg p-5 group hover:translate-z-[18px] transition-all duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
                transform: `translateZ(${index % 2 === 0 ? '10px' : '-10px'})`,
              }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#39FF14]/50 group-hover:border-[#39FF14] transition-colors"
                    style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#39FF14] rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-[#05060B]" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-orbitron font-bold text-white group-hover:text-[#39FF14] transition-colors truncate">
                    {member.name}
                  </h3>
                  <p className="font-mono text-sm text-[#39FF14]">{member.role}</p>
                  <p className="font-mono text-xs text-[#A6A9B6]">{member.specialty}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4 py-3 border-y border-[#39FF14]/20">
                <div>
                  <div className="font-mono text-xs text-[#A6A9B6]">Events</div>
                  <div className="font-orbitron font-bold text-white">{member.events}</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-[#A6A9B6]">Points</div>
                  <div className="font-orbitron font-bold text-[#39FF14]">{member.points.toLocaleString()}</div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded text-xs font-mono text-[#39FF14]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all"
                  >
                    <Github className="w-4 h-4 text-[#A6A9B6] hover:text-[#39FF14]" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all"
                  >
                    <Linkedin className="w-4 h-4 text-[#A6A9B6] hover:text-[#39FF14]" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CyberLearn Modal */}
      {showCyberLearn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#05060B]/95 backdrop-blur-sm"
            onClick={() => {
              if (!isEditing) {
                setShowCyberLearn(false);
                setSelectedModule(null);
              }
            }}
          />
          
          <div className="relative w-full max-w-5xl h-[80vh] cyber-card rounded-lg overflow-hidden bg-[#0B0E14] border border-[#39FF14]/30 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#39FF14]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#39FF14]/20 rounded-lg flex items-center justify-center border border-[#39FF14]">
                  <BookOpen className="w-5 h-5 text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-xl text-white">CyberLearn</h3>
                  <p className="font-mono text-xs text-[#A6A9B6]">Master cybersecurity skills</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Add Module Button */}
                {!selectedModule && !isEditing && (
                  <button
                    onClick={handleAddModule}
                    className="flex items-center gap-2 px-3 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-mono text-xs text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Module
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setShowCyberLearn(false);
                    setSelectedModule(null);
                    setIsEditing(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-[#0B0E14] border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedModule && !isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningModules.map((module) => (
                    <div
                      key={module.id}
                      className="cyber-card corner-brackets rounded-lg p-5 transition-all duration-300 hover:border-[#39FF14]/60 hover:translate-y-[-4px] group"
                    >
                      <div className="flex items-start gap-4">
                        <div 
                          onClick={() => handleToggleLock(module.id)}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center border cursor-pointer transition-all ${
                            module.completed ? 'bg-[#39FF14]/20 border-[#39FF14]' : 
                            module.locked ? 'bg-[#A6A9B6]/10 border-[#A6A9B6]/30' : 
                            'bg-[#39FF14]/10 border-[#39FF14]/50'
                          }`}
                        >
                          {module.locked ? (
                            <Lock className="w-6 h-6 text-[#A6A9B6]" />
                          ) : module.completed ? (
                            <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                          ) : (
                            <module.icon className="w-6 h-6 text-[#39FF14]" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 
                              onClick={() => !module.locked && setSelectedModule(module)}
                              className={`font-orbitron font-bold text-white ${!module.locked && 'cursor-pointer hover:text-[#39FF14]'} transition-colors`}
                            >
                              {module.title}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditModule(module);
                                }}
                                className="p-1 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteModule(module.id);
                                }}
                                className="p-1 text-[#A6A9B6] hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="font-mono text-xs text-[#A6A9B6] mb-3 line-clamp-2">
                            {module.description}
                          </p>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase border ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            <span className="font-mono text-xs text-[#A6A9B6]">{module.duration}</span>
                            <span className="font-mono text-xs text-[#A6A9B6]">{module.lessons} lessons</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => !module.locked && setSelectedModule(module)}
                              className="flex items-center gap-1 font-mono text-xs text-[#39FF14] hover:gap-2 transition-all"
                            >
                              {module.completed ? 'Review Module' : module.locked ? 'Locked' : 'Start Learning'}
                              {!module.locked && <ChevronRight className="w-3 h-3" />}
                            </button>
                            
                            {/* Quick Toggle Complete */}
                            {!module.locked && (
                              <button
                                onClick={() => handleToggleComplete(module.id)}
                                className={`text-xs font-mono ${module.completed ? 'text-[#39FF14]' : 'text-[#A6A9B6]'} hover:text-[#39FF14]`}
                              >
                                {module.completed ? 'Completed' : 'Mark Complete'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEditing ? (
                /* EDIT MODE */
                <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({});
                      }}
                      className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back
                    </button>
                    <h3 className="font-orbitron font-bold text-white">Edit Module</h3>
                  </div>

                  <div className="cyber-card corner-brackets rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-[#A6A9B6] mb-2">Title</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white focus:border-[#39FF14] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-[#A6A9B6] mb-2">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white focus:border-[#39FF14] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-[#A6A9B6] mb-2">Difficulty</label>
                        <select
                          value={editForm.difficulty || 'Beginner'}
                          onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as any })}
                          className="w-full px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white focus:border-[#39FF14] focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#A6A9B6] mb-2">Duration</label>
                        <input
                          type="text"
                          value={editForm.duration || ''}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          className="w-full px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white focus:border-[#39FF14] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#A6A9B6] mb-2">Lessons</label>
                        <input
                          type="number"
                          value={editForm.lessons || 0}
                          onChange={(e) => setEditForm({ ...editForm, lessons: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white focus:border-[#39FF14] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveModule}
                        className="flex items-center gap-2 px-6 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({});
                        }}
                        className="px-6 py-3 bg-[#0B0E14] border border-[#A6A9B6]/30 rounded-lg font-mono text-sm text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* MODULE DETAIL VIEW */
                <div className="animate-in fade-in duration-300">
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="flex items-center gap-2 mb-4 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Modules
                  </button>

                  <div className="cyber-card corner-brackets rounded-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#39FF14]/20 rounded-lg flex items-center justify-center border border-[#39FF14]">
                          <selectedModule.icon className="w-8 h-8 text-[#39FF14]" />
                        </div>
                        <div>
                          <h3 className="font-orbitron font-bold text-2xl text-white mb-2">{selectedModule.title}</h3>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded text-xs font-mono uppercase border ${getDifficultyColor(selectedModule.difficulty)}`}>
                              {selectedModule.difficulty}
                            </span>
                            <span className="font-mono text-sm text-[#A6A9B6]">{selectedModule.duration}</span>
                            <span className="font-mono text-sm text-[#A6A9B6]">{selectedModule.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Edit button in detail view */}
                      <button
                        onClick={() => handleEditModule(selectedModule)}
                        className="flex items-center gap-2 px-3 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg font-mono text-xs text-[#39FF14] hover:bg-[#39FF14]/20 transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>

                    <p className="font-mono text-sm text-[#A6A9B6] mb-6 leading-relaxed">
                      {selectedModule.description}
                    </p>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                        <Play className="w-4 h-4" />
                        {selectedModule.completed ? 'Continue Learning' : 'Start Module'}
                      </button>
                      <button 
                        onClick={() => handleToggleComplete(selectedModule.id)}
                        className={`px-6 py-3 border rounded-lg font-mono text-sm transition-all ${
                          selectedModule.completed 
                            ? 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]' 
                            : 'bg-[#0B0E14] border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14] hover:text-[#39FF14]'
                        }`}
                      >
                        {selectedModule.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="cyber-card corner-brackets p-4 rounded-lg text-center">
                      <div className="font-orbitron font-bold text-2xl text-[#39FF14]">
                        {selectedModule.completed ? '100%' : '0%'}
                      </div>
                      <div className="font-mono text-xs text-[#A6A9B6]">Progress</div>
                    </div>
                    <div className="cyber-card corner-brackets p-4 rounded-lg text-center">
                      <div className="font-orbitron font-bold text-2xl text-white">
                        {selectedModule.completed ? selectedModule.lessons : 0}/{selectedModule.lessons}
                      </div>
                      <div className="font-mono text-xs text-[#A6A9B6]">Lessons Completed</div>
                    </div>
                    <div className="cyber-card corner-brackets p-4 rounded-lg text-center">
                      <div className="font-orbitron font-bold text-2xl text-white">
                        {selectedModule.locked ? 'Locked' : 'Unlocked'}
                      </div>
                      <div className="font-mono text-xs text-[#A6A9B6]">Status</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-[#39FF14]/20 bg-[#05060B]/50">
              <div className="flex items-center justify-between font-mono text-xs text-[#A6A9B6]">
                <div className="flex items-center gap-4">
                  <span>Total Modules: {learningModules.length}</span>
                  <span>Completed: {learningModules.filter(m => m.completed).length}</span>
                  <span>Locked: {learningModules.filter(m => m.locked).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Current Streak:</span>
                  <span className="text-[#39FF14]">5 days 🔥</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      {showRewards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#05060B]/95 backdrop-blur-sm"
            onClick={() => {
              setShowRewards(false);
              setSelectedBadge(null);
            }}
          />
          
          <div className="relative w-full max-w-5xl h-[80vh] cyber-card rounded-lg overflow-hidden bg-[#0B0E14] border border-[#39FF14]/30 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#39FF14]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#39FF14]/30 to-[#39FF14]/10 rounded-lg flex items-center justify-center border border-[#39FF14]">
                  <Trophy className="w-5 h-5 text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-xl text-white">Rewards Center</h3>
                  <p className="font-mono text-xs text-[#A6A9B6]">Achievements & Certifications</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowRewards(false);
                  setSelectedBadge(null);
                }}
                className="w-8 h-8 flex items-center justify-center bg-[#0B0E14] border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-4 border-b border-[#39FF14]/20 bg-[#05060B]/30">
              <button
                onClick={() => {
                  setActiveRewardTab('badges');
                  setSelectedBadge(null);
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeRewardTab === 'badges'
                    ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]'
                    : 'text-[#A6A9B6] hover:text-[#39FF14] border border-transparent'
                }`}
              >
                <Medal className="w-4 h-4" />
                Badges ({badges.filter(b => b.unlocked).length}/{badges.length})
              </button>
              <button
                onClick={() => {
                  setActiveRewardTab('certificates');
                  setSelectedBadge(null);
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeRewardTab === 'certificates'
                    ? 'bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]'
                    : 'text-[#A6A9B6] hover:text-[#39FF14] border border-transparent'
                }`}
              >
                <Award className="w-4 h-4" />
                Certificates ({certificates.length})
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeRewardTab === 'badges' ? (
                !selectedBadge ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={`cyber-card corner-brackets rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#39FF14]/60 group ${
                          !badge.unlocked ? 'opacity-60 grayscale' : ''
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${getTierColor(badge.tier)} border-2 flex flex-col items-center justify-center mb-3 relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
                          <badge.icon className={`w-10 h-10 ${badge.unlocked ? 'text-white' : 'text-[#A6A9B6]'} relative z-10`} />
                          {badge.unlocked && (
                            <div className="absolute top-1 right-1">
                              <Sparkles className="w-4 h-4 text-white animate-pulse" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-orbitron font-bold text-sm text-white text-center mb-1 group-hover:text-[#39FF14] transition-colors">
                          {badge.name}
                        </h4>
                        <p className="font-mono text-[10px] text-[#A6A9B6] text-center line-clamp-2">
                          {badge.tier}
                        </p>
                        {!badge.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#05060B]/80 rounded-lg">
                            <Lock className="w-6 h-6 text-[#A6A9B6]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Badge Detail View */
                  <div className="animate-in fade-in duration-300 max-w-2xl mx-auto">
                    <button
                      onClick={() => setSelectedBadge(null)}
                      className="flex items-center gap-2 mb-6 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back to Badges
                    </button>

                    <div className="cyber-card corner-brackets rounded-lg p-8 text-center">
                      <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${getTierColor(selectedBadge.tier)} border-4 flex items-center justify-center mb-6 relative overflow-hidden shadow-2xl shadow-${selectedBadge.tier === 'Special' ? 'purple' : selectedBadge.tier === 'Platinum' ? 'cyan' : selectedBadge.tier === 'Gold' ? 'yellow' : selectedBadge.tier === 'Silver' ? 'slate' : 'orange'}-500/20`}>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-40"></div>
                        <selectedBadge.icon className="w-16 h-16 text-white relative z-10 drop-shadow-lg" />
                        {selectedBadge.unlocked && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-8 h-8 bg-[#39FF14] rounded-full flex items-center justify-center border-2 border-[#05060B]">
                              <CheckCircle className="w-5 h-5 text-[#05060B]" />
                            </div>
                          </div>
                        )}
                      </div>

                      <h3 className="font-orbitron font-bold text-3xl text-white mb-2">{selectedBadge.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase border bg-gradient-to-r ${getTierColor(selectedBadge.tier)}`}>
                          {selectedBadge.tier}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30">
                          {getRarityLabel(selectedBadge.rarity)} • {selectedBadge.rarity}% have this
                        </span>
                      </div>

                      <p className="font-mono text-[#A6A9B6] mb-6 text-lg">
                        {selectedBadge.description}
                      </p>

                      {selectedBadge.unlocked ? (
                        <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#39FF14]/5 border-[#39FF14]/30">
                          <div className="flex items-center justify-center gap-2 text-[#39FF14] font-mono text-sm">
                            <CheckCircle className="w-5 h-5" />
                            Unlocked on {selectedBadge.unlockedDate}
                          </div>
                        </div>
                      ) : (
                        <div className="cyber-card corner-brackets rounded-lg p-4 bg-[#A6A9B6]/5 border-[#A6A9B6]/30">
                          <div className="flex items-center justify-center gap-2 text-[#A6A9B6] font-mono text-sm">
                            <Lock className="w-5 h-5" />
                            Locked - Complete requirements to unlock
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* Certificates View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="cyber-card corner-brackets rounded-lg p-6 transition-all duration-300 hover:border-[#39FF14]/60 hover:translate-y-[-4px] group relative overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#39FF14]/10 to-transparent rounded-bl-full"></div>
                      
                      <div className="flex items-start gap-4 relative z-10">
                        <div 
                          className="w-16 h-20 rounded-lg flex items-center justify-center border-2 shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${cert.color}20, ${cert.color}10)`,
                            borderColor: cert.color,
                            boxShadow: `0 0 20px ${cert.color}30`
                          }}
                        >
                          <cert.icon className="w-8 h-8" style={{ color: cert.color }} />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-orbitron font-bold text-lg text-white mb-1 group-hover:text-[#39FF14] transition-colors">
                            {cert.title}
                          </h4>
                          <p className="font-mono text-sm text-[#A6A9B6] mb-2">{cert.issuer}</p>
                          
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-mono text-xs text-[#A6A9B6] bg-[#05060B] px-2 py-1 rounded border border-[#39FF14]/20">
                              ID: {cert.credentialId}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#A6A9B6]">
                              Issued: {cert.date}
                            </span>
                            <button className="flex items-center gap-1 font-mono text-xs text-[#39FF14] hover:gap-2 transition-all">
                              View Credential <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#39FF14]/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
                          <span className="font-mono text-xs text-[#39FF14]">Verified</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all">
                            <Github className="w-4 h-4 text-[#A6A9B6] hover:text-[#39FF14]" />
                          </button>
                          <button className="p-2 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all">
                            <Linkedin className="w-4 h-4 text-[#A6A9B6] hover:text-[#39FF14]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Certificate Placeholder */}
                  <div className="cyber-card corner-brackets rounded-lg p-6 border-dashed border-2 border-[#39FF14]/30 flex flex-col items-center justify-center min-h-[200px] hover:border-[#39FF14]/60 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center mb-3 group-hover:bg-[#39FF14]/20 transition-all">
                      <Plus className="w-6 h-6 text-[#39FF14]" />
                    </div>
                    <span className="font-mono text-sm text-[#A6A9B6] group-hover:text-[#39FF14] transition-colors">
                      Add New Certificate
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-[#39FF14]/20 bg-[#05060B]/50">
              <div className="flex items-center justify-between font-mono text-xs text-[#A6A9B6]">
                <div className="flex items-center gap-4">
                  <span>Total Badges: {badges.length}</span>
                  <span>Unlocked: {badges.filter(b => b.unlocked).length}</span>
                  <span>Certificates: {certificates.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Completion:</span>
                  <span className="text-[#39FF14]">
                    {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent"
              style={{
                left: `${i * 10}%`,
                height: '100%',
                opacity: 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}