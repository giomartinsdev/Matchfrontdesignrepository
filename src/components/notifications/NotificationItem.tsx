import { Notification, NotificationType, NotificationPriority } from '../../types/notification';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  Repeat, 
  AlertTriangle, 
  Info,
  X,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.TRANSACTION:
        return notification.metadata?.amount && notification.metadata.amount > 0
          ? <ArrowUpRight className="w-5 h-5" />
          : <ArrowDownRight className="w-5 h-5" />;
      case NotificationType.ACCOUNT:
        return <Wallet className="w-5 h-5" />;
      case NotificationType.INVESTMENT:
        return <TrendingUp className="w-5 h-5" />;
      case NotificationType.RECURRING:
        return <Repeat className="w-5 h-5" />;
      case NotificationType.ALERT:
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case NotificationType.TRANSACTION:
        return notification.metadata?.amount && notification.metadata.amount > 0
          ? 'bg-success/10 text-success'
          : 'bg-destructive/10 text-destructive';
      case NotificationType.ACCOUNT:
        return 'bg-primary/10 text-primary';
      case NotificationType.INVESTMENT:
        return 'bg-blue-500/10 text-blue-500';
      case NotificationType.RECURRING:
        return 'bg-purple-500/10 text-purple-500';
      case NotificationType.ALERT:
        return 'bg-orange-500/10 text-orange-500';
      case NotificationType.GOAL:
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBorder = () => {
    switch (notification.priority) {
      case NotificationPriority.URGENT:
        return 'border-l-4 border-l-destructive';
      case NotificationPriority.HIGH:
        return 'border-l-4 border-l-orange-500';
      case NotificationPriority.MEDIUM:
        return 'border-l-4 border-l-primary';
      default:
        return 'border-l-4 border-l-transparent';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Agora mesmo';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`group relative p-4 rounded-[16px] transition-all duration-200 ${
        notification.read 
          ? 'bg-transparent hover:bg-accent/30' 
          : 'bg-sidebar-accent/50 hover:bg-sidebar-accent'
      } ${getPriorityBorder()} ${notification.actionUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 ${getIconColor()}`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {getTimeAgo(notification.createdAt)}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>

          {notification.actionUrl && (
            <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ver detalhes</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
        )}

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full absolute top-2 right-2"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
