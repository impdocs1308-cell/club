
import React from 'react';
import { UserSession } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserSession;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl font-title tracking-widest">ELITE TOURNAMENT PRO</span>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <button onClick={() => onNavigate('admin')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Admin Panel</button>
              )}
              {user.role === 'player' && (
                <button onClick={() => onNavigate('profile')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">My Stats</button>
              )}
              {user.role === 'public' ? (
                <button onClick={() => onNavigate('login')} className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 px-4 py-2 rounded-md text-sm font-bold shadow">Login</button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-blue-100 text-sm">Hello, {user.name}</span>
                  <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-blue-900 text-blue-200 py-6 text-center text-sm border-t border-blue-800">
        <p>&copy; 2024 Elite Tournament Pro - Built with Passion & Precision</p>
      </footer>
    </div>
  );
};

export default Layout;
