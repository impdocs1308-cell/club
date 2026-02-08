

import React from 'react';
import { Announcement, Priority } from '../types';

interface Props {
  announcements: Announcement[];
}

const AnnouncementTicker: React.FC<Props> = ({ announcements }) => {
  // Sort by priority (High first)
  const sorted = [...announcements].sort((a, b) => {
    const map = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return map[b.priority] - map[a.priority];
  });

  return (
    <div className="bg-orange-500 text-white py-2 overflow-hidden relative shadow-inner">
      <div className="announcement-ticker flex items-center gap-12 text-sm font-medium uppercase tracking-wide">
        {sorted.map((ann, idx) => (
          <div key={ann.id} className="flex items-center gap-2">
            {ann.priority === Priority.HIGH && <span className="bg-red-600 text-[10px] px-1.5 py-0.5 rounded animate-pulse">URGENT</span>}
            <span>• {ann.content}</span>
            <span className="text-orange-200">[{ann.date}]</span>
          </div>
        ))}
        {/* Duplicate for seamless looping if content is short */}
        {sorted.map((ann, idx) => (
          <div key={`${ann.id}-dup`} className="flex items-center gap-2">
            {ann.priority === Priority.HIGH && <span className="bg-red-600 text-[10px] px-1.5 py-0.5 rounded animate-pulse">URGENT</span>}
            <span>• {ann.content}</span>
            <span className="text-orange-200">[{ann.date}]</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementTicker;
