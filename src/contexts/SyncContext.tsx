import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ISyncTransport } from '../services/ISyncTransport';

interface SyncContextType {
  lastSyncTime: number;
  isSyncing: boolean;
  forceSync: () => void;
  syncTransport: ISyncTransport;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
  syncTransport: ISyncTransport;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children, syncTransport }) => {
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    syncTransport.start();

    const handleSyncTimeUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setLastSyncTime(detail.timestamp);
      setIsSyncing(true);

      setTimeout(() => {
        setIsSyncing(false);
      }, 1000);
    };

    window.addEventListener('sync-time-update', handleSyncTimeUpdate);

    return () => {
      window.removeEventListener('sync-time-update', handleSyncTimeUpdate);
      syncTransport.stop();
    };
  }, [syncTransport]);

  const forceSync = () => {
    syncTransport.forceSync();
  };

  return (
    <SyncContext.Provider value={{ lastSyncTime, isSyncing, forceSync, syncTransport }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
