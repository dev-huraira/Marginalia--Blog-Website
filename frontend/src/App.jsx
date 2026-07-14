import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';
import AuthForms from './pages/AuthForms';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-ivory text-ink selection:bg-rose-light selection:text-rose">
          {/* Header */}
          <Navbar />

          {/* Main Workspace */}
          <main className="flex-grow px-6 md:px-12 py-10 md:py-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Feed />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/login" element={<AuthForms isRegister={false} />} />
              <Route path="/register" element={<AuthForms isRegister={true} />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editor" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/editor/:id" 
                element={
                  <ProtectedRoute>
                    <Editor />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          {/* Minimal Editorial Footer */}
          <footer className="border-t border-ivory-darkest py-12 px-6 md:px-12 bg-ivory-darker/30">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans tracking-wide text-ink-muted uppercase">
              <div className="flex items-center space-x-2">
                <span>Marginalia</span>
                <span>•</span>
                <span>Est. 2026</span>
              </div>
              <p className="text-center md:text-right">
                A quiet space for annotations, drafts, and independent letters.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
