import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Calendar, Clock, Users, ArrowRight, Flame, Hourglass, CheckCircle, Play, Lock, X, Plus, Trash2, User, Check,
  Copy, MessageSquare, Crown, LogOut, Settings, Send, Shield, Trophy, LayoutGrid, ChevronLeft, Target, Search, Menu
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Event {
  id: number;
  title: string;
  type: 'live' | 'upcoming' | 'past';
  date: string;
  time: string;
  description: string;
  participants: number;
  image: string;
  isLocked?: boolean;
  eventDate?: string;
  category?: 'workshop' | 'hackathon' | 'masterclass' | 'challenge';
  maxParticipants?: number;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
}

interface MyTeam {
  id: string;
  name: string;
  eventId: number;
  eventName: string;
  eventDate: string;
  joinCode: string;
  members: TeamMember[];
  chat: { id: number; user: string; message: string; time: string; isSystem?: boolean }[];
}

// Real-time countdown hook
function useCountdown(targetDate: string | undefined) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return { timeLeft, isExpired };
}

// Time running display hook for live events
function useTimeRunning(startDate: string | undefined) {
  const [timeRunning, setTimeRunning] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startDate) return;

    const calculateTimeRunning = () => {
      const difference = new Date().getTime() - new Date(startDate).getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeRunning(calculateTimeRunning());

    const timer = setInterval(() => {
      setTimeRunning(calculateTimeRunning());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return { timeRunning };
}

// Countdown display component
function CountdownDisplay({ targetDate, type }: { targetDate?: string; type: string }) {
  const { timeLeft, isExpired } = useCountdown(targetDate);
  
  if (!targetDate) return null;
  
  const getCountdownStyle = () => {
    switch (type) {
      case 'live':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'past':
        return 'bg-[#A6A9B6]/20 border-[#A6A9B6]/50 text-[#A6A9B6]';
      case 'upcoming':
      default:
        return 'bg-[#39FF14]/20 border-[#39FF14]/50 text-[#39FF14]';
    }
  };
  
  if (isExpired) {
    return (
      <div className={`absolute bottom-3 right-3 backdrop-blur-sm border rounded-lg px-3 py-2 flex items-center gap-2 z-10 ${getCountdownStyle()}`}>
        <span className="font-mono text-xs font-bold">ENDED</span>
      </div>
    );
  }
  
  return (
    <div className={`absolute bottom-3 right-3 backdrop-blur-sm border rounded-lg px-3 py-2 flex items-center gap-2 z-10 ${getCountdownStyle()}`}>
      <div className="flex items-center gap-1 font-mono text-xs">
        <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="opacity-70">d</span>
        <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="opacity-70">h</span>
        <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="opacity-70">m</span>
        <span className="font-bold animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="opacity-70">s</span>
      </div>
    </div>
  );
}

// Time Running Display Component for Live Events
function TimeRunningDisplay({ startDate }: { startDate?: string }) {
  const { timeRunning } = useTimeRunning(startDate);
  
  if (!startDate) return null;
  
  return (
    <div className="absolute top-3 right-3 backdrop-blur-sm bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2 flex items-center gap-2 z-10">
      <div className="flex items-center gap-1 font-mono text-xs text-red-400">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="opacity-70">RUNNING</span>
        <span className="font-bold">{String(timeRunning.days).padStart(2, '0')}</span>
        <span className="opacity-70">d</span>
        <span className="font-bold">{String(timeRunning.hours).padStart(2, '0')}</span>
        <span className="opacity-70">h</span>
        <span className="font-bold">{String(timeRunning.minutes).padStart(2, '0')}</span>
        <span className="opacity-70">m</span>
        <span className="font-bold">{String(timeRunning.seconds).padStart(2, '0')}</span>
        <span className="opacity-70">s</span>
      </div>
    </div>
  );
}

// Interactive Percentage Circle Component
function RegistrationPercentage({ current, max }: { current: number; max: number }) {
  const percentage = Math.min((current / max) * 100, 100);
  const circumference = 2 * Math.PI * 14;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="#39FF14"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            fill="none"
            stroke="#39FF14"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[8px] text-[#39FF14] font-bold">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-xs text-white font-bold">{current}</span>
        <span className="font-mono text-[10px] text-[#A6A9B6]">/ {max}</span>
      </div>
    </div>
  );
}

const events: Event[] = [
  {
    id: 1,
    title: 'DEPLOYTHON',
    type: 'live',
    date: 'MAR -07',
    time: '6:00PM',
    description: 'Team-based web application penetration testing. Prizes for top 3 teams. Advanced persistence and privilege escalation challenges.',
    participants: 342,
    image: 'https://img.sanishtech.com/u/69b1f5c1f7b88a1e459a5865cc8e1ba5.png',
    eventDate: '2025-03-07T18:00:00Z',
    category: 'hackathon',
    maxParticipants: 500,
  },
  {
    id: 2,
    title: 'AI Security Workshop',
    type: 'upcoming',
    date: 'Mar 04, 2026',
    time: '17:00 UTC',
    description: 'Hands-on model hardening and adversarial examples. Learn to defend against AI-powered attacks. Certificate provided.',
    participants: 156,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80 ',
    eventDate: '2026-03-04T17:00:00Z',
    category: 'workshop',
    maxParticipants: 200,
  },
  {
    id: 3,
    title: 'Hackathon: Neon Night',
    type: 'past',
    date: 'Jan 20, 2026',
    time: 'Completed',
    description: '48-hour build marathon with security review. 47 projects submitted, 12 winners. $50k in prizes distributed.',
    participants: 523,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80 ',
    eventDate: '2026-01-20T09:00:00Z',
    category: 'hackathon',
    maxParticipants: 600,
  },
  {
    id: 4,
    title: 'Reverse Engineering Masterclass',
    type: 'upcoming',
    date: 'Mar 12, 2026',
    time: '15:00 UTC',
    description: 'Deep dive into malware analysis and binary exploitation with industry experts. 6-week intensive program.',
    participants: 89,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80 ',
    isLocked: true,
    eventDate: '2026-03-12T15:00:00Z',
    category: 'workshop',
    maxParticipants: 100,
  },
  {
    id: 5,
    title: 'Web App Pentest Challenge',
    type: 'past',
    date: 'Dec 15, 2025',
    time: 'Completed',
    description: 'Find vulnerabilities in realistic web applications. OWASP Top 10 focused. 200+ vulnerabilities found.',
    participants: 278,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80 ',
    eventDate: '2025-12-15T10:00:00Z',
    category: 'challenge',
    maxParticipants: 300,
  },
  {
    id: 6,
    title: 'Blockchain Security Workshop',
    type: 'upcoming',
    date: 'Mar 20, 2026',
    time: '14:00 UTC',
    description: 'Smart contract auditing and DeFi security. Learn to identify reentrancy and flash loan attacks.',
    participants: 124,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80 ',
    eventDate: '2026-03-20T14:00:00Z',
    category: 'workshop',
    maxParticipants: 150,
  },
  {
    id: 7,
    title: 'Global Hackathon: Cyber Wars',
    type: 'upcoming',
    date: 'Apr 05, 2026',
    time: '00:00 UTC',
    description: '72-hour international hacking competition. $100k prize pool. Categories: Web, Crypto, AI, and Hardware.',
    participants: 892,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80 ',
    eventDate: '2026-04-05T00:00:00Z',
    category: 'hackathon',
    maxParticipants: 1000,
  },
];

const filters = [
  { key: 'all', label: 'All', icon: null },
  { key: 'live', label: 'Live', icon: Flame },
  { key: 'upcoming', label: 'Upcoming', icon: Hourglass },
  { key: 'past', label: 'Past', icon: CheckCircle },
  { key: 'workshop', label: 'Workshops', icon: null },
  { key: 'hackathon', label: 'Hackathons', icon: null },
];

// Full-width running time banner for live events inside the modal
function ModalRunningTimeBanner({ startDate }: { startDate: string }) {
  const { timeRunning } = useTimeRunning(startDate);

  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-4 py-3 bg-red-500/10 border border-red-500/40 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
        <span className="font-mono text-xs text-red-400 uppercase font-bold tracking-widest">Event Running</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm text-red-300">
        <span className="font-bold tabular-nums">{String(timeRunning.days).padStart(2, '0')}</span>
        <span className="text-red-500 opacity-70">d</span>
        <span className="font-bold tabular-nums">{String(timeRunning.hours).padStart(2, '0')}</span>
        <span className="text-red-500 opacity-70">h</span>
        <span className="font-bold tabular-nums">{String(timeRunning.minutes).padStart(2, '0')}</span>
        <span className="text-red-500 opacity-70">m</span>
        <span className="font-bold tabular-nums animate-pulse">{String(timeRunning.seconds).padStart(2, '0')}</span>
        <span className="text-red-500 opacity-70">s</span>
      </div>
    </div>
  );
}

// Full-width countdown banner for upcoming events inside the modal
function ModalCountdownBanner({ targetDate }: { targetDate: string }) {
  const { timeLeft, isExpired } = useCountdown(targetDate);

  if (isExpired) return null;

  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-4 py-3 bg-[#39FF14]/10 border border-[#39FF14]/40 rounded-lg">
      <div className="flex items-center gap-2">
        <Hourglass className="w-3.5 h-3.5 text-[#39FF14] flex-shrink-0" />
        <span className="font-mono text-xs text-[#39FF14] uppercase font-bold tracking-widest">Starts In</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-sm text-[#39FF14]">
        <span className="font-bold tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="opacity-50">d</span>
        <span className="font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="opacity-50">h</span>
        <span className="font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="opacity-50">m</span>
        <span className="font-bold tabular-nums animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="opacity-50">s</span>
      </div>
    </div>
  );
}

// 3D Card Component
function EventCard({ 
  event, 
  index, 
  onClick 
}: { 
  event: Event; 
  index: number; 
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    if (isHovered) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'text-red-400 border-red-400/50 bg-red-400/10';
      case 'upcoming': return 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10';
      case 'past': return 'text-[#A6A9B6] border-[#A6A9B6]/50 bg-[#A6A9B6]/10';
      default: return 'text-[#39FF14]';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`cyber-card corner-brackets rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        event.isLocked ? 'opacity-70' : ''
      }`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ 
            filter: 'saturate(0.75) contrast(1.15) brightness(0.95)',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent" />
        
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border text-xs font-mono uppercase ${getTypeColor(event.type)}`}>
          {event.isLocked ? (
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          ) : (
            event.type
          )}
        </div>

        {/* Time Running Display for Live Events */}
        {event.type === 'live' && <TimeRunningDisplay startDate={event.eventDate} />}

        {/* Countdown for Upcoming Events */}
        {event.type === 'upcoming' && <CountdownDisplay targetDate={event.eventDate} type={event.type} />}

        {event.isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#05060B]/60">
            <div className="w-16 h-16 bg-[#39FF14]/20 border-2 border-[#39FF14] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#39FF14]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5" style={{ transform: 'translateZ(20px)' }}>
        <h3 className="font-orbitron font-bold text-lg text-white mb-2 group-hover:text-[#39FF14] transition-colors">
          {event.title}
        </h3>
        
        <p className="font-mono text-sm text-[#A6A9B6] mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-[#A6A9B6]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {event.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {event.time}
          </div>
        </div>

        {/* Interactive Percentage Registration Display */}
        <div className="mt-4 pt-4 border-t border-[#39FF14]/20">
          <div className="flex items-center justify-between">
            {event.maxParticipants && (
              <RegistrationPercentage current={event.participants} max={event.maxParticipants} />
            )}
            
            <button 
              className={`flex items-center gap-2 font-mono text-sm transition-all ${
                event.isLocked 
                  ? 'text-[#A6A9B6] cursor-not-allowed' 
                  : 'text-[#39FF14] hover:gap-3'
              }`}
              disabled={event.isLocked}
            >
              {event.isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock at Level 5
                </>
              ) : event.type === 'live' ? (
                <>
                  <Play className="w-4 h-4" />
                  Join Now
                </>
              ) : (
                <>
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Registration Modal — rendered via Portal to escape transformed parent
function TeamRegistrationModal({ 
  event, 
  onClose, 
  onSuccess,
  mode = 'team'
}: { 
  event: Event; 
  onClose: () => void;
  onSuccess: (teamData: { name: string; members: TeamMember[] }) => void;
  mode?: 'team' | 'individual';
}) {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([
    { id: 1, name: '', email: '', role: 'Leader', status: 'online' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const addMember = () => {
    if (members.length < 4) {
      setMembers([...members, { 
        id: Date.now(), 
        name: '', 
        email: '', 
        role: `Member ${members.length}`,
        status: 'offline'
      }]);
    }
  };

  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: number, field: keyof TeamMember, value: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      onSuccess({ name: teamName, members });
      onClose();
    }, 2000);
  };

  const isValid = teamName.trim() && members.every(m => m.name.trim() && m.email.trim());

  const modalContent = showSuccess ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm" />
      <div className="relative w-full max-w-md cyber-card rounded-lg overflow-hidden animate-in zoom-in duration-300 bg-[#0B0E14] border border-[#39FF14]/50 p-8 text-center">
        <div className="w-20 h-20 bg-[#39FF14]/20 border-2 border-[#39FF14] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Check className="w-10 h-10 text-[#39FF14]" />
        </div>
        <h3 className="font-orbitron font-bold text-2xl text-white mb-2">
          {mode === 'individual' ? 'REGISTRATION COMPLETE' : 'TEAM CONFIRMED'}
        </h3>
        <p className="font-mono text-[#39FF14] text-sm mb-2">
          {mode === 'individual' ? `Registered for ${event.title}` : `Team "${teamName}" is confirmed!`}
        </p>
        <p className="font-mono text-[#A6A9B6] text-xs">Redirecting...</p>
      </div>
    </div>
  ) : (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div 
        className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto cyber-card rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300 bg-[#0B0E14] border border-[#39FF14]/30"
      >
        <div className="relative h-32 bg-gradient-to-r from-[#39FF14]/20 to-[#0B0E14] p-6 flex items-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#0B0E14]/80 border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <p className="font-mono text-xs text-[#39FF14] mb-1">
              {mode === 'individual' ? 'WORKSHOP REGISTRATION' : 'TEAM REGISTRATION'}
            </p>
            <h3 className="font-orbitron font-bold text-xl text-white">{event.title}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-mono text-sm text-[#A6A9B6] mb-2">
              {mode === 'individual' ? 'Full Name' : 'Team Name'}
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={mode === 'individual' ? 'Enter your full name' : 'Enter team name'}
              className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
              required
            />
          </div>

          {mode === 'team' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block font-mono text-sm text-[#A6A9B6]">
                  Team Members <span className="text-[#39FF14]">({members.length}/4)</span>
                </label>
                {members.length < 4 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="flex items-center gap-1 px-3 py-1 bg-[#39FF14]/10 border border-[#39FF14]/50 rounded font-mono text-xs text-[#39FF14] hover:bg-[#39FF14]/20 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Member
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {members.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="p-4 bg-[#05060B] border border-[#39FF14]/20 rounded-lg relative group hover:border-[#39FF14]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#39FF14]" />
                      </div>
                      <span className="font-mono text-xs text-[#39FF14]">
                        {index === 0 ? 'Team Leader' : `Member ${index}`}
                      </span>
                      {members.length > 1 && index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMember(member.id)}
                          className="ml-auto text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        placeholder="Full Name"
                        className="px-3 py-2 bg-[#0B0E14] border border-[#39FF14]/20 rounded font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none transition-all"
                        required
                      />
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                        placeholder="Email Address"
                        className="px-3 py-2 bg-[#0B0E14] border border-[#39FF14]/20 rounded font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'individual' && (
            <div>
              <label className="block font-mono text-sm text-[#A6A9B6] mb-2">Email Address</label>
              <input
                type="email"
                value={members[0].email}
                onChange={(e) => updateMember(members[0].id, 'email', e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
                required
              />
            </div>
          )}

          <div className="p-4 bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-lg">
            <div className="flex items-center gap-4 text-xs font-mono text-[#A6A9B6]">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#39FF14]" />
                {event.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#39FF14]" />
                {event.time}
              </div>
              {event.category && (
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[#39FF14] uppercase">{event.category}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-4 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14] hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="font-mono">PROCESSING...</span>
              </>
            ) : (
              <>
                <span>{mode === 'individual' ? 'CONFIRM REGISTRATION' : 'CONFIRM TEAM'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  // ✅ Portal: renders outside the GSAP-transformed section, so fixed positioning works correctly
  return createPortal(modalContent, document.body);
}

export default function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
  const [registrationMode, setRegistrationMode] = useState<'team' | 'individual'>('team');
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null);
  const [activeTeamTab, setActiveTeamTab] = useState<'overview' | 'chat'>('overview');
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: number; user: string; message: string; time: string; isSystem?: boolean }[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredEvents = useCallback(() => {
    let filtered = events;
    
    if (activeFilter !== 'all') {
      if (activeFilter === 'workshop') {
        filtered = events.filter(e => e.category === 'workshop');
      } else if (activeFilter === 'hackathon') {
        filtered = events.filter(e => e.category === 'hackathon');
      } else {
        filtered = events.filter(e => e.type === activeFilter);
      }
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.type.toLowerCase().includes(query) ||
        (event.category && event.category.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [activeFilter, searchQuery]);

  const displayEvents = filteredEvents();

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!section || !title || !cardsContainer) return;

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

      scrollTl.fromTo(
        title,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        cardsContainer,
        { rotateX: 55, y: '60vh', opacity: 0 },
        { rotateX: 0, y: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        cardsContainer,
        { y: 0, rotateX: 0, opacity: 1 },
        { y: '-22vh', rotateX: -35, opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        title,
        { x: 0, opacity: 1 },
        { x: '-6vw', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleRegistrationSuccess = (teamData: { name: string; members: TeamMember[] }) => {
    if (registeringEvent) {
      const initialChat = [
        { id: 1, user: 'System', message: registrationMode === 'individual' ? `Registered for ${registeringEvent.title}` : `Team "${teamData.name}" created successfully!`, time: 'Just now', isSystem: true },
        { id: 2, user: 'System', message: `Event: ${registeringEvent.title}`, time: 'Just now', isSystem: true },
        { id: 3, user: 'You', message: registrationMode === 'individual' ? 'Excited to learn!' : 'Welcome team! Let\'s win this.', time: 'Just now' }
      ];
      
      const newTeam: MyTeam = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: teamData.name,
        eventId: registeringEvent.id,
        eventName: registeringEvent.title,
        eventDate: registeringEvent.date,
        joinCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        members: teamData.members.map((m, i) => ({
          ...m,
          avatar: undefined,
          status: i === 0 ? 'online' : 'offline'
        })),
        chat: initialChat
      };
      
      setMyTeam(newTeam);
      setChatMessages(initialChat);
      setRegisteringEvent(null);
    }
  };

  const handleCopyCode = () => {
    if (myTeam) {
      navigator.clipboard.writeText(myTeam.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !myTeam) return;
    
    const msg = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      time: 'Just now'
    };
    
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  const handleDisbandTeam = () => {
    if (confirm('Are you sure you want to leave this team?')) {
      setMyTeam(null);
      setActiveTeamTab('overview');
      setChatMessages([]);
    }
  };

  const handleBackToEvents = () => {
    setMyTeam(null);
    setActiveTeamTab('overview');
  };

  const openRegistration = (event: Event, mode: 'team' | 'individual') => {
    setRegistrationMode(mode);
    setRegisteringEvent(event);
    setSelectedEvent(null);
  };

  return (
    <section
      ref={sectionRef}
      id="events"
      className="section-pinned flex flex-col justify-center relative overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Title and Filters */}
      <div ref={titleRef} className="w-full px-4 sm:px-6 lg:px-16 mb-6">
        
        {/* Row 1: Title and Live Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {myTeam && (
              <button
                onClick={handleBackToEvents}
                className="flex items-center gap-2 px-3 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/20 transition-all group flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <h2 className="font-orbitron font-bold text-2xl sm:text-4xl md:text-5xl text-white">
              {myTeam ? 'MY TEAM' : 'EVENTS'}
            </h2>
          </div>
          
          {!myTeam && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full flex-shrink-0">
              <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="font-mono text-xs text-[#39FF14]">3 Live</span>
            </div>
          )}
        </div>

        {/* Row 2: Search and Filter Toggle (Mobile) */}
        {!myTeam && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6A9B6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none focus:ring-2 focus:ring-[#39FF14]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg font-mono text-sm text-[#39FF14] flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>Filters</span>
              {activeFilter !== 'all' && (
                <span className="w-2 h-2 bg-[#39FF14] rounded-full"></span>
              )}
            </button>
          </div>
        )}
        
        {/* Row 3: Filter Tabs */}
        {!myTeam && (
          <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveFilter(filter.key);
                    setShowMobileFilters(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-xs sm:text-sm transition-all duration-300 ${
                    activeFilter === filter.key
                      ? 'bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]'
                      : 'bg-transparent border-[#39FF14]/30 text-[#A6A9B6] hover:border-[#39FF14]/60'
                  }`}
                >
                  {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
                  <span>{filter.label}</span>
                </button>
              ))}
              
              {searchQuery && (
                <span className="font-mono text-xs text-[#A6A9B6] sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                  {displayEvents.length} result{displayEvents.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Team View Navigation */}
        {myTeam && (
          <div className="flex items-center justify-between border-b border-[#39FF14]/20 pb-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTeamTab('overview')}
                className={`flex items-center gap-2 font-mono text-sm transition-colors ${
                  activeTeamTab === 'overview' ? 'text-[#39FF14]' : 'text-[#A6A9B6] hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                onClick={() => setActiveTeamTab('chat')}
                className={`flex items-center gap-2 font-mono text-sm transition-colors ${
                  activeTeamTab === 'chat' ? 'text-[#39FF14]' : 'text-[#A6A9B6] hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Team Chat</span>
                {chatMessages.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#39FF14] text-black text-[10px] rounded-full">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            </div>
            
            <button
              onClick={handleDisbandTeam}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/50 rounded-lg font-mono text-xs sm:text-sm text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave Team</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div
        ref={cardsContainerRef}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-16 overflow-y-auto w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {myTeam ? (
          <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Left Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                <div className="cyber-card corner-brackets rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#39FF14]/20 rounded-full flex items-center justify-center border-2 border-[#39FF14] flex-shrink-0">
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#39FF14]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white truncate">{myTeam.name}</h3>
                      <p className="font-mono text-xs text-[#A6A9B6]">ID: {myTeam.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-[#39FF14]/20">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#A6A9B6]">Join Code</span>
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron text-[#39FF14] text-sm">{myTeam.joinCode}</span>
                        <button 
                          onClick={handleCopyCode}
                          className="text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                        >
                          {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#A6A9B6]">Members</span>
                      <span className="font-orbitron text-white">{myTeam.members.length}/4</span>
                    </div>
                  </div>
                </div>

                <div className="cyber-card corner-brackets rounded-lg p-4 sm:p-5">
                  <h4 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#39FF14]" />
                    Event Details
                  </h4>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="p-3 bg-[#05060B] rounded border border-[#39FF14]/10">
                      <div className="text-[#A6A9B6] text-xs mb-1">Competition</div>
                      <div className="text-white text-sm break-words">{myTeam.eventName}</div>
                    </div>
                    <div className="p-3 bg-[#05060B] rounded border border-[#39FF14]/10">
                      <div className="text-[#A6A9B6] text-xs mb-1">Date</div>
                      <div className="text-[#39FF14] text-sm">{myTeam.eventDate}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBackToEvents}
                  className="lg:hidden w-full flex items-center justify-center gap-2 p-3 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/20 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Events
                </button>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-2">
                {activeTeamTab === 'overview' ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="cyber-card corner-brackets p-3 sm:p-4 rounded-lg text-center">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#39FF14] mx-auto mb-2" />
                        <div className="font-orbitron font-bold text-xl sm:text-2xl text-white">0</div>
                        <div className="font-mono text-[10px] sm:text-xs text-[#A6A9B6]">Challenges</div>
                      </div>
                      <div className="cyber-card corner-brackets p-3 sm:p-4 rounded-lg text-center">
                        <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-2" />
                        <div className="font-orbitron font-bold text-xl sm:text-2xl text-white">12</div>
                        <div className="font-mono text-[10px] sm:text-xs text-[#A6A9B6]">Day Streak</div>
                      </div>
                      <div className="cyber-card corner-brackets p-3 sm:p-4 rounded-lg text-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
                        <div className="font-orbitron font-bold text-xl sm:text-2xl text-white">85%</div>
                        <div className="font-mono text-[10px] sm:text-xs text-[#A6A9B6]">Completion</div>
                      </div>
                    </div>

                    <div className="cyber-card corner-brackets rounded-lg p-4 sm:p-6">
                      <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#39FF14]" />
                        Squad Members
                      </h3>
                      <div className="space-y-3">
                        {myTeam.members.map((member, idx) => (
                          <div key={member.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#05060B] rounded-lg border border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-colors">
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#39FF14]/20 flex items-center justify-center border border-[#39FF14]/30">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#39FF14]" />
                              </div>
                              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#05060B] ${
                                member.status === 'online' ? 'bg-[#39FF14]' : 
                                member.status === 'busy' ? 'bg-orange-400' : 'bg-[#A6A9B6]'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-white font-bold text-sm truncate">{member.name || 'Anonymous'}</span>
                                {idx === 0 && <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />}
                              </div>
                              <span className="font-mono text-xs text-[#A6A9B6]">{member.role}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase flex-shrink-0 ${
                              member.status === 'online' ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'bg-[#A6A9B6]/10 text-[#A6A9B6]'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cyber-card corner-brackets rounded-lg p-4 sm:p-6 h-[400px] sm:h-[500px] flex flex-col">
                    <h3 className="font-orbitron font-bold text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#39FF14]" />
                      Team Communications
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.isSystem ? 'justify-center' : ''}`}>
                          {!msg.isSystem && (
                            <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-[#39FF14]" />
                            </div>
                          )}
                          <div className={`${msg.isSystem ? 'bg-[#39FF14]/10 px-4 py-2 rounded-full' : 'flex-1'}`}>
                            {!msg.isSystem && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-[#39FF14] font-bold">{msg.user}</span>
                                <span className="font-mono text-[10px] text-[#A6A9B6]">{msg.time}</span>
                              </div>
                            )}
                            <p className={`font-mono text-sm ${msg.isSystem ? 'text-[#39FF14] text-xs' : 'text-[#A6A9B6]'}`}>
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-[#39FF14]/20">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:border-[#39FF14] focus:outline-none"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg text-[#39FF14] hover:bg-[#39FF14]/30 transition-colors flex-shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl py-4">
            {displayEvents.length > 0 ? (
              displayEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  onClick={() => !event.isLocked && setSelectedEvent(event)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center px-4">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-[#39FF14]/30 mb-4" />
                <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white mb-2">No events found</h3>
                <p className="font-mono text-xs sm:text-sm text-[#A6A9B6]">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="mt-4 px-6 py-2 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/20 transition-all"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Event Detail Modal — via Portal so fixed positioning is relative to viewport, not transformed section */}
      {selectedEvent && !myTeam && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div 
            className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          />
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto cyber-card rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300 bg-[#0B0E14] border border-[#39FF14]/30"
          >
            <div className="relative h-48">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.75) contrast(1.15) brightness(0.95)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#0B0E14]/80 border border-[#39FF14]/30 rounded-full text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Running time overlay on modal image for live events */}
              {selectedEvent.type === 'live' && (
                <TimeRunningDisplay startDate={selectedEvent.eventDate} />
              )}
              {/* Countdown overlay on modal image for upcoming events */}
              {selectedEvent.type === 'upcoming' && (
                <CountdownDisplay targetDate={selectedEvent.eventDate} type={selectedEvent.type} />
              )}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className={`inline-block px-3 py-1 rounded-full border text-xs font-mono uppercase ${
                  selectedEvent.type === 'live' ? 'text-red-400 border-red-400/50 bg-red-400/10' :
                  selectedEvent.type === 'upcoming' ? 'text-[#39FF14] border-[#39FF14]/50 bg-[#39FF14]/10' :
                  'text-[#A6A9B6] border-[#A6A9B6]/50 bg-[#A6A9B6]/10'
                }`}>
                  {selectedEvent.type}
                </div>
                {selectedEvent.category && (
                  <div className="inline-block px-3 py-1 rounded-full border text-xs font-mono uppercase text-blue-400 border-blue-400/50 bg-blue-400/10">
                    {selectedEvent.category}
                  </div>
                )}
              </div>
              
              <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white mb-4">
                {selectedEvent.title}
              </h3>

              {/* Live event — prominent running time banner */}
              {selectedEvent.type === 'live' && selectedEvent.eventDate && (
                <ModalRunningTimeBanner startDate={selectedEvent.eventDate} />
              )}

              {/* Upcoming event — countdown banner */}
              {selectedEvent.type === 'upcoming' && selectedEvent.eventDate && (
                <ModalCountdownBanner targetDate={selectedEvent.eventDate} />
              )}
              
              <p className="font-mono text-[#A6A9B6] text-sm mb-6">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                <div className="p-2 sm:p-3 bg-[#0B0E14] border border-[#39FF14]/20 rounded">
                  <div className="flex items-center gap-1 sm:gap-2 text-[#39FF14] mb-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mono text-[10px] sm:text-xs">Date</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-white">{selectedEvent.date}</span>
                </div>
                <div className="p-2 sm:p-3 bg-[#0B0E14] border border-[#39FF14]/20 rounded">
                  <div className="flex items-center gap-1 sm:gap-2 text-[#39FF14] mb-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mono text-[10px] sm:text-xs">Time</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-white">{selectedEvent.time}</span>
                </div>
                <div className="p-2 sm:p-3 bg-[#0B0E14] border border-[#39FF14]/20 rounded">
                  <div className="flex items-center gap-1 sm:gap-2 text-[#39FF14] mb-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-mono text-[10px] sm:text-xs">Participants</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-white">{selectedEvent.participants}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {selectedEvent.type !== 'past' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {(selectedEvent.category === 'workshop' || selectedEvent.category === 'masterclass') && (
                      <button 
                        onClick={() => openRegistration(selectedEvent, 'individual')}
                        className="flex-1 py-3 bg-blue-500/20 border border-blue-500 rounded font-orbitron font-bold text-blue-400 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        REGISTER SOLO
                      </button>
                    )}
                    
                    {(selectedEvent.category === 'hackathon' || selectedEvent.category === 'challenge' || !selectedEvent.category) && (
                      <button 
                        onClick={() => openRegistration(selectedEvent, 'team')}
                        className="flex-1 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14]/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        REGISTER TEAM
                      </button>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-[#0B0E14] border border-[#A6A9B6]/30 rounded font-orbitron font-bold text-[#A6A9B6] hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ✅ Registration Modal — also via Portal for same reason */}
      {registeringEvent && (
        <TeamRegistrationModal
          event={registeringEvent}
          onClose={() => setRegisteringEvent(null)}
          onSuccess={handleRegistrationSuccess}
          mode={registrationMode}
        />
      )}
    </section>
  );
}