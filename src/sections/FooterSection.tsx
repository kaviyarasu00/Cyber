import { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Github, 
  Instagram, 
  MessageCircle,
  Send,
  ExternalLink,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function FooterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  const footerLinks = {
    platform: [
      { label: 'Events', href: '#events' },
      { label: 'Leaderboard', href: '#leaderboard' },
      { label: 'Members', href: '#members' },
      { label: 'Feed', href: '#feed' },
    ],
    resources: [
      { label: 'Guidelines', href: '#' },
      { label: 'Code of Conduct', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative bg-[#0B0E14] border-t border-[#39FF14]/20">
      {/* CTA Section */}
      <div className="px-6 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 mb-8">
            <Shield className="w-10 h-10 text-[#39FF14]" />
            <Zap className="w-5 h-5 text-[#39FF14] absolute -top-1 -right-1" />
          </div>

          <h2 className="font-orbitron font-bold text-4xl md:text-5xl text-white mb-4">
            JOIN THE COMMUNITY
          </h2>
          
          <p className="font-mono text-lg text-[#A6A9B6] mb-8 max-w-xl mx-auto">
            Events, teams, and mentorship—built for students who want to build, secure, and lead.
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A9B6]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-12 pr-4 py-4 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-white placeholder-[#A6A9B6]/50 cyber-input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className="px-8 py-4 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14]/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitted ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <span>Request Invite</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '50+', label: 'CTF Challenges' },
              { value: '24/7', label: 'Community Support' },
              { value: '100%', label: 'Free Forever' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-orbitron font-bold text-2xl md:text-3xl text-[#39FF14]">
                  {stat.value}
                </div>
                <div className="font-mono text-sm text-[#A6A9B6]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-6 lg:px-16 py-12 border-t border-[#39FF14]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-[#39FF14]" />
              <span className="font-orbitron font-bold text-xl text-white">CYBERVERSE</span>
            </div>
            <p className="font-mono text-sm text-[#A6A9B6] mb-6">
               AI × Cybersecurity Community.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#05060B] border border-[#39FF14]/30 rounded-lg text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#05060B] border border-[#39FF14]/30 rounded-lg text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#05060B] border border-[#39FF14]/30 rounded-lg text-[#A6A9B6] hover:text-[#39FF14] hover:border-[#39FF14] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-orbitron font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#39FF14]" />
                <a 
                  href="mailto:support@cyberversehq.io"
                  className="font-mono text-sm text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
                >
                  support@cyberverse.io
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#39FF14] mt-0.5" />
                <span className="font-mono text-sm text-[#A6A9B6]">
                  SRM Madurai College for Engineering and <br />
                   Technology, sivagangai.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 lg:px-16 py-6 border-t border-[#39FF14]/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-[#A6A9B6]">
            © 2026 CyberVerse HQ. All rights reserved.
          </p>
          <p className="font-mono text-xs text-[#A6A9B6]">
            Built for DEPLOYATHON — AI Web Development Challenge
          </p>
        </div>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </footer>
  );
}
