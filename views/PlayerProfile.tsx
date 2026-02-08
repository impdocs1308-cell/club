
import React from 'react';
import { db } from '../dataService';
import { UserSession } from '../types';

interface Props {
  user: UserSession;
}

const PlayerProfile: React.FC<Props> = ({ user }) => {
  const player = db.getPlayers().find(p => p.id === user.id);
  const team = player ? db.getTeams().find(t => t.id === player.teamId) : null;
  const matches = db.getMatches().filter(m => m.teamAId === team?.id || m.teamBId === team?.id);

  if (!player) return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-50 flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${player.id}/200`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-1">{player.name}</h2>
              <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2">
                <span className="bg-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase">{team?.name || 'Free Agent'}</span>
                <span>• #{player.id.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Matches</div>
            <div className="text-3xl font-black text-blue-900">{player.matchesPlayed}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Goals</div>
            <div className="text-3xl font-black text-blue-900">{player.goals}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Assists</div>
            <div className="text-3xl font-black text-blue-900">{player.assists}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Rating</div>
            <div className="text-3xl font-black text-blue-900">{player.rating}</div>
          </div>
        </div>

        <div className="p-8 border-t border-blue-50">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Recent Team Performance</h3>
          <div className="space-y-4">
            {matches.length === 0 ? (
              <p className="text-blue-400 italic">No match history recorded yet.</p>
            ) : (
              matches.map(m => {
                const teamA = db.getTeams().find(t => t.id === m.teamAId);
                const teamB = db.getTeams().find(t => t.id === m.teamBId);
                return (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1 text-right font-medium text-blue-900">{teamA?.name}</div>
                    <div className="flex items-center gap-3 px-6">
                      <span className="text-2xl font-black text-blue-600">{m.scoreA}</span>
                      <span className="text-gray-300">-</span>
                      <span className="text-2xl font-black text-blue-600">{m.scoreB}</span>
                    </div>
                    <div className="flex-1 text-left font-medium text-blue-900">{teamB?.name}</div>
                    <div className="ml-4 text-[10px] bg-white border border-blue-100 px-2 py-1 rounded-md text-blue-400 uppercase font-bold whitespace-nowrap hidden sm:block">
                      {m.stageTag}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
