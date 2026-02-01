import { Goal, GoalType, GoalStatus, Prediction, GoalProgress, AIInsight, GoalTransaction, GoalPotSummary } from '../types/goals';
import { notificationService } from './notifications';
import { NotificationType, NotificationPriority } from '../types/notification';

const STORAGE_KEY = 'finfacil_goals';
const TRANSACTIONS_STORAGE_KEY = 'finfacil_goal_transactions';

class GoalsService {
  private goals: Goal[] = [];
  private transactions: GoalTransaction[] = [];

  constructor() {
    this.loadFromStorage();
    this.initializeMockGoals();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.goals = JSON.parse(stored);
        console.log(`[DEBUG] Loaded ${this.goals.length} goals from storage`);
        // Garantir que todas as metas tenham linkedTransactionIds
        this.goals.forEach(goal => {
          if (!goal.linkedTransactionIds) {
            goal.linkedTransactionIds = [];
          }
        });
      }
      const storedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (storedTransactions) {
        this.transactions = JSON.parse(storedTransactions);
        console.log(`[DEBUG] Loaded ${this.transactions.length} transactions from storage`);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.goals));
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  private initializeMockGoals() {
    if (this.goals.length === 0) {
      console.log('[DEBUG] Initializing mock goals and transactions...');
      
      const mockGoals: Goal[] = [
        {
          id: '1',
          name: 'Reserva de Emergência',
          description: 'Economizar 6 meses de despesas para emergências',
          type: GoalType.SAVINGS,
          status: GoalStatus.IN_PROGRESS,
          targetAmount: 30000,
          currentAmount: 0,
          startDate: '2026-01-01',
          targetDate: '2026-12-31',
          isRecurring: false,
          linkedTransactionIds: [],
          createdAt: new Date('2026-01-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Limite de Alimentação',
          description: 'Manter gastos com alimentação abaixo de R$ 1.000/mês',
          type: GoalType.EXPENSE_LIMIT,
          status: GoalStatus.AT_RISK,
          targetAmount: 1000,
          currentAmount: 0,
          startDate: '2025-10-01',
          targetDate: '2026-01-15',
          category: 'Alimentação',
          isRecurring: true,
          recurringPeriod: 'monthly',
          linkedTransactionIds: [],
          createdAt: new Date('2025-10-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Investir em Ações',
          description: 'Aportar R$ 1.000 mensalmente em ações',
          type: GoalType.INVESTMENT,
          status: GoalStatus.IN_PROGRESS,
          targetAmount: 12000,
          currentAmount: 0,
          startDate: '2025-08-01',
          targetDate: '2026-08-01',
          isRecurring: true,
          recurringPeriod: 'monthly',
          linkedTransactionIds: [],
          createdAt: new Date('2025-08-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Viagem para Europa',
          description: 'Economizar para viagem em julho',
          type: GoalType.SAVINGS,
          status: GoalStatus.IN_PROGRESS,
          targetAmount: 15000,
          currentAmount: 0,
          startDate: '2026-01-01',
          targetDate: '2026-07-01',
          isRecurring: false,
          linkedTransactionIds: [],
          createdAt: new Date('2026-01-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Quitar Cartão de Crédito',
          description: 'Pagar toda a fatura do cartão',
          type: GoalType.DEBT_PAYMENT,
          status: GoalStatus.COMPLETED,
          targetAmount: 5000,
          currentAmount: 0,
          startDate: '2025-12-01',
          targetDate: '2026-01-31',
          isRecurring: false,
          linkedTransactionIds: [],
          createdAt: new Date('2025-12-01').toISOString(),
          updatedAt: new Date('2026-01-31').toISOString()
        }
      ];

      // Criar transações mockadas
      const mockTransactions: GoalTransaction[] = [
        // Meta 1 - Reserva de Emergência (ADIANTADO)
        { id: 't1-1', goalId: '1', amount: 5000, type: 'income', description: 'Aporte inicial', date: '2026-01-05', createdAt: new Date('2026-01-05').toISOString() },
        { id: 't1-2', goalId: '1', amount: 8000, type: 'income', description: 'Bônus do trabalho', date: '2026-01-15', createdAt: new Date('2026-01-15').toISOString() },
        { id: 't1-3', goalId: '1', amount: 4000, type: 'income', description: 'Economia do mês', date: '2026-01-25', createdAt: new Date('2026-01-25').toISOString() },
        { id: 't1-4', goalId: '1', amount: 4000, type: 'income', description: 'Freela extra', date: '2026-01-28', createdAt: new Date('2026-01-28').toISOString() },
        
        // Meta 2 - Limite de Alimentação (ATRASADO E VENCIDO)
        { id: 't2-1', goalId: '2', amount: 300, type: 'income', description: 'Orçamento mensal', date: '2025-12-01', createdAt: new Date('2025-12-01').toISOString() },
        { id: 't2-2', goalId: '2', amount: 150, type: 'income', description: 'Orçamento mensal', date: '2026-01-01', createdAt: new Date('2026-01-01').toISOString() },
        
        // Meta 3 - Investir em Ações (NO RITMO)
        { id: 't3-1', goalId: '3', amount: 1000, type: 'income', description: 'Aporte Agosto', date: '2025-08-05', createdAt: new Date('2025-08-05').toISOString() },
        { id: 't3-2', goalId: '3', amount: 1000, type: 'income', description: 'Aporte Setembro', date: '2025-09-05', createdAt: new Date('2025-09-05').toISOString() },
        { id: 't3-3', goalId: '3', amount: 1000, type: 'income', description: 'Aporte Outubro', date: '2025-10-05', createdAt: new Date('2025-10-05').toISOString() },
        { id: 't3-4', goalId: '3', amount: 1000, type: 'income', description: 'Aporte Novembro', date: '2025-11-05', createdAt: new Date('2025-11-05').toISOString() },
        { id: 't3-5', goalId: '3', amount: 1000, type: 'income', description: 'Aporte Dezembro', date: '2025-12-05', createdAt: new Date('2025-12-05').toISOString() },
        { id: 't3-6', goalId: '3', amount: 1200, type: 'income', description: 'Aporte Janeiro', date: '2026-01-05', createdAt: new Date('2026-01-05').toISOString() },
        
        // Meta 4 - Viagem para Europa (ADIANTADO)
        { id: 't4-1', goalId: '4', amount: 7000, type: 'income', description: '13º salário', date: '2026-01-10', createdAt: new Date('2026-01-10').toISOString() },
        { id: 't4-2', goalId: '4', amount: 5750, type: 'income', description: 'Economia mensal', date: '2026-01-20', createdAt: new Date('2026-01-20').toISOString() },
        
        // Meta 5 - Cartão de Crédito (CONCLUÍDA)
        { id: 't5-1', goalId: '5', amount: 5000, type: 'income', description: 'Pagamento total', date: '2026-01-31', createdAt: new Date('2026-01-31').toISOString() },
      ];

      // Vincular transações às metas ANTES de salvar
      mockTransactions.forEach(transaction => {
        const goal = mockGoals.find(g => g.id === transaction.goalId);
        if (goal && !goal.linkedTransactionIds.includes(transaction.id)) {
          goal.linkedTransactionIds.push(transaction.id);
        }
      });

      this.goals = mockGoals;
      this.transactions = mockTransactions;
      this.saveToStorage();
    }
  }

  // Método público para resetar dados mockados
  resetMockData() {
    console.log('[DEBUG] Resetting mock data...');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    this.goals = [];
    this.transactions = [];
    this.initializeMockGoals();
    window.location.reload();
  }

  // Transaction Management
  addTransaction(goalId: string, amount: number, type: 'income' | 'expense', description: string): GoalTransaction | null {
    const goal = this.getById(goalId);
    if (!goal) return null;

    // Garantir que linkedTransactionIds existe
    if (!goal.linkedTransactionIds) {
      goal.linkedTransactionIds = [];
    }

    const transaction: GoalTransaction = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      goalId,
      amount,
      type,
      description,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.transactions.push(transaction);
    
    if (!goal.linkedTransactionIds.includes(transaction.id)) {
      goal.linkedTransactionIds.push(transaction.id);
    }

    // Recalcular currentAmount
    const summary = this.getPotSummary(goalId);
    goal.currentAmount = summary.balance;
    
    // Atualizar status
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = GoalStatus.COMPLETED;
    } else if (goal.currentAmount > 0) {
      goal.status = GoalStatus.IN_PROGRESS;
    }

    goal.updatedAt = new Date().toISOString();
    this.saveToStorage();

    window.dispatchEvent(new CustomEvent('goal:transaction-added', { detail: { goal, transaction } }));
    return transaction;
  }

  removeTransaction(transactionId: string): boolean {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    const goal = this.getById(transaction.goalId);
    if (goal) {
      goal.linkedTransactionIds = goal.linkedTransactionIds.filter(id => id !== transactionId);
      
      // Recalcular currentAmount
      const summary = this.getPotSummary(goal.id);
      goal.currentAmount = summary.balance;
      
      goal.updatedAt = new Date().toISOString();
    }

    this.transactions = this.transactions.filter(t => t.id !== transactionId);
    this.saveToStorage();

    window.dispatchEvent(new CustomEvent('goal:transaction-removed', { detail: { transactionId } }));
    return true;
  }

  getGoalTransactions(goalId: string): GoalTransaction[] {
    return this.transactions
      .filter(t => t.goalId === goalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getPotSummary(goalId: string): GoalPotSummary {
    const transactions = this.getGoalTransactions(goalId);
    
    const moneyIn = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const moneyOut = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = moneyIn - moneyOut;
    
    const lastTransaction = transactions[0];
    
    console.log(`[DEBUG] Goal ${goalId}: moneyIn=${moneyIn}, moneyOut=${moneyOut}, balance=${balance}, transactions=${transactions.length}`);
    
    return {
      goalId,
      moneyIn,
      moneyOut,
      balance,
      transactionCount: transactions.length,
      lastTransactionDate: lastTransaction?.date
    };
  }

  getAll(): Goal[] {
    // Atualizar currentAmount de todas as metas antes de retornar
    this.goals.forEach(goal => {
      const summary = this.getPotSummary(goal.id);
      goal.currentAmount = summary.balance;
    });
    
    return [...this.goals].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Goal | undefined {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    
    const goal = this.goals[index];
    
    // Garantir que linkedTransactionIds existe
    if (!goal.linkedTransactionIds) {
      goal.linkedTransactionIds = [];
    }
    
    const summary = this.getPotSummary(goal.id);
    goal.currentAmount = summary.balance;
    
    return goal;
  }

  getActive(): Goal[] {
    return this.getAll().filter(g => 
      g.status === GoalStatus.IN_PROGRESS || g.status === GoalStatus.AT_RISK
    );
  }

  getByType(type: GoalType): Goal[] {
    return this.getAll().filter(g => g.type === type);
  }

  create(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount' | 'linkedTransactionIds'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currentAmount: 0,
      linkedTransactionIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.goals.push(newGoal);
    this.saveToStorage();

    notificationService.create({
      type: NotificationType.GOAL,
      priority: NotificationPriority.MEDIUM,
      title: 'Nova Meta Criada!',
      message: `Sua meta "${newGoal.name}" foi criada com sucesso. Valor alvo: R$ ${newGoal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      read: false,
      actionUrl: '/dashboard/goals',
      metadata: {
        goalId: newGoal.id,
        amount: newGoal.targetAmount
      }
    });

    window.dispatchEvent(new CustomEvent('goal:created', { detail: newGoal }));
    return newGoal;
  }

  update(id: string, updates: Partial<Goal>): Goal | undefined {
    const index = this.goals.findIndex(g => g.id === id);
    if (index === -1) return undefined;

    this.goals[index] = {
      ...this.goals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();
    window.dispatchEvent(new CustomEvent('goal:updated', { detail: this.goals[index] }));
    return this.goals[index];
  }

  delete(id: string): boolean {
    // Remover todas as transações da meta
    const goalTransactions = this.getGoalTransactions(id);
    goalTransactions.forEach(t => this.removeTransaction(t.id));
    
    const initialLength = this.goals.length;
    this.goals = this.goals.filter(g => g.id !== id);
    
    if (this.goals.length < initialLength) {
      this.saveToStorage();
      window.dispatchEvent(new CustomEvent('goal:deleted', { detail: { id } }));
      return true;
    }
    return false;
  }

  getProgress(goalId: string): GoalProgress | null {
    const goal = this.getById(goalId);
    if (!goal) return null;

    const summary = this.getPotSummary(goalId);
    const currentAmount = summary.balance;

    // Porcentagem baseada no saldo do pot
    const percentage = goal.targetAmount > 0 
      ? Math.min((currentAmount / goal.targetAmount) * 100, 100)
      : 0;
    
    const remainingAmount = Math.max(goal.targetAmount - currentAmount, 0);
    
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.max(
      Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      0
    );

    const dailyTarget = daysRemaining > 0 ? remainingAmount / daysRemaining : 0;
    const weeklyTarget = dailyTarget * 7;
    const monthlyTarget = dailyTarget * 30;

    // Calculate if on track
    const startDate = new Date(goal.startDate);
    const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const expectedPercentage = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
    const onTrack = percentage >= expectedPercentage * 0.9;

    // Projected completion date
    const daysNeeded = dailyTarget > 0 ? remainingAmount / dailyTarget : 0;
    const projectedDate = new Date(now.getTime() + daysNeeded * 24 * 60 * 60 * 1000);

    return {
      goalId,
      percentage,
      remainingAmount,
      daysRemaining,
      dailyTarget,
      weeklyTarget,
      monthlyTarget,
      onTrack,
      projectedCompletionDate: projectedDate.toISOString()
    };
  }

  getPredictions(): Prediction[] {
    return [];
  }

  getAIInsights(): AIInsight[] {
    return [];
  }
}

export const goalsService = new GoalsService();