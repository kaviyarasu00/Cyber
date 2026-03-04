import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Send, Bot, User, Sparkles, Shield, Terminal, Cpu, Zap, 
  Activity, Lock, Copy, Check, RotateCcw, Trash2, Download,
  ChevronDown, ChevronUp, Code, FileText, Image as ImageIcon,
  Mic, MicOff, StopCircle, Paperclip, X, Edit3, ThumbsUp, 
  ThumbsDown, Maximize2, Minimize2, Calculator, Play
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isEdited?: boolean;
  reactions?: { thumbsUp: boolean; thumbsDown: boolean };
  attachments?: Attachment[];
  codeOutput?: string; // Store execution output for code
}

interface Attachment {
  id: string;
  type: 'image' | 'file' | 'code';
  name: string;
  content?: string;
  url?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'user',
    content: 'How do I start with CTFs?',
    timestamp: new Date(),
  },
  {
    id: '2',
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
  'Write a calculator in Python',
  'Create a fibonacci sequence generator',
  'Build a prime number checker',
];

// Enhanced AI responses with arithmetic operations
const aiResponses: Record<string, string> = {
  'ctf': 'CTFs (Capture The Flags) are cybersecurity competitions. Start with:\n\n1. **picoCTF** - Beginner-friendly\n2. **Web Security Academy** - Free, comprehensive\n3. **OverTheWire** - Linux & security basics\n4. **Join our weekly practice sessions!**',
  'sql': 'SQL Injection is a code injection attack where malicious SQL statements are inserted into entry fields.\n\n**Prevention:**\n- Use parameterized queries\n- Input validation\n- Least privilege database accounts\n- WAF rules',
  'xss': 'XSS (Cross-Site Scripting) allows attackers to inject client-side scripts into web pages.\n\n**Types:**\n- Stored XSS\n- Reflected XSS\n- DOM-based XSS\n\n**Prevention:** Content Security Policy, input sanitization, output encoding.',
  'ai': 'Securing AI models involves:\n\n1. **Adversarial training** - Train with perturbed inputs\n2. **Input validation** - Sanitize all inputs\n3. **Model monitoring** - Detect anomalies\n4. **Access control** - Limit model access\n5. **Regular audits** - Test for vulnerabilities',
  'recon': 'Top reconnaissance tools:\n\n- **nmap** - Network scanning\n- **subfinder** - Subdomain discovery\n- **amass** - Attack surface mapping\n- **gobuster** - Directory brute-forcing\n- **waybackurls** - Historical URLs',
  'calculator': `Here's a complete Python calculator with arithmetic operations:

\`\`\`python
class CyberCalculator:
    def __init__(self):
        self.history = []
        self.memory = 0
    
    def add(self, a, b):
        """Addition operation"""
        result = a + b
        self._log(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a, b):
        """Subtraction operation"""
        result = a - b
        self._log(f"{a} - {b} = {result}")
        return result
    
    def multiply(self, a, b):
        """Multiplication operation"""
        result = a * b
        self._log(f"{a} × {b} = {result}")
        return result
    
    def divide(self, a, b):
        """Division with zero check"""
        if b == 0:
            raise ValueError("Division by zero!")
        result = a / b
        self._log(f"{a} ÷ {b} = {result}")
        return result
    
    def power(self, base, exp):
        """Exponentiation"""
        result = base ** exp
        self._log(f"{base}^{exp} = {result}")
        return result
    
    def mod(self, a, b):
        """Modulo operation"""
        result = a % b
        self._log(f"{a} mod {b} = {result}")
        return result
    
    def sqrt(self, n):
        """Square root"""
        if n < 0:
            raise ValueError("Cannot compute square root of negative number")
        result = n ** 0.5
        self._log(f"√{n} = {result}")
        return result
    
    def factorial(self, n):
        """Calculate factorial"""
        if n < 0:
            raise ValueError("Factorial not defined for negative numbers")
        if n > 1000:
            raise ValueError("Number too large")
        result = 1
        for i in range(1, n + 1):
            result *= i
        self._log(f"{n}! = {result}")
        return result
    
    def _log(self, operation):
        self.history.append(operation)
    
    def show_history(self):
        return "\\n".join(self.history) if self.history else "No operations yet"

# Demo usage
calc = CyberCalculator()
print("=== CYBER CALCULATOR DEMO ===")
print(f"15 + 27 = {calc.add(15, 27)}")
print(f"100 - 33 = {calc.subtract(100, 33)}")
print(f"12 × 8 = {calc.multiply(12, 8)}")
print(f"144 ÷ 12 = {calc.divide(144, 12)}")
print(f"2^10 = {calc.power(2, 10)}")
print(f"17 mod 5 = {calc.mod(17, 5)}")
print(f"√256 = {calc.sqrt(256)}")
print(f"5! = {calc.factorial(5)}")
print("\\n=== OPERATION HISTORY ===")
print(calc.show_history())
\`\`\`

**Features:**
- Basic arithmetic (+, -, ×, ÷)
- Advanced operations (power, modulo, square root, factorial)
- Operation history tracking
- Error handling for edge cases
- Memory storage capability`,
  
  'fibonacci': `Here's a Fibonacci sequence generator with multiple implementations:

\`\`\`python
class FibonacciGenerator:
    def __init__(self):
        self.memo = {}
    
    def iterative(self, n):
        """Iterative approach - O(n) time, O(1) space"""
        if n <= 0:
            return []
        if n == 1:
            return [0]
        
        fibs = [0, 1]
        for i in range(2, n):
            fibs.append(fibs[-1] + fibs[-2])
        return fibs
    
    def recursive(self, n):
        """Recursive approach - O(2^n) time"""
        if n <= 0:
            return 0
        if n == 1:
            return 1
        return self.recursive(n-1) + self.recursive(n-2)
    
    def memoized(self, n):
        """Memoized recursion - O(n) time"""
        if n in self.memo:
            return self.memo[n]
        if n <= 0:
            return 0
        if n == 1:
            return 1
        
        self.memo[n] = self.memoized(n-1) + self.memoized(n-2)
        return self.memo[n]
    
    def golden_ratio(self, n):
        """Using Binet's formula - O(1) per number"""
        import math
        phi = (1 + math.sqrt(5)) / 2
        psi = (1 - math.sqrt(5)) / 2
        
        fibs = []
        for i in range(n):
            # F(n) = (φ^n - ψ^n) / √5
            fn = round((phi**i - psi**i) / math.sqrt(5))
            fibs.append(fn)
        return fibs
    
    def matrix_exponentiation(self, n):
        """Fast doubling method - O(log n)"""
        if n <= 0:
            return 0
        def multiply(F, M):
            x = F[0][0] * M[0][0] + F[0][1] * M[1][0]
            y = F[0][0] * M[0][1] + F[0][1] * M[1][1]
            z = F[1][0] * M[0][0] + F[1][1] * M[1][0]
            w = F[1][0] * M[0][1] + F[1][1] * M[1][1]
            F[0][0], F[0][1], F[1][0], F[1][1] = x, y, z, w
        
        def power(F, n):
            if n == 0 or n == 1:
                return
            M = [[1, 1], [1, 0]]
            power(F, n // 2)
            multiply(F, F)
            if n % 2 != 0:
                multiply(F, M)
        
        F = [[1, 1], [1, 0]]
        power(F, n - 1)
        return F[0][0]

# Demo
fib = FibonacciGenerator()
n = 20

print(f"First {n} Fibonacci numbers (Iterative):")
print(fib.iterative(n))

print(f"\\n20th Fibonacci (Memoized): {fib.memoized(20)}")
print(f"50th Fibonacci (Matrix): {fib.matrix_exponentiation(50)}")

# Verify golden ratio property
fibs = fib.iterative(20)
ratios = [fibs[i+1]/fibs[i] for i in range(2, len(fibs)-1)]
print(f"\\nGolden ratio approximations: {ratios[:5]}")
\`\`\``,

  'prime': `Here's a comprehensive prime number checker and generator:

\`\`\`python
import math
from typing import List, Tuple

class PrimeEngine:
    def __init__(self):
        self._cache = set()
    
    def is_prime(self, n: int) -> bool:
        """Optimized primality test"""
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False
        if n in self._cache:
            return True
        
        # Check odd divisors up to square root
        for i in range(3, int(math.sqrt(n)) + 1, 2):
            if n % i == 0:
                return False
        
        self._cache.add(n)
        return True
    
    def sieve_eratosthenes(self, limit: int) -> List[int]:
        """Generate all primes up to limit using Sieve of Eratosthenes"""
        if limit < 2:
            return []
        
        sieve = [True] * (limit + 1)
        sieve[0] = sieve[1] = False
        
        for i in range(2, int(math.sqrt(limit)) + 1):
            if sieve[i]:
                sieve[i*i:limit+1:i] = [False] * len(sieve[i*i:limit+1:i])
        
        return [i for i, is_prime in enumerate(sieve) if is_prime]
    
    def factorize(self, n: int) -> List[Tuple[int, int]]:
        """Prime factorization with exponents"""
        factors = []
        d = 2
        while d * d <= n:
            count = 0
            while n % d == 0:
                count += 1
                n //= d
            if count > 0:
                factors.append((d, count))
            d += 1
        if n > 1:
            factors.append((n, 1))
        return factors
    
    def next_prime(self, n: int) -> int:
        """Find next prime after n"""
        candidate = n + 1 if n > 1 else 2
        while not self.is_prime(candidate):
            candidate += 1
        return candidate
    
    def generate_range(self, start: int, end: int) -> List[int]:
        """Generate primes in range [start, end]"""
        return [p for p in range(max(2, start), end + 1) if self.is_prime(p)]
    
    def twin_primes(self, limit: int) -> List[Tuple[int, int]]:
        """Find twin prime pairs (p, p+2)"""
        primes = self.sieve_eratosthenes(limit)
        twins = []
        for i in range(len(primes) - 1):
            if primes[i+1] - primes[i] == 2:
                twins.append((primes[i], primes[i+1]))
        return twins
    
    def is_mersenne_prime(self, p: int) -> bool:
        """Check if 2^p - 1 is prime (Lucas-Lehmer test)"""
        if p == 2:
            return True
        if not self.is_prime(p):
            return False
        
        s = 4
        m = 2**p - 1
        for _ in range(p - 2):
            s = ((s * s) - 2) % m
        return s == 0

# Demo
engine = PrimeEngine()

print("=== PRIME ENGINE DEMO ===")
print(f"Is 97 prime? {engine.is_prime(97)}")
print(f"Is 100 prime? {engine.is_prime(100)}")

print(f"\\nPrimes up to 50: {engine.sieve_eratosthenes(50)}")

print(f"\\nFactorization of 360: {engine.factorize(360)}")

print(f"\\nNext prime after 100: {engine.next_prime(100)}")

print(f"\\nTwin primes under 100: {engine.twin_primes(100)}")

# Large prime check
large_prime = 104729  # 10000th prime
print(f"\\nIs {large_prime} prime? {engine.is_prime(large_prime)}")
print(f"Verification: {len(engine.sieve_eratosthenes(large_prime))} primes under {large_prime}")
\`\`\``,

  'python': 'Here\'s a Python script for basic port scanning:\n\n```python\nimport socket\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef scan_port(ip, port):\n    try:\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1)\n        result = sock.connect_ex((ip, port))\n        if result == 0:\n            print(f"Port {port} is open")\n        sock.close()\n    except Exception as e:\n        pass\n\ndef main():\n    target = input("Enter target IP: ")\n    ports = range(1, 1025)\n    \n    with ThreadPoolExecutor(max_workers=100) as executor:\n        executor.map(lambda p: scan_port(target, p), ports)\n\nif __name__ == "__main__":\n    main()\n```\n\n**Note:** Use only on authorized systems!',
  'buffer': 'A buffer overflow occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory.\n\n**Types:**\n- Stack-based\n- Heap-based\n\n**Prevention:**\n- Use safe functions (strncpy vs strcpy)\n- Stack canaries\n- ASLR (Address Space Layout Randomization)\n- NX bit (Non-executable stack)',
};

