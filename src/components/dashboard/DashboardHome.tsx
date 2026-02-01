import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Calendar, ChevronDown } from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { apiService, type DashboardStats, type Transaction } from '../../services/api';
import { TransactionType } from '../../types/transaction-types';

type Period = '7days' | '30days' | '90days' | '12months' | 'year' | 'alltime';

export function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('30days');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const periods = [
    { value: '7days' as Period, label: 'Últimos 7 dias' },
    { value: '30days' as Period, label: 'Últimos 30 dias' },
    { value: '90days' as Period, label: 'Últimos 90 dias' },
    { value: '12months' as Period, label: 'Últimos 12 meses' },
    { value: 'year' as Period, label: 'Este ano' },
    { value: 'alltime' as Period, label: 'Todo o sempre' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsData, transactionsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTransactions()
      ]);
      setStats(statsData);
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock chart data
  const chartData = [
    { date: 'Jan', receitas: 5000, despesas: 3200 },
    { date: 'Fev', receitas: 4200, despesas: 2800 },
    { date: 'Mar', receitas: 5500, despesas: 3600 },
    { date: 'Abr', receitas: 4800, despesas: 3100 },
    { date: 'Mai', receitas: 5200, despesas: 3400 },
    { date: 'Jun', receitas: 5000, despesas: 3000 },
  ];

  const balanceHistory = [
    { month: 'Jan', saldo: 10000 },
    { month: 'Fev', saldo: 11400 },
    { month: 'Mar', saldo: 13300 },
    { month: 'Abr', saldo: 15000 },
    { month: 'Mai', saldo: 16800 },
    { month: 'Jun', saldo: 18800 },
  ];

  const categoryData = [
    { category: 'Alimentação', value: 800 },
    { category: 'Transporte', value: 500 },
    { category: 'Moradia', value: 1200 },
    { category: 'Lazer', value: 300 },
    { category: 'Outros', value: 200 },
  ];

  const currentPeriodLabel = periods.find(p => p.value === selectedPeriod)?.label;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Visão Geral Financeira
          </h2>
          <p className="text-muted-foreground">
            Acompanhe suas finanças em tempo real
          </p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowPeriodMenu(!showPeriodMenu)}
            className="rounded-[14px] border-sidebar-border min-w-[200px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{currentPeriodLabel}</span>
            </div>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
          {showPeriodMenu && (
            <div className="absolute right-0 mt-2 w-full rounded-[14px] border-sidebar-border bg-card backdrop-blur-2xl overflow-hidden z-10 shadow-lg">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    setSelectedPeriod(period.value);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                    selectedPeriod === period.value ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-foreground'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl hover:bg-card/80 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-[16px] flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <ArrowUpRight className="w-3 h-3" />
              {stats.balance_change_percent?.toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedPeriod === '30days' ? 'Saldo do Período' : 'Saldo Total'}
          </p>
          <p className="text-2xl font-bold text-foreground">
            R$ {stats.total_balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl hover:bg-card/80 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-success/10 rounded-[16px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
              <ArrowUpRight className="w-3 h-3" />
              {stats.income_change_percent?.toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Receitas {currentPeriodLabel?.toLowerCase()}
          </p>
          <p className="text-2xl font-bold text-foreground">
            R$ {stats.monthly_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl hover:bg-card/80 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-[16px] flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
              <ArrowDownRight className="w-3 h-3" />
              {stats.expenses_change_percent?.toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Despesas {currentPeriodLabel?.toLowerCase()}
          </p>
          <p className="text-2xl font-bold text-foreground">
            R$ {stats.monthly_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl hover:bg-card/80 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-[16px] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <ArrowUpRight className="w-3 h-3" />
              {stats.investments_change_percent?.toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Investimentos</p>
          <p className="text-2xl font-bold text-foreground">
            R$ {stats.investments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas vs Despesas */}
        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Receitas vs Despesas</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="date" stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="receitas" stroke="#10b981" fillOpacity={1} fill="url(#colorReceitas)" name="Receitas" />
              <Area type="monotone" dataKey="despesas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" name="Despesas" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Saldo Acumulado */}
        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Evolução do Saldo</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="month" stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="saldo" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5 }} name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Despesas por Categoria */}
        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Despesas por Categoria</h3>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                <span className="text-sm text-muted-foreground">{category.category}</span>
                <span className="text-sm font-semibold text-foreground ml-auto">
                  R$ {category.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tendência por Categoria */}
        <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Tendência por Categoria</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="date" stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <YAxis stroke="currentColor" opacity={0.5} style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#10b981" radius={[8, 8, 0, 0]} name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" radius={[8, 8, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Transações Recentes</h3>
            <p className="text-sm text-muted-foreground">Últimas movimentações</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-[12px] border-sidebar-border"
          >
            Ver todas
          </Button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-4 rounded-[16px] bg-accent/50 hover:bg-accent transition-colors backdrop-blur-xl"
            >
              <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${
                transaction.type === TransactionType.INCOME
                  ? 'bg-success/10'
                  : 'bg-destructive/10'
              }`}>
                {transaction.type === TransactionType.INCOME ? (
                  <ArrowUpRight className="w-6 h-6 text-success" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.category}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === TransactionType.INCOME
                    ? 'text-success'
                    : 'text-destructive'
                }`}>
                  {transaction.type === TransactionType.INCOME ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}