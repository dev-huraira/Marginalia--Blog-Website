import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Feather, BookOpen, Lock, Mail, User } from 'lucide-react';

const AuthForms = ({ isRegister: initialIsRegister }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register, error, setError } = useAuth();

  const [isRegister, setIsRegister] = useState(initialIsRegister);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Sync state if path changes directly (e.g. Navigating between /login and /register)
  useEffect(() => {
    setIsRegister(location.pathname === '/register');
    setError(null); // Clear errors when toggling modes
  }, [location.pathname, setError]);

  // If already authenticated, redirect to desk
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all requested fields.');
      return;
    }

    setLocalLoading(true);
    let success = false;

    if (isRegister) {
      success = await register(name, email, password);
    } else {
      success = await login(email, password);
    }

    setLocalLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-ivory-darker border border-ivory-darkest rounded-md p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative top line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-forest"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <BookOpen className="w-8 h-8 text-forest mx-auto mb-3" />
          <h2 className="font-serif text-3xl font-bold text-ink">
            {isRegister ? 'Register your Pen' : 'Sign in to the Bureau'}
          </h2>
          <p className="text-xs text-ink-muted mt-2 font-sans tracking-wide uppercase">
            {isRegister ? 'Create an author profile' : 'Access your drafting desk'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-light text-rose text-xs border border-rose/15 rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pen Name Field (Only on Register) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-sans uppercase tracking-wider text-ink-muted font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-ink-light" />
                <span>Pen Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Arthur Scribbler"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ivory border border-ivory-darkest rounded px-3 py-2 text-sm focus:outline-none focus:border-forest text-ink placeholder-ink-light/50 font-sans"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-sans uppercase tracking-wider text-ink-muted font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-ink-light" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              placeholder="writer@marginalia.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory border border-ivory-darkest rounded px-3 py-2 text-sm focus:outline-none focus:border-forest text-ink placeholder-ink-light/50 font-sans"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-sans uppercase tracking-wider text-ink-muted font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-ink-light" />
              <span>Security Key</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory border border-ivory-darkest rounded px-3 py-2 text-sm focus:outline-none focus:border-forest text-ink placeholder-ink-light/50 font-sans"
              required
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={localLoading}
            className="w-full inline-flex items-center justify-center space-x-2 text-xs uppercase tracking-wider bg-forest hover:bg-forest-hover text-ivory px-4 py-2.5 rounded shadow-sm font-semibold transition-all mt-6"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>{localLoading ? 'Authenticating...' : isRegister ? 'Establish Account' : 'Enter Desk'}</span>
          </button>
        </form>

        {/* Dynamic Mode Switcher */}
        <div className="mt-8 pt-6 border-t border-ivory-darkest text-center text-xs font-sans text-ink-muted">
          {isRegister ? (
            <p>
              Already registered in this publication?{' '}
              <Link 
                to="/login" 
                className="text-forest hover:underline font-semibold"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
              >
                Sign In here
              </Link>
            </p>
          ) : (
            <p>
              New to our pages?{' '}
              <Link 
                to="/register" 
                className="text-forest hover:underline font-semibold"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
              >
                Register a Pen Name
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
