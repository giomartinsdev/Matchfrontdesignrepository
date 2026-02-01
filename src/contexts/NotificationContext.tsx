import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationStats } from '../types/notification';
import { notificationService } from '../services/notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAll: () => void;
  deleteRead: () => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {} as any,
    byPriority: {} as any
  });

  const loadNotifications = () => {
    const allNotifications = notificationService.getAll();
    const notificationStats = notificationService.getStats();
    setNotifications(allNotifications);
    setStats(notificationStats);
  };

  useEffect(() => {
    loadNotifications();

    // Listen for notification events
    const handleNotificationCreated = () => {
      loadNotifications();
    };

    window.addEventListener('notification:created', handleNotificationCreated);
    return () => {
      window.removeEventListener('notification:created', handleNotificationCreated);
    };
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
  };

  const deleteNotification = (id: string) => {
    notificationService.delete(id);
    loadNotifications();
  };

  const deleteAll = () => {
    notificationService.deleteAll();
    loadNotifications();
  };

  const deleteRead = () => {
    notificationService.deleteRead();
    loadNotifications();
  };

  const refresh = () => {
    loadNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: stats.unread,
        stats,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAll,
        deleteRead,
        refresh
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
