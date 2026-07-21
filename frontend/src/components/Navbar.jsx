import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Feather } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAboutClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const aboutElem = document.getElementById('about');
      if (aboutElem) {
        aboutElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="border-b border-ivory-darkest py-6 px-6 md:px-12 bg-ivory/85 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo / Name */}
        <Link to="/" className="flex items-center space-x-3 text-ink group">
          <BookOpen className="w-5 h-5 text-forest group-hover:rotate-3 transition-transform" />
          <span className="font-serif text-2xl font-bold tracking-tight link-underline">
            Marginalia
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center space-x-5 md:space-x-8 text-xs md:text-sm font-sans tracking-wide uppercase text-ink-muted">
          <NavLink 
            to="/journal" 
            className={({ isActive }) => 
              `hover:text-forest transition-colors ${isActive ? 'text-forest font-semibold border-b-2 border-forest pb-1 -mb-[26px]' : ''}`
            }
          >
            Read
          </NavLink>

          <a 
            href="/#about" 
            onClick={handleAboutClick}
            className="hover:text-forest transition-colors"
          >
            About
          </a>

          {user ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `hover:text-forest transition-colors ${isActive ? 'text-forest font-semibold border-b-2 border-forest pb-1 -mb-[26px]' : ''}`
                }
              >
                Desk
              </NavLink>
              
              <NavLink 
                to="/editor" 
                className={({ isActive }) => 
                  `hover:text-forest transition-colors flex items-center space-x-1.5 ${isActive ? 'text-forest font-semibold border-b-2 border-forest pb-1 -mb-[26px]' : ''}`
                }
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Write</span>
              </NavLink>

              <button 
                onClick={handleLogout}
                className="hover:text-rose transition-colors uppercase text-xs border border-ink-light/45 hover:border-rose/65 rounded px-2.5 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3 normal-case">
              <NavLink 
                to="/login" 
                className={({ isActive }) => 
                  `hover:text-forest transition-colors text-ink font-medium ${isActive ? 'text-forest font-semibold' : ''}`
                }
              >
                Sign In
              </NavLink>

              <NavLink 
                to="/register" 
                className="px-3 py-1.5 rounded-sm bg-forest hover:bg-forest-hover text-ivory transition-all shadow-sm font-medium text-xs tracking-wider uppercase"
              >
                Join
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
