import { useState, useEffect } from 'react';
import { Menu, X, Shield, Zap } from 'lucide-react';

interface NavigationProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Navigation({ onLoginClick, onSignupClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Events', href: '#events' },
    { label: 'Leaderboard', href: '#leaderboard' },
    { label: 'Members', href: '#members' },
    { label: 'Feed', href: '#feed' },
    { label: 'AI Assistant', href: '#ai-assistant' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-[#39FF14] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                <Zap className="w-4 h-4 text-[#39FF14] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="font-orbitron font-bold text-lg lg:text-xl tracking-wider text-white group-hover:text-[#39FF14] transition-colors">
                CYBERVERSE
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="relative font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#39FF14] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#39FF14]" />
                </button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
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
                Join HQ
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#39FF14] hover:bg-[#39FF14]/10 rounded transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
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
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="font-orbitron text-2xl text-white hover:text-[#39FF14] transition-colors duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {link.label}
            </button>
          ))}
          
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => {
                onLoginClick();
                setIsMobileMenuOpen(false);
              }}
              className="font-mono text-lg text-[#A6A9B6] hover:text-[#39FF14] transition-colors duration-300"
            >
              Login
            </button>
            <button
              onClick={() => {
                onSignupClick();
                setIsMobileMenuOpen(false);
              }}
              className="px-8 py-3 bg-[#39FF14]/10 border border-[#39FF14]/50 rounded font-mono text-lg text-[#39FF14] hover:bg-[#39FF14]/20 hover:border-[#39FF14] transition-all duration-300"
            >
              Join HQ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
