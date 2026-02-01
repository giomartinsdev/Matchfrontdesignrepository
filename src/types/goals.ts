export enum GoalType {
  SAVINGS = 'savings',
  EXPENSE_LIMIT = 'expense_limit',
  INCOME_TARGET = 'income_target',
  INVESTMENT = 'investment',
  DEBT_PAYMENT = 'debt_payment'
}

export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  AT_RISK = 'at_risk'
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  status: GoalStatus;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  category?: string;
  isRecurring: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  linkedTransactionIds: string[]; // IDs das transações vinculadas a esta meta
  createdAt: string;
  updatedAt: string;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'income' | 'expense'; // income adiciona ao pot, expense remove
  description: string;
  date: string;
  createdAt: string;
}

export interface GoalPotSummary {
  goalId: string;
  moneyIn: number; // Total de entradas
  moneyOut: number; // Total de saídas
  balance: number; // moneyIn - moneyOut
  transactionCount: number;
  lastTransactionDate?: string;
}

export interface Prediction {
  id: string;
  type: 'expense' | 'income' | 'savings' | 'investment';
  title: string;
  description: string;
  predictedAmount: number;
  confidence: number; // 0-100
  basedOn: string;
  targetDate: string;
  category?: string;
  insights: string[];
  recommendations: string[];
}

export interface GoalProgress {
  goalId: string;
  percentage: number;
  remainingAmount: number;
  daysRemaining: number;
  dailyTarget: number;
  weeklyTarget: number;
  monthlyTarget: number;
  onTrack: boolean;
  projectedCompletionDate: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  relatedGoalId?: string;
  createdAt: string;
}