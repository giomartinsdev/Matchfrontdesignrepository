export enum NotificationType {
  TRANSACTION = 'transaction',
  ACCOUNT = 'account',
  INVESTMENT = 'investment',
  RECURRING = 'recurring',
  GOAL = 'goal',
  ALERT = 'alert',
  SYSTEM = 'system'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    transactionId?: string;
    accountId?: string;
    investmentId?: string;
    amount?: number;
    [key: string]: any;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
