import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  X,
  Clock,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  History
} from 'lucide-react';
import { goalsService } from '../../services/goals';
import { Goal, GoalType, GoalStatus, GoalTransaction } from '../../types/goals';
import { toast } from 'sonner@2.0.3';

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTransactionsListModal, setShowTransactionsListModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  useEffect(() => {
    loadData();
    
    // Listen for transaction events
    const handleTransactionAdded = () => loadData();
    const handleTransactionRemoved = () => loadData();
    
    window.addEventListener('goal:transaction-added', handleTransactionAdded);
    window.addEventListener('goal:transaction-removed', handleTransactionRemoved);
    
    return () => {
      window.removeEventListener('goal:transaction-added', handleTransactionAdded);
      window.removeEventListener('goal:transaction-removed', handleTransactionRemoved);
    };
  }, []);

  const loadData = () => {
    setGoals(goalsService.getAll());
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.status === GoalStatus.IN_PROGRESS || goal.status === GoalStatus.AT_RISK;
    if (filter === 'completed') return goal.status === GoalStatus.COMPLETED;
    return true;
  });

  const getGoalTypeLabel = (type: GoalType): string => {
    const labels = {
      [GoalType.SAVINGS]: 'Economia',
      [GoalType.EXPENSE_LIMIT]: 'Limite de Gastos',
      [GoalType.INCOME_TARGET]: 'Meta de Receita',
      [GoalType.INVESTMENT]: 'Investimento',
      [GoalType.DEBT_PAYMENT]: 'Pagamento de Dívida'
    };
    return labels[type];
  };

  const getGoalTypeColor = (type: GoalType): string => {
    const colors = {
      [GoalType.SAVINGS]: 'bg-primary/10 text-primary',
      [GoalType.EXPENSE_LIMIT]: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      [GoalType.INCOME_TARGET]: 'bg-success/10 text-success',
      [GoalType.INVESTMENT]: 'bg-primary/10 text-primary',
      [GoalType.DEBT_PAYMENT]: 'bg-destructive/10 text-destructive'
    };
    return colors[type];
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-success" />;
      case GoalStatus.AT_RISK:
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case GoalStatus.IN_PROGRESS:
        return <Target className="w-4 h-4 text-primary" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getProgressStatus = (progress: any, goal: Goal) => {
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const isOverdue = now > targetDate && goal.status !== GoalStatus.COMPLETED;

    if (progress.percentage >= 100) {
      return {
        label: 'Meta Atingida',
        icon: <CheckCircle className="w-4 h-4" />,
        barColor: 'bg-success',
        textColor: 'text-success',
        difference: 0,
        showDifference: false,
        isOverdue: false
      };
    }

    const startDate = new Date(goal.startDate);
    const totalDuration = targetDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    const expectedPercentage = (elapsedDuration / totalDuration) * 100;
    const difference = progress.percentage - expectedPercentage;
    
    if (difference > 5) {
      return {
        label: 'Adiantado',
        icon: <TrendingUp className="w-4 h-4" />,
        barColor: 'bg-success',
        textColor: 'text-success',
        difference: difference,
        showDifference: true,
        isOverdue: isOverdue
      };
    }
    
    if (difference < -5) {
      return {
        label: 'Atrasado',
        icon: <TrendingDown className="w-4 h-4" />,
        barColor: 'bg-destructive',
        textColor: 'text-destructive',
        difference: Math.abs(difference),
        showDifference: true,
        isOverdue: isOverdue
      };
    }
    
    return {
      label: 'No Ritmo',
      icon: <Clock className="w-4 h-4" />,
      barColor: 'bg-primary',
      textColor: 'text-primary',
      difference: 0,
      showDifference: false,
      isOverdue: isOverdue
    };
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Metas Financeiras</h2>
          <p className="text-muted-foreground">Acompanhe suas metas através de pots com transações</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (confirm('Resetar dados mockados? Isso irá recarregar a página.')) {
                goalsService.resetMockData();
              }
            }}
            variant="outline"
            className="rounded-[14px]"
            size="sm"
          >
            🔄 Reset Mock Data
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="rounded-[14px] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'active', label: 'Ativas', count: goals.filter(g => g.status === GoalStatus.IN_PROGRESS || g.status === GoalStatus.AT_RISK).length },
          { value: 'completed', label: 'Concluídas', count: goals.filter(g => g.status === GoalStatus.COMPLETED).length },
          { value: 'all', label: 'Todas', count: goals.length }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium transition-colors whitespace-nowrap ${
              filter === tab.value
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredGoals.map((goal) => {
          const progress = goalsService.getProgress(goal.id);
          const potSummary = goalsService.getPotSummary(goal.id);
          if (!progress) return null;

          const status = getProgressStatus(progress, goal);
          const progressPercentage = Math.min(progress.percentage, 100);

          return (
            <Card
              key={goal.id}
              className="p-5 md:p-6 rounded-[20px] border-sidebar-border bg-card backdrop-blur-xl hover:bg-card/80 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 ${getGoalTypeColor(goal.type)}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(goal.status)}
                      <h3 className="font-bold text-foreground truncate">{goal.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedGoal(goal)}
                    className="w-8 h-8 rounded-full"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Deseja realmente deletar esta meta?')) {
                        goalsService.delete(goal.id);
                        loadData();
                        toast.success('Meta deletada com sucesso!');
                      }
                    }}
                    className="w-8 h-8 rounded-full text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Pot Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-[14px] bg-sidebar-accent">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowUpCircle className="w-3 h-3 text-success" />
                    Entradas
                  </p>
                  <p className="text-sm font-bold text-success">
                    R$ {potSummary.moneyIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <ArrowDownCircle className="w-3 h-3 text-destructive" />
                    Saídas
                  </p>
                  <p className="text-sm font-bold text-destructive">
                    R$ {potSummary.moneyOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              {goal.status !== GoalStatus.COMPLETED ? (
                <div className="mb-4">
                  {status.isOverdue && (
                    <div className="mb-3 p-3 rounded-[14px] bg-destructive text-destructive-foreground flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Prazo Vencido!</p>
                        <p className="text-xs opacity-90">Esta meta ultrapassou o prazo limite</p>
                      </div>
                    </div>
                  )}

                  {status.showDifference && (
                    <div className={`flex items-center gap-1.5 mb-3 ${status.textColor}`}>
                      {status.icon}
                      <span className="text-sm font-semibold">
                        {status.label} {status.difference.toFixed(0)}%
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-semibold text-foreground">
                      {progress.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${status.barColor}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-[16px] bg-success text-success-foreground shadow-sm flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-bold">Meta Concluída!</span>
                </div>
              )}

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Saldo Atual</p>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    R$ {potSummary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Meta</p>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Info Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1.5 rounded-full bg-sidebar-accent text-xs font-medium text-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {progress.daysRemaining} dias restantes
                </div>
                <div className="px-3 py-1.5 rounded-full bg-sidebar-accent text-xs font-medium text-foreground">
                  {getGoalTypeLabel(goal.type)}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-sidebar-accent text-xs font-medium text-foreground flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  {potSummary.transactionCount} transações
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-sidebar-border">
                <Button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowTransactionModal(true);
                  }}
                  className="flex-1 rounded-[14px]"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Transação
                </Button>
                <Button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowTransactionsListModal(true);
                  }}
                  variant="outline"
                  className="flex-1 rounded-[14px] border-sidebar-border"
                  size="sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver Histórico
                </Button>
              </div>

              {/* Quick Stats */}
              {goal.status !== GoalStatus.COMPLETED && (
                <div className="pt-4 border-t border-sidebar-border mt-4">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Para atingir a meta:
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Diário</p>
                      <p className="text-sm font-bold text-foreground">
                        R$ {progress.dailyTarget.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Semanal</p>
                      <p className="text-sm font-bold text-foreground">
                        R$ {progress.weeklyTarget.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mensal</p>
                      <p className="text-sm font-bold text-foreground">
                        R$ {progress.monthlyTarget.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma meta encontrada</h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'active' ? 'Você não tem metas ativas no momento.' : 'Crie sua primeira meta financeira!'}
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="rounded-[14px]">
            <Plus className="w-4 h-4 mr-2" />
            Criar Meta
          </Button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && !selectedGoal && (
        <GoalFormModal
          goal={null}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            loadData();
            setShowCreateModal(false);
          }}
        />
      )}

      {selectedGoal && !showTransactionModal && !showTransactionsListModal && (
        <GoalFormModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onSave={() => {
            loadData();
            setSelectedGoal(null);
          }}
        />
      )}

      {showTransactionModal && selectedGoal && (
        <AddTransactionModal
          goal={selectedGoal}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedGoal(null);
          }}
          onSave={() => {
            loadData();
            setShowTransactionModal(false);
            setSelectedGoal(null);
          }}
        />
      )}

      {showTransactionsListModal && selectedGoal && (
        <TransactionsListModal
          goal={selectedGoal}
          onClose={() => {
            setShowTransactionsListModal(false);
            setSelectedGoal(null);
          }}
          onUpdate={() => loadData()}
        />
      )}
    </div>
  );
}

