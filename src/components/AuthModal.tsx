import { useState } from 'react';
import { X, Shield, Eye, EyeOff, Github, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSwitchMode: () => void;
}

export default function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    
    // Show success message
    alert(mode === 'login' ? 'Welcome back to CyberVerse Community!' : 'Welcome to CyberVerse Community! Your account has been created.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md cyber-card rounded-lg p-8 transform animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 mb-4">
            <Shield className="w-8 h-8 text-[#39FF14]" />
          </div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-2">
            {mode === 'login' ? 'ENTER THE HQ' : 'JOIN THE HQ'}
          </h2>
          <p className="font-mono text-sm text-[#A6A9B6]">
            {mode === 'login' 
              ? 'Secure access to the community' 
              : 'Start your cybersecurity journey'}
          </p>
        </div>
        
        {/* Social Login */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14]/60 transition-colors">
            <Github className="w-5 h-5 text-[#A6A9B6]" />
            <span className="font-mono text-sm text-[#A6A9B6]">GitHub</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded hover:border-[#39FF14]/60 transition-colors">
            <Mail className="w-5 h-5 text-[#A6A9B6]" />
            <span className="font-mono text-sm text-[#A6A9B6]">Google</span>
          </button>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#39FF14]/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#0B0E14] font-mono text-xs text-[#A6A9B6]">OR</span>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block font-mono text-sm text-[#A6A9B6] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input transition-all"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block font-mono text-sm text-[#A6A9B6] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-4 py-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block font-mono text-sm text-[#A6A9B6] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#0B0E14] border border-[#39FF14]/30 rounded font-mono text-sm text-white placeholder-[#A6A9B6]/50 cyber-input transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="font-mono text-xs text-[#39FF14] hover:underline">
                Forgot password?
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#39FF14]/20 border border-[#39FF14] rounded font-orbitron font-bold text-[#39FF14] hover:bg-[#39FF14]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : ( 
              <span>{mode === 'login' ? 'ACCESS HQ' : 'CREATE ACCOUNT'}</span>
            )}
          </button>
        </form>
        
        {/* Switch mode */}
        <p className="mt-6 text-center font-mono text-sm text-[#A6A9B6]">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={onSwitchMode}
            className="text-[#39FF14] hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