export default function AIAssistantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [executingCode, setExecutingCode] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, []);

  // GSAP Animations - PRESERVED EXACTLY AS ORIGINAL
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

    const glowInterval = setInterval(() => {
      setGlowIntensity(() => 0.5 + Math.random() * 0.5);
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(glowInterval);
    };
  }, []);

  // Speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
      };
      recognition.onend = () => setIsListening(false);
      
      if (isListening) {
        recognition.start();
      }
    }
  }, [isListening]);

  // Code execution simulation
  const executeCode = (code: string, messageId: string) => {
    setExecutingCode(messageId);
    
    // Simulate code execution with arithmetic operations
    setTimeout(() => {
      let output = '';
      
      // Detect calculator operations
      if (code.includes('CyberCalculator') || code.includes('calculator')) {
        output = `=== CYBER CALCULATOR DEMO ===
15 + 27 = 42
100 - 33 = 67
12 × 8 = 96
144 ÷ 12 = 12.0
2^10 = 1024
17 mod 5 = 2
√256 = 16.0
5! = 120

=== OPERATION HISTORY ===
15 + 27 = 42
100 - 33 = 67
12 × 8 = 96
144 ÷ 12 = 12.0
2^10 = 1024
17 mod 5 = 2
√256 = 16.0
5! = 120`;
      } else if (code.includes('Fibonacci') || code.includes('fibonacci')) {
        output = `First 20 Fibonacci numbers (Iterative):
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181]

20th Fibonacci (Memoized): 6765
50th Fibonacci (Matrix): 12586269025

Golden ratio approximations: [1.6666666666666667, 1.6, 1.625, 1.6153846153846154, 1.619047619047619]`;
      } else if (code.includes('Prime') || code.includes('prime')) {
        output = `=== PRIME ENGINE DEMO ===
Is 97 prime? True
Is 100 prime? False

Primes up to 50: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

Factorization of 360: [(2, 3), (3, 2), (5, 1)]

Next prime after 100: 101

Twin primes under 100: [(3, 5), (5, 7), (11, 13), (17, 19), (29, 31), (41, 43), (59, 61), (71, 73)]

Is 104729 prime? True
Verification: 10000 primes under 104729`;
      } else {
        output = `Code executed successfully!
Output: [Simulation] Arithmetic operations completed.
Result: 42`;
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, codeOutput: output } : msg
      ));
      setExecutingCode(null);
    }, 2000);
  };

  // Conversation management
  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
  };

  const saveCurrentConversation = () => {
    if (messages.length === 0) return;
    
    const title = messages[0].content.slice(0, 30) + '...' || 'New Conversation';
    const conversation: Conversation = {
      id: currentConversationId || Date.now().toString(),
      title,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === conversation.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = conversation;
        return updated;
      }
      return [conversation, ...prev];
    });
    setCurrentConversationId(conversation.id);
  };

  // Streaming response
  const streamResponse = async (responseText: string, messageId: string) => {
    setIsTyping(true);
    setStreamingContent('');
    
    abortControllerRef.current = new AbortController();
    const chunks = responseText.split('');
    
    try {
      for (let i = 0; i < chunks.length; i++) {
        if (abortControllerRef.current.signal.aborted) break;
        
        await new Promise(resolve => setTimeout(resolve, 15));
        setStreamingContent(prev => prev + chunks[i]);
        
        if (i % 10 === 0) {
          scrollToBottom();
        }
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: responseText, isStreaming: false }
          : msg
      ));
      setStreamingContent('');
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    // Smart response detection
    const lowerInput = input.toLowerCase();
    let responseText = 'That\'s a great question! I\'d recommend checking our resources section or asking in the community feed. Our mentors are always happy to help with specific technical questions.\n\nYou can also DM any of our community leads for 1:1 guidance.';

    // Check for arithmetic/code generation requests
    if (lowerInput.includes('calculator') || lowerInput.includes('add') || lowerInput.includes('subtract') || lowerInput.includes('multiply') || lowerInput.includes('divide') || lowerInput.includes('arithmetic')) {
      responseText = aiResponses['calculator'];
    } else if (lowerInput.includes('fibonacci') || lowerInput.includes('sequence')) {
      responseText = aiResponses['fibonacci'];
    } else if (lowerInput.includes('prime') || lowerInput.includes('factor')) {
      responseText = aiResponses['prime'];
    } else {
      for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerInput.includes(key)) {
          responseText = value;
          break;
        }
      }
    }

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);
    await streamResponse(responseText, aiMessageId);
    saveCurrentConversation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0) return;
    
    const userMessage = messages[messageIndex - 1];
    setMessages(prev => prev.slice(0, messageIndex));
    setInput(userMessage.content);
    await handleSend();
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const editMessage = (id: string, newContent: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, content: newContent, isEdited: true } : m
    ));
    setEditingId(null);
    setEditContent('');
  };

  const startEditing = (message: Message) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const handleReaction = (messageId: string, type: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m;
      const currentReactions = m.reactions || { thumbsUp: false, thumbsDown: false };
      return {
        ...m,
        reactions: {
          ...currentReactions,
          [type]: !currentReactions[type],
          [type === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp']: false,
        },
      };
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment: Attachment = {
          id: Date.now().toString() + Math.random(),
          type: file.type.startsWith('image/') ? 'image' : file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.ts') ? 'code' : 'file',
          name: file.name,
          content: event.target?.result as string,
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsTyping(false);
    setStreamingContent('');
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const downloadChat = () => {
    const chatData = {
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-chat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Markdown components
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const codeContent = String(children).replace(/\n$/, '');
      const isPython = match && match[1] === 'python';
      
      return !inline && match ? (
        <div className="relative group my-2">
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copyToClipboard(codeContent, codeContent.slice(0, 20))}
              className="p-1 bg-[#0B0E14] border border-[#39FF14]/30 rounded text-[#39FF14] hover:bg-[#39FF14]/20"
              title="Copy code"
            >
              {copiedId === codeContent.slice(0, 20) ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
            {isPython && (
              <button
                onClick={() => executeCode(codeContent, messages.find(m => m.content.includes(codeContent))?.id || '')}
                className="p-1 bg-[#39FF14]/20 border border-[#39FF14] rounded text-[#39FF14] hover:bg-[#39FF14]/40 flex items-center gap-1"
                title="Run code"
              >
                <Play className="w-3 h-3" />
                <span className="text-[10px]">Run</span>
              </button>
            )}
          </div>
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-[#39FF14]/10 text-[#39FF14] px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
          {children}
        </code>
      );
    },
    p({ children }: any) {
      return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
    },
    ul({ children }: any) {
      return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
    },
    ol({ children }: any) {
      return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
    },
    li({ children }: any) {
      return <li className="text-[#A6A9B6]">{children}</li>;
    },
    strong({ children }: any) {
      return <strong className="text-[#39FF14] font-bold">{children}</strong>;
    },
    h1({ children }: any) {
      return <h1 className="text-lg font-bold text-[#39FF14] mb-2 mt-4">{children}</h1>;
    },
    h2({ children }: any) {
      return <h2 className="text-md font-bold text-[#39FF14] mb-2 mt-3">{children}</h2>;
    },
    h3({ children }: any) {
      return <h3 className="text-sm font-bold text-[#39FF14] mb-1 mt-2">{children}</h3>;
    },
    blockquote({ children }: any) {
      return <blockquote className="border-l-2 border-[#39FF14] pl-3 italic text-[#A6A9B6] my-2">{children}</blockquote>;
    },
    a({ href, children }: any) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#39FF14] underline hover:text-[#39FF14]/80">
          {children}
        </a>
      );
    },
  };

  return (
    <section
      ref={sectionRef}
      id="ai-assistant"
      className="section-pinned flex flex-col items-center justify-center relative overflow-hidden min-h-screen"
    >
      {/* Animated background grid - PRESERVED */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
        }} />
      </div>

      {/* Background radar rings - PRESERVED */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#39FF14]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-[#39FF14]/15 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#39FF14]/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
      </div>

      {/* Floating particles - PRESERVED */}
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

      {/* Hologram Orb - PRESERVED EXACTLY */}
      <div
        ref={orbRef}
        className="relative mb-8 cursor-pointer group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="orb-inner relative w-32 h-32 md:w-48 md:h-48">
          <div 
            className="absolute inset-0 border-2 border-[#39FF14]/30 rounded-full"
            style={{
              boxShadow: `0 0 ${30 * glowIntensity}px rgba(57, 255, 20, 0.5), inset 0 0 ${20 * glowIntensity}px rgba(57, 255, 20, 0.2)`,
              animation: 'slow-rotate 10s linear infinite',
            }}
          />
          <div 
            className="absolute inset-4 border border-[#39FF14]/50 rounded-full"
            style={{ 
              animation: 'slow-rotate 8s linear infinite reverse',
              boxShadow: '0 0 20px rgba(57, 255, 20, 0.3)',
            }}
          />
          <div 
            className="absolute inset-8 bg-[#39FF14]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-[#39FF14] transition-all duration-300 group-hover:bg-[#39FF14]/30 group-hover:scale-110"
            style={{
              boxShadow: `0 0 ${40 * glowIntensity}px rgba(57, 255, 20, 0.6), inset 0 0 ${30 * glowIntensity}px rgba(57, 255, 20, 0.4)`,
            }}
          >
            <Bot className="w-12 h-12 md:w-16 md:h-16 text-[#39FF14] animate-pulse" />
          </div>
          <div 
            className="absolute inset-0 bg-[#39FF14]/10 rounded-full blur-xl animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#39FF14] rounded-full shadow-lg shadow-[#39FF14]" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 bg-[#39FF14] rounded-full shadow-lg shadow-[#39FF14]" />
          </div>
        </div>
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

      {/* Chat Interface */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-[#05060B]' : 'w-full max-w-3xl px-6'}`}>
        {/* Static Floating Robot - PRESERVED POSITIONING */}
        <div
          className="absolute -top-12 right-4 md:right-12 z-30 pointer-events-none"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(57, 255, 20, 0.3))' }}
        >
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0B0E14] border-2 border-[#39FF14] rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="w-9 h-7 md:w-10 md:h-8 bg-[#39FF14]/20 rounded-md flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#39FF14] rounded-full animate-pulse" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#39FF14] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#39FF14]" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping" />
            </div>
            <div className="absolute top-1/2 -left-1.5 w-2 h-5 bg-[#39FF14]/40 rounded-full -rotate-12" />
            <div className="absolute top-1/2 -right-1.5 w-2 h-5 bg-[#39FF14]/40 rounded-full rotate-12" />
            <div className="absolute inset-0 bg-[#39FF14]/20 rounded-xl blur-lg -z-10" />
          </div>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-12 top-0 p-2 bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg text-[#39FF14] hover:bg-[#39FF14]/20 transition-all z-40"
        >
          {isSidebarOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        {/* Conversations Sidebar */}
        {isSidebarOpen && (
          <div className="absolute left-0 top-12 w-64 bg-[#0B0E14]/95 border border-[#39FF14]/30 rounded-lg backdrop-blur-md z-40 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-[#39FF14]/20">
              <button
                onClick={createNewConversation}
                className="w-full px-3 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg font-mono text-xs text-[#39FF14] hover:bg-[#39FF14]/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3 h-3" />
                New Chat
              </button>
            </div>
            <div className="p-2 space-y-1">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setMessages(conv.messages);
                    setCurrentConversationId(conv.id);
                  }}
                  className={`w-full px-3 py-2 rounded-lg font-mono text-xs text-left transition-all ${
                    currentConversationId === conv.id 
                      ? 'bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14]' 
                      : 'text-[#A6A9B6] hover:bg-[#39FF14]/10'
                  }`}
                >
                  <div className="truncate">{conv.title}</div>
                  <div className="text-[10px] opacity-50">
                    {conv.updatedAt.toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          ref={chatRef}
          className={`cyber-card corner-brackets rounded-lg overflow-hidden backdrop-blur-md ${isFullscreen ? 'h-screen rounded-none' : ''}`}
          style={{
            boxShadow: '0 0 40px rgba(57, 255, 20, 0.15), 0 0 80px rgba(57, 255, 20, 0.05)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
          }}
        >
          {/* Status bar - PRESERVED */}
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
            
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-1.5 text-[#39FF14]/70 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded transition-all"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={downloadChat}
                className="p-1.5 text-[#39FF14]/70 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded transition-all"
                title="Download chat"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-[#39FF14]/70 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded transition-all"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2 px-2 py-1 bg-[#39FF14]/10 rounded-full border border-[#39FF14]/30 ml-2">
              <Sparkles className="w-3 h-3 text-[#39FF14] animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-mono text-xs text-[#39FF14]">Online</span>
              <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-ping" />
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className={`overflow-y-auto p-4 space-y-4 bg-[#05060B]/70 scrollbar-thin scrollbar-thumb-[#39FF14]/30 scrollbar-track-transparent ${isFullscreen ? 'h-[calc(100vh-280px)]' : 'h-64'}`}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[#A6A9B6]/50 space-y-4">
                <Bot className="w-16 h-16 text-[#39FF14]/20" />
                <p className="font-mono text-sm">Start a conversation with CYBER-AI</p>
                <div className="flex items-center gap-2 text-[#39FF14]/50">
                  <Calculator className="w-4 h-4" />
                  <span className="text-xs">Try: "Write a calculator"</span>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 group`}
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
                
                <div className={`max-w-[85%] min-w-0 ${message.type === 'ai' ? 'flex-1' : ''}`}>
                  <div className={`p-3 rounded-lg transition-all duration-300 hover:shadow-lg ${
                    message.type === 'ai'
                      ? 'bg-[#39FF14]/10 border border-[#39FF14]/30 shadow-[#39FF14]/10'
                      : 'bg-[#0B0E14] border border-[#39FF14]/20'
                  }`}>
                    {/* Attachments */}
                    {message.attachments?.map(att => (
                      <div key={att.id} className="mb-2 p-2 bg-[#0B0E14] rounded border border-[#39FF14]/20 flex items-center gap-2">
                        {att.type === 'image' ? (
                          <img src={att.content} alt={att.name} className="max-h-32 rounded object-cover" />
                        ) : att.type === 'code' ? (
                          <div className="flex items-center gap-2 text-[#39FF14]">
                            <Code className="w-4 h-4" />
                            <span className="font-mono text-xs truncate">{att.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#A6A9B6]">
                            <FileText className="w-4 h-4" />
                            <span className="font-mono text-xs truncate">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Content */}
                    {editingId === message.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-2 py-1 bg-[#05060B] border border-[#39FF14]/30 rounded font-mono text-sm text-white resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-xs text-[#A6A9B6] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => editMessage(message.id, editContent)}
                            className="px-2 py-1 bg-[#39FF14]/20 border border-[#39FF14] rounded text-xs text-[#39FF14] hover:bg-[#39FF14]/30"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : message.type === 'ai' ? (
                      <div className="font-mono text-sm text-white prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown 
                          components={MarkdownComponents}
                          remarkPlugins={[remarkGfm]}
                        >
                          {message.isStreaming ? streamingContent : message.content}
                        </ReactMarkdown>
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-[#39FF14] ml-1 animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <p className="font-mono text-sm text-white whitespace-pre-wrap leading-relaxed">
                        {message.content}
                        {message.isEdited && <span className="text-[10px] text-[#A6A9B6]/50 ml-2">(edited)</span>}
                      </p>
                    )}
                    
                    <span className="text-[10px] text-[#39FF14]/50 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Code Output */}
                  {message.codeOutput && (
                    <div className="mt-2 p-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2 text-[#39FF14] text-xs font-mono">
                        <Terminal className="w-3 h-3" />
                        <span>OUTPUT</span>
                      </div>
                      <pre className="font-mono text-xs text-[#A6A9B6] whitespace-pre-wrap">
                        {message.codeOutput}
                      </pre>
                    </div>
                  )}

                  {/* Message actions */}
                  <div className={`flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${message.type === 'user' ? 'justify-end' : ''}`}>
                    {message.type === 'ai' && !message.isStreaming && (
                      <>
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1 text-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
                          title="Copy"
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => regenerateResponse(message.id)}
                          className="p-1 text-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
                          title="Regenerate"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, 'thumbsUp')}
                          className={`p-1 transition-colors ${message.reactions?.thumbsUp ? 'text-[#39FF14]' : 'text-[#39FF14]/50 hover:text-[#39FF14]'}`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleReaction(message.id, 'thumbsDown')}
                          className={`p-1 transition-colors ${message.reactions?.thumbsDown ? 'text-red-400' : 'text-[#39FF14]/50 hover:text-red-400'}`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    {message.type === 'user' && (
                      <>
                        <button
                          onClick={() => startEditing(message)}
                          className="p-1 text-[#39FF14]/50 hover:text-[#39FF14] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-1 text-[#39FF14]/50 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && !streamingContent && (
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

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-32 right-8 p-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-full text-[#39FF14] hover:bg-[#39FF14]/30 transition-all animate-bounce"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Quick questions - WITH ARITHMETIC OPTIONS */}
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

          {/* Enhanced Input */}
          <div className="p-4 bg-[#0B0E14]/90 border-t border-[#39FF14]/20">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map(att => (
                  <div key={att.id} className="flex items-center gap-2 px-2 py-1 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg">
                    {att.type === 'image' ? <ImageIcon className="w-3 h-3 text-[#39FF14]" /> : <FileText className="w-3 h-3 text-[#39FF14]" />}
                    <span className="font-mono text-xs text-[#39FF14] truncate max-w-[100px]">{att.name}</span>
                    <button onClick={() => removeAttachment(att.id)} className="text-[#39FF14]/50 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                className="hidden"
                accept="image/*,.py,.js,.ts,.txt,.md"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-[#39FF14]/50 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-all"
                title="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-[#39FF14]/50 hover:text-[#39FF14] hover:bg-[#39FF14]/10'}`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... (Shift+Enter for new line)"
                  rows={1}
                  className="w-full px-4 py-3 bg-[#05060B] border border-[#39FF14]/30 rounded-lg font-mono text-sm text-white placeholder-[#A6A9B6]/50 focus:outline-none focus:border-[#39FF14] focus:shadow-lg focus:shadow-[#39FF14]/20 transition-all duration-300 resize-none min-h-[48px] max-h-[200px]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-[#39FF14]/30" />
                </div>
              </div>
              
              {isTyping ? (
                <button
                  onClick={stopGeneration}
                  className="px-4 py-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 hover:bg-red-500/40 hover:scale-105 transition-all duration-300"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className="px-4 py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded-lg text-[#39FF14] hover:bg-[#39FF14]/40 hover:scale-105 hover:shadow-lg hover:shadow-[#39FF14]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements - PRESERVED */}
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
        .slide-in-from-bottom-2 {
          animation: slideInFromBottom 0.3s ease-out forwards;
        }
        @keyframes slideInFromBottom {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}