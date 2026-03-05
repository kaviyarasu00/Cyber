import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu, X } from 'lucide-react';
import Login3D from './components/Login3D';
import HeroSection from './sections/HeroSection';
import EventsSection from './sections/EventsSection';
import LeaderboardSection from './sections/LeaderboardSection';
import MembersSection from './sections/MembersSection';
import FeedSection from './sections/FeedSection';
import AIAssistantSection from './sections/AIAssistantSection';
import ThreatSection from './sections/ThreatSection';
import FooterSection from './sections/FooterSection';
import ParticleBackground from './components/ParticleBackground';
import RealTimeNotifications from './components/RealTimeNotifications';

gsap.registerPlugin(ScrollTrigger);

// Main App Content (shown after login)
function MainApp() {
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // ✅ Added 'Threat' after 'AI Assistant'
  const navItems = ['Events', 'Leaderboard', 'Members', 'Feed', 'AI Assistant', 'Threat'];

  const scrollToSection = (item: string) => {
    // Map display name → section id
    const idMap: Record<string, string> = {
      'Events': 'events',
      'Leaderboard': 'leaderboard',
      'Members': 'members',
      'Feed': 'feed',
      'AI Assistant': 'ai-assistant',
      'Threat': 'threat',
    };
    const id = idMap[item] ?? item.toLowerCase().replace(/\s+/g, '-');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#05060B]">
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* 3D Particle Background */}
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-[#05060B]/80 backdrop-blur-md border-b border-[#39FF14]/20">
          <div className="px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="#" className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-[#39FF14]/20 border border-[#39FF14] rounded-full flex items-center justify-center">
                    <span className="font-orbitron font-bold text-[#39FF14] text-sm">C</span>
                  </div>
                </div>
                <span className="font-orbitron font-bold text-white text-sm sm:text-base">CYBERVERSE</span>
              </a>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center gap-6">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`font-mono text-sm transition-colors relative group ${
                      item === 'Threat'
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-[#A6A9B6] hover:text-[#39FF14]'
                    }`}
                  >
                    {item}
                    {/* NEW badge on Threat */}
                    {item === 'Threat' && (
                      <span className="absolute -top-2 -right-5 px-1 py-0.5 bg-red-500 text-white rounded font-mono text-[8px] font-bold leading-none">
                        NEW
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 sm:gap-4">
                <RealTimeNotifications />
                
                {/* User info - Hidden on small mobile */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-mono text-sm text-white">{user?.name}</p>
                    <p className="font-mono text-xs text-[#39FF14]">{user?.points} pts</p>
                  </div>
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border border-[#39FF14]/50"
                  />
                  <button
                    onClick={logout}
                    className="font-mono text-xs text-[#A6A9B6] hover:text-red-400 transition-colors"
                  >
                    Exit
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-[#39FF14] hover:bg-[#39FF14]/10 rounded-md transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 pt-2 border-t border-[#39FF14]/20 bg-[#05060B]/95">
              {/* Mobile Nav Links */}
              <div className="space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`w-full text-left px-3 py-3 rounded-md font-mono text-sm transition-all border-l-2 border-transparent flex items-center justify-between ${
                      item === 'Threat'
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400'
                        : 'text-[#A6A9B6] hover:text-[#39FF14] hover:bg-[#39FF14]/10 hover:border-[#39FF14]'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span>{item}</span>
                    {item === 'Threat' && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white rounded font-mono text-[9px] font-bold">NEW</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="mt-4 pt-4 border-t border-[#39FF14]/20">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border border-[#39FF14]/50"
                  />
                  <div>
                    <p className="font-mono text-sm text-white">{user?.name}</p>
                    <p className="font-mono text-xs text-[#39FF14]">{user?.points} pts</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 bg-[#39FF14]/10 border border-[#39FF14] rounded font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/20 transition-all"
                >
                  EXIT SYSTEM
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <HeroSection />
        <EventsSection />
        <LeaderboardSection />
        <MembersSection />
        <FeedSection />
        <AIAssistantSection />
        <ThreatSection />        {/* ✅ Threat Scanner — added after AI Assistant */}
        <FooterSection />
      </main>
    </div>
  );
}

// Root App with Auth
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => setShowMain(true), 100);
    } else {
      setShowMain(false);
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#05060B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-[#39FF14]">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login3D />;
  }

  return (
    <div className={`transition-opacity duration-500 ${showMain ? 'opacity-100' : 'opacity-0'}`}>
      <MainApp />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;