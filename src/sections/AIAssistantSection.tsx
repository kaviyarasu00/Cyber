import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Bot, User, Sparkles, Shield, Terminal, Cpu, Zap, Activity, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'user',
    content: 'How do I start with CTFs?',
    timestamp: new Date(),
  },
  {
    id: 2,
    type: 'ai',
    content: 'Try picoCTF and OWASP Juice Shop. Join a team here to practice weekly. Start with web challenges - they\'re beginner-friendly and teach real-world skills.\n\nRecommended path:\n1. Web Security Academy (free)\n2. picoCTF (gamified)\n3. Hack The Box (intermediate)',
    timestamp: new Date(),
  },
];

const quickQuestions = [
  'What is SQL injection?',
  'Explain XSS attacks',
  'How to secure AI models?',
  'Best tools for recon?',
];

export default function AIAssistantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const orb = orbRef.current;
    const chat = chatRef.current;
    const particles = particlesRef.current;

    if (!section || !orb || !chat || !particles) return;

    const ctx = gsap.context(() => {
      // Orb floating animation
      gsap.to(orb, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Orb rotation
      gsap.to(orb.querySelector('.orb-inner'), {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

      // Particles animation
      const particleElements = particles.querySelectorAll('.particle');
      particleElements.forEach((particle, i) => {
        gsap.to(particle, {
          y: -100 - Math.random() * 200,
          x: (Math.random() - 0.5) * 100,
          opacity: 0,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          delay: i * 0.5,
          ease: 'power1.out',
        });
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.7,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl.fromTo(
        orb,
        { scale: 0.2, rotateY: 180, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, rotateY: 0, opacity: 1, filter: 'blur(0px)', ease: 'none' },
        0
      );

      scrollTl.fromTo(
        chat,
        { y: '40vh', opacity: 0, rotateX: 45 },
        { y: 0, opacity: 1, rotateX: 0, ease: 'none' },
        0.1
      );

      // SETTLE (30% - 70%): Hold position with ambient animation

      // EXIT (70% - 100%)
      scrollTl.fromTo(
        orb,
        { scale: 1, opacity: 1, filter: 'blur(0px)' },
        { scale: 0.65, opacity: 0, filter: 'blur(10px)', ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        chat,
        { y: 0, opacity: 1, rotateX: 0 },
        { y: '18vh', opacity: 0, rotateX: -30, ease: 'power2.in' },
        0.7
      );
    }, section);

    // Pulsing glow effect
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => 0.5 + Math.random() * 0.5);
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(glowInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponses: Record<string, string> = {
      'ctf': 'CTFs (Capture The Flags) are cybersecurity competitions. Start with:\n\n1. **picoCTF** - Beginner-friendly\n2. **Web Security Academy** - Free, comprehensive\n3. **OverTheWire** - Linux & security basics\n4. **Join our weekly practice sessions!**',
      'sql': 'SQL Injection is a code injection attack where malicious SQL statements are inserted into entry fields.\n\n**Prevention:**\n- Use parameterized queries\n- Input validation\n- Least privilege database accounts\n- WAF rules',
      'xss': 'XSS (Cross-Site Scripting) allows attackers to inject client-side scripts into web pages.\n\n**Types:**\n- Stored XSS\n- Reflected XSS\n- DOM-based XSS\n\n**Prevention:** Content Security Policy, input sanitization, output encoding.',
      'ai': 'Securing AI models involves:\n\n1. **Adversarial training** - Train with perturbed inputs\n2. **Input validation** - Sanitize all inputs\n3. **Model monitoring** - Detect anomalies\n4. **Access control** - Limit model access\n5. **Regular audits** - Test for vulnerabilities',
      'recon': 'Top reconnaissance tools:\n\n- **nmap** - Network scanning\n- **subfinder** - Subdomain discovery\n- **amass** - Attack surface mapping\n- **gobuster** - Directory brute-forcing\n- **waybackurls** - Historical URLs',
    };

    const lowerInput = input.toLowerCase();
    let response = 'That\'s a great question! I\'d recommend checking our resources section or asking in the community feed. Our mentors are always happy to help with specific technical questions.\n\nYou can also DM any of our community leads for 1:1 guidance.';

    for (const [key, value] of Object.entries(aiResponses)) {
      if (lowerInput.includes(key)) {
        response = value;
        break;
      }
    }

    const aiMessage: Message = {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <section
      ref={sectionRef}
      id="ai-assistant"
      className="section-pinned flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }} />
      </div>

      {/* Background radar rings with animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#39FF14]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#39FF14]/15 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#39FF14]/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-[#39FF14] rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${80 + Math.random() * 20}%`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Hologram Orb */}
      <div
        ref={orbRef}
        className="relative mb-8 cursor-pointer group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="orb-inner relative w-32 h-32 md:w-48 md:h-48">
          {/* Outer ring with glow */}
          <div 
            className="absolute inset-0 border-2 border-[#39FF14]/30 rounded-full"
            style={{
              boxShadow: `0 0 ${30 * glowIntensity}px rgba(57, 255, 20, 0.5), inset 0 0 ${20 * glowIntensity}px rgba(57, 255, 20, 0.2)`,
              animation: 'slow-rotate 10s linear infinite',
            }}
          />
          
          {/* Middle ring */}
          <div 
            className="absolute inset-4 border border-[#39FF14]/50 rounded-full"
            style={{ 
              animation: 'slow-rotate 8s linear infinite reverse',
              boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
            }}
          />
          
          {/* Inner core with pulse */}
          <div 
            className="absolute inset-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-[#39FF14] transition-all duration-300 group-hover:bg-[#39FF14]/30 group-hover:scale-110"
            style={{
              boxShadow: `0 0 ${40 * glowIntensity}px rgba(57, 255, 20, 0.6), inset 0 0 ${30 * glowIntensity}px rgba(57, 255, 20, 0.4)`,
            }}
          >
            <Bot className="w-12 h-12 md:w-16 md:h-16 text-[#39FF14] animate-pulse" />
          </div>
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 bg-[#39FF14]/10 rounded-full blur-xl animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#39FF14] rounded-full shadow-lg shadow-[#39FF14]" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 bg-[#39FF14] rounded-full shadow-lg shadow-[#39FF14]" />
          </div>
        </div>
        
        {/* Label with glitch effect */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
          <span 
            className="font-orbitron font-bold text-[#39FF14] tracking-wider text-lg"
            style={{
              textShadow: `0 0 ${10 * glowIntensity}px rgba(57, 255, 20, 0.8)`,
            }}
          >
            CYBER-AI
          </span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Activity className="w-3 h-3 text-[#39FF14] animate-pulse" />
            <span className="font-mono text-xs text-[#39FF14]/70">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Chat Interface with Static Floating Robot */}
      <div className="relative w-full max-w-3xl px-6">
        {/* Static Floating Robot - Positioned outside the chatbox flow */}
        <div
          className="absolute -top-12 right-4 md:right-12 z-30 pointer-events-none"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(57, 255, 20, 0.3))' }}
        >
          <div className="relative">
            {/* Robot body */}
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0B0E14] border-2 border-[#39FF14] rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Screen/face */}
              <div className="w-9 h-7 md:w-10 md:h-8 bg-[#39FF14]/20 rounded-md flex items-center justify-center gap-1.5">
                {/* Eyes */}
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#39FF14] rounded-full animate-pulse" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#39FF14] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#39FF14]" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping" />
            </div>
            {/* Arms */}
            <div className="absolute top-1/2 -left-1.5 w-2 h-5 bg-[#39FF14]/40 rounded-full -rotate-12" />
            <div className="absolute top-1/2 -right-1.5 w-2 h-5 bg-[#39FF14]/40 rounded-full rotate-12" />
            {/* Static glow */}
            <div className="absolute inset-0 bg-[#39FF14]/20 rounded-xl blur-lg -z-10" />
          </div>
        </div>

        <div
          ref={chatRef}
          className="cyber-card corner-brackets rounded-lg overflow-hidden backdrop-blur-md"
          style={{
            boxShadow: '0 0 40px rgba(57, 255, 20, 0.15), 0 0 80px rgba(57, 255, 20, 0.05)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
          }}
        >
          {/* Status bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0B0E14]/90 border-b border-[#39FF14]/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="font-mono text-xs text-[#A6A9B6] ml-2 flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              cyber-community-AI_chatbox
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-2 px-2 py-1 bg-[#39FF14]/10 rounded-full border border-[#39FF14]/30">
              <Sparkles className="w-3 h-3 text-[#39FF14] animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-mono text-xs text-[#39FF14]">Online</span>
              <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping" />
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-[#05060B]/70 scrollbar-thin scrollbar-thumb-[#39FF14]/30 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                  message.type === 'ai' 
                    ? 'bg-[#39FF14]/20 border border-[#39FF14] shadow-lg shadow-[#39FF14]/20' 
                    : 'bg-[#0B0E14] border border-[#39FF14]/30'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-[#39FF14]" />
                  ) : (
                    <User className="w-4 h-4 text-[#A6A9B6]" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg transition-all duration-300 hover:shadow-lg ${
                  message.type === 'ai'
                    ? 'bg-[#39FF14]/10 border border-[#39FF14]/30 shadow-[#39FF14]/10'
                    : 'bg-[#0B0E14] border border-[#39FF14]/20'
                }`}>
                  <p className="font-mono text-sm text-white whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  <span className="text-[10px] text-[#39FF14]/50 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 border border-[#39FF14] flex items-center justify-center shadow-lg shadow-[#39FF14]/30">
                  <Bot className="w-4 h-4 text-[#39FF14] animate-bounce" />
                </div>
                <div className="p-3 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-4 py-3 bg-[#0B0E14]/90 border-t border-[#39FF14]/20">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, i) => (
                <button
                  key={question}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1.5 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-full font-mono text-xs text-[#39FF14] hover:bg-[#39FF14]/30 hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/20 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-[#0B0E14]/90 border-t border-[#39FF14]/20">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:outline-none focus:border-[#39FF14] focus:shadow-lg focus:shadow-[#39FF14]/20 transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-[#39FF14]/30" />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg text-[#39FF14] hover:bg-[#39FF14]/40 hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements with animations */}
      <div className="absolute bottom-8 left-8 pointer-events-none animate-pulse">
        <Terminal className="w-8 h-8 text-[#39FF14]/30" />
      </div>
      <div className="absolute top-8 right-8 pointer-events-none animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Cpu className="w-8 h-8 text-[#39FF14]/30" />
      </div>
      <div className="absolute bottom-8 right-8 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}>
        <Shield className="w-8 h-8 text-[#39FF14]/30" />
      </div>
      <div className="absolute top-1/4 left-8 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
        <Zap className="w-6 h-6 text-[#39FF14]/20" />
      </div>
      <div className="absolute top-1/3 right-8 pointer-events-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Activity className="w-6 h-6 text-[#39FF14]/20" />
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-in {
          animation: animateIn 0.3s ease-out forwards;
        }
        @keyframes animateIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}