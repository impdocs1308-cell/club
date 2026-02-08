
import React, { useState } from 'react';
import { db } from '../dataService';
import { Priority, Tournament, Player, Match, Announcement } from '../types';

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'matches' | 'players' | 'announcements'>('tournaments');

  // Form states
  const [newT, setNewT] = useState({ id: '', name: '', year: 2024 });
  const [newM, setNewM] = useState({ 
    id: '', tournamentId: '', teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, date: '', stage: '', year: 2024 
  });
  const [newP, setNewP] = useState({ id: '', name: '', username: '', password: '', teamId: '' });
  const [newA, setNewA] = useState({ content: '', priority: Priority.MEDIUM });

  // UI state
  const [editMatchId, setEditMatchId] = useState<string | null>(null);
  const [editPlayerId, setEditPlayerId] = useState<string | null>(null);

  // Load Data
  const tournaments = db.getTournaments();
  const teams = db.getTeams();
  const players = db.getPlayers();
  const announcements = db.getAnnouncements();
  const matches = db.getMatches();

  const handleMatchSubmit = () => {
    if (newM.tournamentId && newM.teamAId && newM.teamBId) {
      if (editMatchId) {
        db.updateMatch({ ...newM, id: editMatchId } as Match);
      } else {
        db.addMatch({ ...newM, id: Date.now().toString(), matchDate: newM.date, stageTag: newM.stage, seasonYear: newM.year } as any);
      }
      setNewM({ id: '', tournamentId: '', teamAId: '', teamBId: '', scoreA: 0, scoreB: 0, date: '', stage: '', year: 2024 });
      setEditMatchId(null);
    }
  };

  const handlePlayerSubmit = () => {
    if (newP.name && newP.username) {
      if (editPlayerId) {
        db.updatePlayer({ ...newP, id: editPlayerId } as Player);
      } else {
        db.addPlayer({ ...newP, id: `p-${Date.now()}`, matchesPlayed: 0, goals: 0, assists: 0, rating: 5.0 } as any);
      }
      setNewP({ id: '', name: '', username: '', password: '', teamId: '' });
      setEditPlayerId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 font-title tracking-widest uppercase">Console</h1>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Master Tournament Control Panel</p>
        </div>
        <div className="flex bg-blue-100 p-1.5 rounded-2xl shadow-inner w-full md:w-auto overflow-x-auto">
          {['tournaments', 'matches', 'players', 'announcements'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-400 hover:text-blue-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-blue-50 min-h-[600px]">
        {activeTab === 'tournaments' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-blue-50/50 rounded-[1.5rem] border border-blue-100">
               <input className="flex-1 border-blue-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ID (e.g. TRN-001)" value={newT.id} onChange={e => setNewT({...newT, id: e.target.value})} />
               <input className="flex-1 border-blue-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} />
               <input className="w-24 border-blue-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" type="number" value={newT.year} onChange={e => setNewT({...newT, year: parseInt(e.target.value)})} />
               <button onClick={() => { if(newT.id && newT.name) { db.addTournament({...newT, active:true}); setNewT({id:'', name:'', year:2024}); }}} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transform active:scale-95 transition-all">Add Event</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map(t => (
                <div key={t.id} className="p-6 border border-blue-50 rounded-2xl flex justify-between items-center bg-blue-50/20">
                  <div>
                    <div className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1">{t.id}</div>
                    <div className="text-xl font-black text-blue-900 leading-tight">{t.name}</div>
                    <div className="text-xs text-blue-400 font-bold mt-1">Season {t.year}</div>
                  </div>
                  <button onClick={() => db.deleteTournament(t.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 p-8 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100">
               <div className="col-span-full mb-2 flex items-center justify-between">
                 <h3 className="text-indigo-900 font-black uppercase text-sm tracking-widest">{editMatchId ? 'Editing Match' : 'Record New Match'}</h3>
                 {editMatchId && <button onClick={() => {setEditMatchId(null); setNewM({id:'', tournamentId:'', teamAId:'', teamBId:'', scoreA:0, scoreB:0, date:'', stage:'', year:2024});}} className="text-xs text-indigo-400 font-bold underline">Cancel Edit</button>}
               </div>
               <select className="border-indigo-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" value={newM.tournamentId} onChange={e => setNewM({...newM, tournamentId: e.target.value})}>
                 <option value="">Select Tournament</option>
                 {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
               </select>
               <select className="border-indigo-100 border rounded-xl px-4 py-3 text-sm" value={newM.teamAId} onChange={e => setNewM({...newM, teamAId: e.target.value})}><option value="">Home Team</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
               <select className="border-indigo-100 border rounded-xl px-4 py-3 text-sm" value={newM.teamBId} onChange={e => setNewM({...newM, teamBId: e.target.value})}><option value="">Away Team</option>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
               <input type="datetime-local" className="border-indigo-100 border rounded-xl px-4 py-3 text-sm" value={newM.date} onChange={e => setNewM({...newM, date: e.target.value})} />
               <input className="border-indigo-100 border rounded-xl px-4 py-3 text-sm" placeholder="Match Stage (e.g. Finals)" value={newM.stage} onChange={e => setNewM({...newM, stage: e.target.value})} />
               <div className="flex gap-2">
                 <input type="number" className="w-full border-indigo-100 border rounded-xl px-4 py-3 text-sm" placeholder="Score A" value={newM.scoreA} onChange={e => setNewM({...newM, scoreA: parseInt(e.target.value)})} />
                 <input type="number" className="w-full border-indigo-100 border rounded-xl px-4 py-3 text-sm" placeholder="Score B" value={newM.scoreB} onChange={e => setNewM({...newM, scoreB: parseInt(e.target.value)})} />
               </div>
               <button onClick={handleMatchSubmit} className="col-span-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black text-sm shadow-xl uppercase tracking-widest">{editMatchId ? 'Update Record' : 'Commit Match'}</button>
             </div>

             <div className="space-y-4">
               {matches.sort((a,b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()).map(m => (
                 <div key={m.id} className="flex flex-wrap items-center justify-between p-6 bg-white border border-indigo-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex-1">
                      <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">{m.stageTag} • {new Date(m.matchDate).toLocaleString()}</div>
                      <div className="text-xl font-black text-indigo-950 flex items-center gap-4">
                        <span className="w-32 text-right">{teams.find(t=>t.id===m.teamAId)?.name}</span>
                        <span className="bg-indigo-100 px-4 py-1.5 rounded-xl text-indigo-600 text-lg">{m.scoreA} : {m.scoreB}</span>
                        <span className="w-32 text-left">{teams.find(t=>t.id===m.teamBId)?.name}</span>
                      </div>
                   </div>
                   <div className="flex gap-2 ml-4">
                     <button onClick={() => { setEditMatchId(m.id); setNewM({...m, date: m.matchDate, stage: m.stageTag, year: m.seasonYear}); }} className="p-2.5 text-blue-400 hover:bg-blue-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                     <button onClick={() => db.deleteMatch(m.id)} className="p-2.5 text-red-300 hover:bg-red-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10 p-8 bg-teal-50/50 rounded-[1.5rem] border border-teal-100">
               <div className="col-span-full mb-2 flex items-center justify-between">
                 <h3 className="text-teal-900 font-black uppercase text-sm tracking-widest">{editPlayerId ? 'Editing Player' : 'Register New Player'}</h3>
                 {editPlayerId && <button onClick={() => {setEditPlayerId(null); setNewP({id:'', name:'', username:'', password:'', teamId:''});}} className="text-xs text-teal-400 font-bold underline">Cancel Edit</button>}
               </div>
               <input className="border-teal-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500" placeholder="Full Name" value={newP.name} onChange={e => setNewP({...newP, name: e.target.value})} />
               <input className="border-teal-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500" placeholder="Username" value={newP.username} onChange={e => setNewP({...newP, username: e.target.value})} />
               <input className="border-teal-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500" type="password" placeholder="Password" value={newP.password} onChange={e => setNewP({...newP, password: e.target.value})} />
               <select className="border-teal-100 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500" value={newP.teamId} onChange={e => setNewP({...newP, teamId: e.target.value})}>
                 <option value="">Select Team</option>
                 {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
               </select>
               <button onClick={handlePlayerSubmit} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg">{editPlayerId ? 'Save Profile' : 'Register'}</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map(p => (
                <div key={p.id} className="p-6 border border-teal-50 rounded-3xl flex items-center justify-between bg-teal-50/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center font-black text-white shadow-lg">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-teal-950 text-lg leading-tight">{p.name}</div>
                      <div className="text-xs text-teal-400 font-bold uppercase tracking-tighter">@{p.username} • {teams.find(t=>t.id===p.teamId)?.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {setEditPlayerId(p.id); setNewP(p);}} className="text-blue-400 p-2 hover:bg-blue-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => db.deletePlayer(p.id)} className="text-red-300 p-2 hover:bg-red-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <div className="flex flex-col gap-5 mb-10 p-8 bg-orange-50/50 rounded-[1.5rem] border border-orange-100">
              <textarea 
                className="w-full border-orange-100 border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Broadcast a new message to all users..."
                rows={3}
                value={newA.content}
                onChange={e => setNewA({...newA, content: e.target.value})}
              />
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <select className="w-full sm:w-auto border-orange-100 border rounded-xl px-5 py-3 text-sm font-bold text-orange-800" value={newA.priority} onChange={e => setNewA({...newA, priority: e.target.value as Priority})}>
                  <option value={Priority.LOW}>Low Priority</option>
                  <option value={Priority.MEDIUM}>Standard Priority</option>
                  <option value={Priority.HIGH}>High / Urgent</option>
                </select>
                <button onClick={() => { if(newA.content) { db.addAnnouncement({ id: Date.now().toString(), content: newA.content, priority: newA.priority, date: new Date().toISOString().split('T')[0] }); setNewA({content:'', priority:Priority.MEDIUM}); }}} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-10 py-3.5 rounded-xl font-black text-sm shadow-xl uppercase tracking-widest">Broadcast Now</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {announcements.map(a => (
                <div key={a.id} className={`p-6 border rounded-[1.5rem] flex justify-between items-start transition-all ${a.priority === Priority.HIGH ? 'bg-red-50 border-red-100' : 'bg-white border-orange-50 shadow-sm'}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                       <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${a.priority === Priority.HIGH ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
                         {a.priority}
                       </span>
                       <span className="text-[10px] text-gray-400 font-black tracking-widest">{a.date}</span>
                    </div>
                    <p className="text-gray-800 font-medium text-sm leading-relaxed">{a.content}</p>
                  </div>
                  <button onClick={() => db.deleteAnnouncement(a.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
