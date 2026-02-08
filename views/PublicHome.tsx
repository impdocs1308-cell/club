
import React, { useState, useMemo } from 'react';
import { db } from '../dataService';
import Countdown from '../components/Countdown';
import AnnouncementTicker from '../components/AnnouncementTicker';
import { Team } from '../types';

const PublicHome: React.FC = () => {
  const players = db.getPlayers();
  const teams = db.getTeams();
  const tournaments = db.getTournaments();
  const matches = db.getMatches();
  const announcements = db.getAnnouncements();

  const [tFilter, setTFilter] = useState('all');
  const [yFilter, setYFilter] = useState('all');

  // Next match countdown data
  const nextMatch = useMemo(() => {
    return matches
      .filter(m => new Date(m.matchDate) > new Date())
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())[0];
  }, [matches]);

  // Apply filters to data sets
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchesT = tFilter === 'all' || m.tournamentId === tFilter;
      const matchesY = yFilter === 'all' || m.seasonYear === parseInt(yFilter);
      return matchesT && matchesY;
    });
  }, [matches, tFilter, yFilter]);

  // Dynamically calculate team rankings based on filtered matches
  const dynamicTeamStats = useMemo(() => {
    const statsMap: Record<string, Team> = {};
    teams.forEach(t => {
      statsMap[t.id] = { ...t, wins: 0, losses: 0, draws: 0, points: 0 };
    });

    filteredMatches.forEach(m => {
      if (statsMap[m.teamAId] && statsMap[m.teamBId]) {
        if (m.scoreA > m.scoreB) {
          statsMap[m.teamAId].wins += 1;
          statsMap[m.teamAId].points += 3;
          statsMap[m.teamBId].losses += 1;
        } else if (m.scoreB > m.scoreA) {
          statsMap[m.teamBId].wins += 1;
          statsMap[m.teamBId].points += 3;
          statsMap[m.teamAId].losses += 1;
        } else {
          statsMap[m.teamAId].draws += 1;
          statsMap[m.teamAId].points += 1;
          statsMap[m.teamBId].draws += 1;
          statsMap[m.teamBId].points += 1;
        }
      }
    });

    return Object.values(statsMap).sort((a, b) => b.points - a.points);
  }, [teams, filteredMatches]);

  // Filter players based on selected tournament (simplified: if they belong to a team in the tournament)
  const dynamicPlayerStats = useMemo(() => {
    // For a real-world app, we'd aggregate goals from filteredMatches per player.
    // Here we show players whose team has played at least one match in the filtered list.
    const teamIdsInFilter = new Set(filteredMatches.flatMap(m => [m.teamAId, m.teamBId]));
    
    if (tFilter === 'all' && yFilter === 'all') return players.sort((a,b) => b.rating - a.rating);
    
    return players
      .filter(p => teamIdsInFilter.has(p.teamId))
      .sort((a, b) => b.rating - a.rating);
  }, [players, filteredMatches, tFilter, yFilter]);

  return (
    <div className="pb-12">
      <AnnouncementTicker announcements={announcements} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {nextMatch && (
          <Countdown 
            targetDate={nextMatch.matchDate} 
            label={`Next: ${nextMatch.stageTag} - ${teams.find(t=>t.id===nextMatch.teamAId)?.name} vs ${teams.find(t=>t.id===nextMatch.teamBId)?.name}`}
          />
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
          <div>
            <h2 className="text-2xl font-black text-blue-900 leading-tight">CHAMPIONSHIP STANDINGS</h2>
            <p className="text-blue-400 text-xs font-medium uppercase tracking-widest mt-1">Live Performance Statistics</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-blue-300 uppercase ml-1 mb-1">Tournament</label>
              <select 
                value={tFilter} 
                onChange={e => setTFilter(e.target.value)}
                className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Events</option>
                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold text-blue-300 uppercase ml-1 mb-1">Season</label>
              <select 
                value={yFilter} 
                onChange={e => setYFilter(e.target.value)}
                className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Years</option>
                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Standings */}
          <section className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <h3 className="text-white font-bold flex items-center gap-2 tracking-wide uppercase">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Top Performers
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50/50 text-blue-400 text-[10px] uppercase tracking-widest font-bold border-b border-blue-50">
                  <tr>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-4 py-4 text-center">G</th>
                    <th className="px-4 py-4 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {dynamicPlayerStats.map((p, i) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-200 w-4">{i+1}</span>
                          <div>
                            <div className="font-bold text-blue-900">{p.name}</div>
                            <div className="text-[10px] text-blue-400 font-bold uppercase">{teams.find(t => t.id === p.teamId)?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-blue-800">{p.goals}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-[11px] font-black">{p.rating}</span>
                      </td>
                    </tr>
                  ))}
                  {dynamicPlayerStats.length === 0 && (
                    <tr><td colSpan={3} className="p-10 text-center text-blue-300 italic">No rankings available for this selection</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Team Standings */}
          <section className="bg-white rounded-3xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5">
              <h3 className="text-white font-bold flex items-center gap-2 tracking-wide uppercase">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Club Leaderboard
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-indigo-50/50 text-indigo-400 text-[10px] uppercase tracking-widest font-bold border-b border-indigo-50">
                  <tr>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-3 py-4 text-center">W</th>
                    <th className="px-3 py-4 text-center">D</th>
                    <th className="px-3 py-4 text-center">L</th>
                    <th className="px-6 py-4 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {dynamicTeamStats.map((t, i) => (
                    <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-black text-indigo-200">{i+1}</span>
                           <span className="font-bold text-indigo-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center text-sm font-medium">{t.wins}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium">{t.draws}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium">{t.losses}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-indigo-800">{t.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PublicHome;
