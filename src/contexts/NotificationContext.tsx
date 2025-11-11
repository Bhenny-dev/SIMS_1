

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppNotification, UserRole } from '../types.ts';
import { getNotifications } from '../services/api.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { AMARANTH_JOKERS_TEAM_ID } from '../constants.ts';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const pollIntervalRef = useRef<number | null>(null);

  // Load user's read status from localStorage
  useEffect(() => {
    if (user) {
        const storedReadIds = localStorage.getItem(`sims_read_notifs_${user.id}`);
        if (storedReadIds) {
            setReadIds(new Set(JSON.parse(storedReadIds)));
        } else {
            setReadIds(new Set());
        }
    } else {
        setReadIds(new Set());
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      if (user) {
        const isPrivileged = user.role === UserRole.ADMIN || user.role === UserRole.OFFICER || user.teamId === AMARANTH_JOKERS_TEAM_ID;
        
        const filtered = data.filter((n: AppNotification) => {
            if (isPrivileged) {
                // Privileged users see everything except notifications for other specific users
                if (n.target?.userId && n.target.userId !== user.id) {
                    return false;
                }
                return true;
            }
            
            if (!n.target) return true; // Public notification

            if (n.target.userId && n.target.userId === user.id) return true;
            
            if (n.target.roles && n.target.roles.includes(user.role)) {
                // Role- and team-specific (e.g., team lead of a specific team)
                if (n.target.teamId) {
                    return n.target.teamId === user.teamId;
                }
                return true; // Just role-specific
            }
            
            return false;
        });
        setNotifications(filtered);
      } else {
        // Not logged in, show only public notifications
        const publicNotifs = data.filter((n: AppNotification) => !n.target);
        setNotifications(publicNotifs);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 5 seconds
    pollIntervalRef.current = window.setInterval(fetchNotifications, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchNotifications]);

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const newSet = new Set(prev).add(id);
      if (user) {
          localStorage.setItem(`sims_read_notifs_${user.id}`, JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  };

  const markAllAsRead = () => {
      setReadIds(prev => {
          const newSet = new Set(prev);
          notifications.forEach(n => newSet.add(n.id));
          if (user) {
              localStorage.setItem(`sims_read_notifs_${user.id}`, JSON.stringify(Array.from(newSet)));
          }
          return newSet;
      });
  }

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const enhancedNotifications = notifications.map(n => ({
      ...n,
      read: readIds.has(n.id)
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <NotificationContext.Provider value={{ notifications: enhancedNotifications, unreadCount, markAsRead, markAllAsRead, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};