// Goal Form Modal
function GoalFormModal({
  goal,
  onClose,
  onSave
}: {
  goal: Goal | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    description: goal?.description || '',
    type: goal?.type || GoalType.SAVINGS,
    targetAmount: goal?.targetAmount || 0,
    targetDate: goal?.targetDate.split('T')[0] || '',
    category: goal?.category || '',
    isRecurring: goal?.isRecurring || false,
    recurringPeriod: goal?.recurringPeriod || 'monthly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (goal) {
      goalsService.update(goal.id, formData as any);
      toast.success('Meta atualizada com sucesso!');
    } else {
      goalsService.create({
        ...formData,
        status: GoalStatus.NOT_STARTED,
        startDate: new Date().toISOString()
      } as any);
      toast.success('Meta criada com sucesso!');
    }

    onSave();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="w-full max-w-2xl my-8 p-5 md:p-6 rounded-[20px] shadow-2xl backdrop-blur-xl border-sidebar-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {goal ? 'Editar Meta' : 'Nova Meta'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Meta</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Reserva de Emergência"
                required
                className="rounded-[14px] border-sidebar-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva sua meta"
                className="rounded-[14px] border-sidebar-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as GoalType })}
                  className="w-full px-3 py-2 rounded-[14px] border border-sidebar-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value={GoalType.SAVINGS}>Economia</option>
                  <option value={GoalType.EXPENSE_LIMIT}>Limite de Gastos</option>
                  <option value={GoalType.INCOME_TARGET}>Meta de Receita</option>
                  <option value={GoalType.INVESTMENT}>Investimento</option>
                  <option value={GoalType.DEBT_PAYMENT}>Pagamento de Dívida</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Valor Meta (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                  className="rounded-[14px] border-sidebar-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Data Limite</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
                className="rounded-[14px] border-sidebar-border"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-[14px] border-sidebar-border">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 rounded-[14px]">
                {goal ? 'Atualizar' : 'Criar'} Meta
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

// Add Transaction Modal
function AddTransactionModal({
  goal,
  onClose,
  onSave
}: {
  goal: Goal;
  onClose: () => void;
  onSave: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Valor inválido!');
      return;
    }

    goalsService.addTransaction(goal.id, amountValue, type, description);
    toast.success(`Transação adicionada com sucesso!`);
    onSave();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-5 md:p-6 rounded-[20px] shadow-2xl backdrop-blur-xl border-sidebar-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Adicionar Transação</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4 p-3 rounded-[14px] bg-sidebar-accent">
            <p className="text-sm text-muted-foreground mb-1">Meta:</p>
            <p className="font-bold text-foreground">{goal.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Transação</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`p-3 rounded-[14px] border-2 transition-all ${
                    type === 'income'
                      ? 'border-success bg-success/10 text-success'
                      : 'border-sidebar-border bg-muted text-muted-foreground'
                  }`}
                >
                  <ArrowUpCircle className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Entrada</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`p-3 rounded-[14px] border-2 transition-all ${
                    type === 'expense'
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-sidebar-border bg-muted text-muted-foreground'
                  }`}
                >
                  <ArrowDownCircle className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Saída</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="rounded-[14px] border-sidebar-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Aporte mensal"
                required
                className="rounded-[14px] border-sidebar-border"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-[14px] border-sidebar-border">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 rounded-[14px]">
                Adicionar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

// Transactions List Modal
function TransactionsListModal({
  goal,
  onClose,
  onUpdate
}: {
  goal: Goal;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);

  useEffect(() => {
    setTransactions(goalsService.getGoalTransactions(goal.id));
  }, [goal.id]);

  const handleDelete = (transactionId: string) => {
    if (confirm('Deseja realmente remover esta transação?')) {
      goalsService.removeTransaction(transactionId);
      setTransactions(goalsService.getGoalTransactions(goal.id));
      onUpdate();
      toast.success('Transação removida com sucesso!');
    }
  };

  const potSummary = goalsService.getPotSummary(goal.id);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <Card className="w-full max-w-3xl my-8 p-5 md:p-6 rounded-[20px] shadow-2xl backdrop-blur-xl border-sidebar-border bg-card max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{goal.name}</h2>
              <p className="text-sm text-muted-foreground">Histórico de Transações</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-[14px] bg-sidebar-accent">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Entradas</p>
              <p className="text-lg font-bold text-success">
                R$ {potSummary.moneyIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Saídas</p>
              <p className="text-lg font-bold text-destructive">
                R$ {potSummary.moneyOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Saldo</p>
              <p className="text-lg font-bold text-foreground">
                R$ {potSummary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma transação registrada</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-[14px] border border-sidebar-border bg-card hover:bg-sidebar-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-bold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="w-8 h-8 rounded-full text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-sidebar-border">
            <Button onClick={onClose} className="w-full rounded-[14px]">
              Fechar
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}