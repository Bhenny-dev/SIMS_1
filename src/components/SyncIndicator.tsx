import React from 'react';
import { useSync } from '../contexts/SyncContext';

export const SyncIndicator: React.FC = () => {
  const { isSyncing, lastSyncTime, forceSync } = useSync();

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={forceSync}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Force sync data"
      >
        <i 
          className={`bi bi-arrow-repeat ${isSyncing ? 'animate-spin' : ''}`}
          style={{ fontSize: '1rem' }}
        ></i>
        <span className="text-gray-600 dark:text-gray-400">
          {isSyncing ? 'Syncing...' : `Synced ${getTimeAgo(lastSyncTime)}`}
        </span>
      </button>
    </div>
  );
};
