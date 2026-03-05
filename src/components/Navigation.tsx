import { useState, useEffect } from 'react';
import { Menu, X, Shield, Zap, AlertTriangle, Gamepad2 } from 'lucide-react'; // ✅ Added Gamepad2 icon

interface NavigationProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Navigation({ onLoginClick, onSignupClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = navLinks.map(l => l.href.replace('#', ''));
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Events',       href: '#events' },
    { label: 'Leaderboard',  href: '#leaderboard' },
    { label: 'Members',      href: '#members' },
    { label: 'Feed',         href: '#feed' },
    { label: 'AI Assistant', href: '#ai-assistant' },
    // ✅ Threat Scanner — added after AI Assistant
    { label: 'Threat',       href: '#threat', isNew: true, isDanger: true },
    // ✅ Cyber Games — added after Threat
    { label: 'Games',        href: '#games', isHot: true, hasIcon: true },
  ];

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#05060B]/90 backdrop-blur-md border-b border-[#39FF14]/20'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── Logo ── */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-[#39FF14] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                <Zap className="w-4 h-4 text-[#39FF14] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-orbitron font-bold text-lg lg:text-xl tracking-wider text-white group-hover:text-[#39FF14] transition-colors">
                CYBERVERSE
              </span>
            </a>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className={`relative flex items-center gap-1.5 font-mono text-sm transition-colors duration-300 group ${
                      link.isDanger
                        ? isActive ? 'text-red-400' : 'text-red-400/70 hover:text-red-400'
                        : link.label === 'Games'
                        ? isActive ? 'text-[#FF00FF]' : 'text-[#FF00FF]/70 hover:text-[#FF00FF]'
                        : isActive ? 'text-[#39FF14]' : 'text-[#A6A9B6] hover:text-[#39FF14]'
                    }`}
                  >
                    {/* Icons */}
                    {link.isDanger && (
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    {link.hasIcon && (
                      <Gamepad2 className="w-3.5 h-3.5 flex-shrink-0" />
                    )}

                    {link.label}

                    {/* NEW badge */}
                    {link.isNew && (
                      <span className="px-1 py-0.5 bg-red-500 text-white rounded font-mono text-[8px] font-bold leading-none">
                        NEW
                      </span>
                    )}
                    {/* HOT badge */}
                    {link.isHot && (
                      <span className="px-1 py-0.5 bg-[#FF00FF] text-white rounded font-mono text-[8px] font-bold leading-none">
                        HOT
                      </span>
                    )}

                    {/* Underline hover effect */}
                    <span className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 shadow-[0_0_8px_currentColor] ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    } ${
                      link.isDanger ? 'bg-red-400 shadow-[0_0_8px_#ff2d2d]' 
                      : link.label === 'Games' ? 'bg-[#FF00FF] shadow-[0_0_8px_#FF00FF]'
                      : 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* ── Desktop auth buttons ── */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={onLoginClick}
                className="font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors duration-300"
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="cyber-button px-5 py-2 bg-[#39FF14]/10 border border-[#39FF14]/50 rounded font-mono text-sm text-[#39FF14] hover:bg-[#39FF14]/20 hover:border-[#39FF14] transition-all duration-300"
              >
                Join Community
              </button>
            </div>

            {/* ── Mobile menu button ── */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#39FF14] hover:bg-[#39FF14]/10 rounded transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#05060B]/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-7">
          {navLinks.map((link, index) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`flex items-center gap-3 font-orbitron text-2xl transition-colors duration-300 ${
                link.isDanger
                  ? 'text-red-400/80 hover:text-red-400'
                  : link.label === 'Games'
                  ? 'text-[#FF00FF]/80 hover:text-[#FF00FF]'
                  : 'text-white hover:text-[#39FF14]'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.isDanger && <AlertTriangle className="w-5 h-5" />}
              {link.hasIcon && <Gamepad2 className="w-5 h-5" />}
              {link.label}
              {link.isNew && (
                <span className="px-2 py-1 bg-red-500 text-white rounded font-mono text-[10px] font-bold">
                  NEW
                </span>
              )}
              {link.isHot && (
                <span className="px-2 py-1 bg-[#FF00FF] text-white rounded font-mono text-[10px] font-bold">
                  HOT
                </span>
              )}
            </button>
          ))}

          {/* Auth buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
              className="font-mono text-lg text-[#A6A9B6] hover:text-[#39FF14] transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}
              className="px-8 py-3 bg-[#39FF14]/10 border border-[#39FF14]/50 rounded font-mono text-lg text-[#39FF14] hover:bg-[#39FF14]/20 hover:border-[#39FF14] transition-all duration-300"
            >
              Join Community
            </button>
          </div>
        </div>
      </div>
    </>
  );
}