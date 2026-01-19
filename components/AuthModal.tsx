
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      const result = authService.register(email, name, password);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    } else {
      const result = authService.login(email, password);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1e2329] w-full max-w-md rounded-xl shadow-2xl border border-[#2b3139] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[#2b3139]">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2b3139] border border-transparent focus:border-yellow-500 rounded p-3 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2b3139] border border-transparent focus:border-yellow-500 rounded p-3 outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2b3139] border border-transparent focus:border-yellow-500 rounded p-3 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-bold transition-all transform active:scale-[0.98] mt-2">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-sm text-yellow-500 hover:underline"
            >
              {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
