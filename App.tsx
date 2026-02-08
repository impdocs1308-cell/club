
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PublicHome from './views/PublicHome';
import PlayerProfile from './views/PlayerProfile';
import AdminPortal from './views/AdminPortal';
import { db } from './dataService';
import { UserSession } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession>({ role: 'public' });
  const [view, setView] = useState('home'); // home, profile, admin, login

  // Persistence check for session (simplified)
  useEffect(() => {
    const saved = localStorage.getItem('ETP_USER_SESSION');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const uname = formData.get('username') as string;
    const pwd = formData.get('password') as string;

    if (uname === 'admin' && pwd === '9908') {
      const session: UserSession = { role: 'admin', name: 'System Admin' };
      setUser(session);
      localStorage.setItem('ETP_USER_SESSION', JSON.stringify(session));
      setView('admin');
    } else {
      const player = db.getPlayers().find(p => p.username === uname && p.password === pwd);
      if (player) {
        const session: UserSession = { role: 'player', id: player.id, name: player.name };
        setUser(session);
        localStorage.setItem('ETP_USER_SESSION', JSON.stringify(session));
        setView('profile');
      } else {
        alert('Invalid credentials!');
      }
    }
  };

  const handleLogout = () => {
    setUser({ role: 'public' });
    localStorage.removeItem('ETP_USER_SESSION');
    setView('home');
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNavigate={setView}>
      {view === 'home' && <PublicHome />}
      
      {view === 'login' && (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-blue-50">
            <h2 className="text-2xl font-black text-blue-900 mb-6 text-center uppercase tracking-widest">Login Portal</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1 ml-1">Username</label>
                <input name="username" type="text" required className="w-full bg-blue-50 border-blue-100 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1 ml-1">Password</label>
                <input name="password" type="password" required className="w-full bg-blue-50 border-blue-100 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 uppercase tracking-widest mt-4">
                Enter Arena
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-blue-300">Admin or Player access only. Public users can browse without logging in.</p>
          </div>
        </div>
      )}

      {view === 'profile' && user.role === 'player' && <PlayerProfile user={user} />}
      {view === 'admin' && user.role === 'admin' && <AdminPortal />}
      
      {/* Protected View Redirects */}
      {(view === 'profile' && user.role !== 'player') && <PublicHome />}
      {(view === 'admin' && user.role !== 'admin') && <PublicHome />}
    </Layout>
  );
};

export default App;
