import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  Search, 
  Command, 
  Moon, 
  Sun,
  LogOut,
  Layout,
  ArrowLeftRight,
  Repeat,
  User,
  Bell,
  Sparkles
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useIsMobile } from '../ui/use-mobile';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DashboardHome } from './DashboardHome';
import { TransactionsPage } from './TransactionsPage';
import { AccountsPage } from './AccountsPage';
import { InvestmentsPage } from './InvestmentsPage';
import { RecorrentesPage } from './RecorrentesPage';
import { SettingsPage } from './SettingsPage';
import { GlobalSearchModalFixed } from './GlobalSearchModalFixed';
import { NotificationInbox } from '../notifications/NotificationInbox';
import { GoalsPage } from './GoalsPage';

export function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationInboxOpen, setNotificationInboxOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Layout, path: '/dashboard' },
    { id: 'transactions', label: 'Transações', icon: ArrowLeftRight, path: '/dashboard/transactions' },
    { id: 'accounts', label: 'Contas', icon: Wallet, path: '/dashboard/accounts' },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp, path: '/dashboard/investments' },
    { id: 'recorrentes', label: 'Recorrentes', icon: Repeat, path: '/dashboard/recorrentes' },
    { id: 'settings', label: 'Configurações', icon: User, path: '/dashboard/settings' },
    { id: 'goals', label: 'Metas', icon: Sparkles, path: '/dashboard/goals' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed bottom-5 right-5 w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center z-50 transition-transform hover:scale-110"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed bottom-20 right-5 w-72 bg-sidebar backdrop-blur-2xl rounded-3xl shadow-2xl z-50 p-4 space-y-2 border border-sidebar-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <div className="flex min-h-screen bg-background overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-72 h-screen border-r border-sidebar-border bg-sidebar backdrop-blur-2xl flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-[20px] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold text-sidebar-foreground">
                  FinFácil
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setSearchModalOpen(true)}
                  className="pl-10 pr-10 rounded-[14px] bg-input-background border-0 cursor-pointer"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-sidebar-border bg-sidebar backdrop-blur-2xl flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              {user && (
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                  Olá, {user.name.split(' ')[0]}.
                </h1>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchModalOpen(true)}
                  className="rounded-full w-9 h-9"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full w-9 h-9"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full w-9 h-9 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationInboxOpen(true)}
                className="rounded-full w-9 h-9 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/investments" element={<InvestmentsPage />} />
                <Route path="/recorrentes" element={<RecorrentesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/goals" element={<GoalsPage />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Global Search Modal */}
        <GlobalSearchModalFixed
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />

        {/* Notification Inbox */}
        <NotificationInbox
          isOpen={notificationInboxOpen}
          onClose={() => setNotificationInboxOpen(false)}
        />
      </div>
    </>
  );
}