import { Notification, NotificationType, NotificationPriority, NotificationStats } from '../types/notification';

const STORAGE_KEY = 'finfacil_notifications';

class NotificationService {
  private notifications: Notification[] = [];

  constructor() {
    this.loadFromStorage();
    this.initializeMockNotifications();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private initializeMockNotifications() {
    if (this.notifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: NotificationType.TRANSACTION,
          priority: NotificationPriority.HIGH,
          title: 'Nova Transação Registrada',
          message: 'Despesa de R$ 150,00 em Alimentação foi registrada com sucesso.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          actionUrl: '/dashboard/transactions',
          metadata: { amount: 150, transactionId: 'tx-1' }
        },
        {
          id: '2',
          type: NotificationType.ACCOUNT,
          priority: NotificationPriority.MEDIUM,
          title: 'Saldo Atualizado',
          message: 'O saldo da sua conta corrente foi atualizado para R$ 5.234,50.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          actionUrl: '/dashboard/accounts',
          metadata: { amount: 5234.50, accountId: 'acc-1' }
        },
        {
          id: '3',
          type: NotificationType.INVESTMENT,
          priority: NotificationPriority.LOW,
          title: 'Rendimento de Investimento',
          message: 'Seu investimento em Tesouro Direto rendeu R$ 45,30 este mês.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          actionUrl: '/dashboard/investments',
          metadata: { amount: 45.30, investmentId: 'inv-1' }
        },
        {
          id: '4',
          type: NotificationType.RECURRING,
          priority: NotificationPriority.URGENT,
          title: 'Pagamento Recorrente Próximo',
          message: 'Lembrete: Sua assinatura de Netflix (R$ 45,90) vence amanhã.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          actionUrl: '/dashboard/recorrentes',
          metadata: { amount: 45.90 }
        },
        {
          id: '5',
          type: NotificationType.ALERT,
          priority: NotificationPriority.HIGH,
          title: 'Meta de Gastos Atingida',
          message: 'Você já gastou 80% do seu orçamento mensal em Alimentação.',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          metadata: { percentage: 80, category: 'Alimentação' }
        },
        {
          id: '6',
          type: NotificationType.SYSTEM,
          priority: NotificationPriority.LOW,
          title: 'Bem-vindo ao FinFácil!',
          message: 'Explore todas as funcionalidades do seu gerenciador financeiro.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        },
        {
          id: '7',
          type: NotificationType.TRANSACTION,
          priority: NotificationPriority.MEDIUM,
          title: 'Receita Confirmada',
          message: 'Receita de R$ 3.500,00 em Salário foi confirmada.',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          actionUrl: '/dashboard/transactions',
          metadata: { amount: 3500, transactionId: 'tx-2' }
        }
      ];

      this.notifications = mockNotifications;
      this.saveToStorage();
    }
  }

  getAll(): Notification[] {
    return [...this.notifications].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getUnread(): Notification[] {
    return this.getAll().filter(n => !n.read);
  }

  getById(id: string): Notification | undefined {
    return this.notifications.find(n => n.id === id);
  }

  getStats(): NotificationStats {
    const stats: NotificationStats = {
      total: this.notifications.length,
      unread: this.getUnread().length,
      byType: {} as Record<NotificationType, number>,
      byPriority: {} as Record<NotificationPriority, number>
    };

    // Initialize counters
    Object.values(NotificationType).forEach(type => {
      stats.byType[type] = 0;
    });
    Object.values(NotificationPriority).forEach(priority => {
      stats.byPriority[priority] = 0;
    });

    // Count notifications
    this.notifications.forEach(notification => {
      stats.byType[notification.type]++;
      stats.byPriority[notification.priority]++;
    });

    return stats;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
  }

  delete(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  deleteAll(): void {
    this.notifications = [];
    this.saveToStorage();
  }

  deleteRead(): void {
    this.notifications = this.notifications.filter(n => !n.read);
    this.saveToStorage();
  }

  create(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('notification:created', { 
      detail: newNotification 
    }));

    return newNotification;
  }
}

export const notificationService = new NotificationService();
