import { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter,
  CheckCheck,
  Inbox
} from 'lucide-react';
import { NotificationType, NotificationPriority } from '../../types/notification';

interface NotificationInboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationInbox({ isOpen, onClose }: NotificationInboxProps) {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteAll,
    deleteRead 
  } = useNotifications();

  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [showFilters, setShowFilters] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(notification => {
    if (filterType !== 'all' && notification.type !== filterType) return false;
    if (filterRead === 'unread' && notification.read) return false;
    if (filterRead === 'read' && !notification.read) return false;
    return true;
  });

  const typeLabels: Record<NotificationType | 'all', string> = {
    all: 'Todas',
    transaction: 'Transações',
    account: 'Contas',
    investment: 'Investimentos',
    recurring: 'Recorrentes',
    goal: 'Metas',
    alert: 'Alertas',
    system: 'Sistema'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Inbox Panel */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-card border-l border-sidebar-border z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border bg-sidebar backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-[12px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Notificações</h2>
                <p className="text-sm text-muted-foreground">
                  {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              ✕
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="rounded-full text-xs"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Marcar todas como lidas
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full w-8 h-8 ${showFilters ? 'bg-primary/10 text-primary' : ''}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
            {notifications.length > 0 && (
              <div className="relative ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-8 h-8 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    const menu = document.getElementById('delete-menu');
                    if (menu) {
                      menu.classList.toggle('hidden');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div 
                  id="delete-menu"
                  className="hidden absolute right-0 mt-2 w-48 rounded-[14px] border-sidebar-border bg-card backdrop-blur-2xl overflow-hidden z-10 shadow-lg"
                >
                  <button
                    onClick={() => {
                      deleteRead();
                      document.getElementById('delete-menu')?.classList.add('hidden');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors text-sm text-foreground"
                  >
                    Deletar lidas
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Deseja realmente deletar todas as notificações?')) {
                        deleteAll();
                        document.getElementById('delete-menu')?.classList.add('hidden');
                      }
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-destructive/10 transition-colors text-sm text-destructive"
                  >
                    Deletar todas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-sidebar-border bg-accent/20 space-y-3">
            {/* Type Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Tipo
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', ...Object.values(NotificationType)] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Read Status Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <div className="flex gap-2">
                {(['all', 'unread', 'read'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterRead(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterRead === status
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {status === 'all' ? 'Todas' : status === 'unread' ? 'Não lidas' : 'Lidas'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-muted-foreground">
                {filterType !== 'all' || filterRead !== 'all'
                  ? 'Nenhuma notificação corresponde aos filtros selecionados.'
                  : 'Você está em dia! Não há notificações no momento.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
