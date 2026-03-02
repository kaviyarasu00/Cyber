import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Github, Linkedin, Shield, Code, Cpu, Globe, Filter } from 'lucide-react';

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

const members: Member[] = [
  {
    id: 1,
    name: 'A. Rhea',
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
    name: 'D. Marc',
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
    name: 'S. Joon',
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
    name: 'L. Kira',
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
    name: 'M. Theo',
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
    name: 'P. Nico',
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

export default function MembersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('all');

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
          <div className="flex gap-2">
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
