import { TransactionType } from '../types/transaction-types';
import { notificationService } from './notifications';
import { NotificationType, NotificationPriority } from '../types/notification';

// Mock data for demonstration
const mockUser = {
  id: '1',
  name: 'Usuário Demo',
  email: 'demo@finfacil.com'
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000,
    type: TransactionType.INCOME,
    category: 'Salário',
    date: '2026-02-01',
    account_id: '1',
    account_name: 'Conta Corrente'
  },
  {
    id: '2',
    description: 'Mercado',
    amount: 450,
    type: TransactionType.EXPENSE,
    category: 'Alimentação',
    date: '2026-01-30',
    account_id: '1',
    account_name: 'Conta Corrente'
  }
];

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Conta Corrente',
    type: 'CHECKING',
    balance: 4550,
    bank_name: 'Banco Exemplo',
    is_active: true
  },
  {
    id: '2',
    name: 'Cartão de Crédito',
    type: 'CREDIT_CARD',
    balance: -1200,
    bank_name: 'Banco Exemplo',
    credit_limit: 5000,
    is_active: true
  }
];

const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Tesouro Direto',
    type: 'FIXED_INCOME',
    quantity: 10,
    purchase_price: 1000,
    current_price: 1050,
    total_value: 10000,
    current_value: 10500,
    purchase_date: '2025-01-01',
    date: '2026-02-01'
  }
];

// Types
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  account_id: string;
  account_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'WALLET' | 'CHECKING' | 'CREDIT_CARD' | 'SAVINGS' | 'INVESTMENT';
  balance: number;
  bank_name?: string;
  last4_digits?: string;
  credit_limit?: number;
  due_date?: number;
  closing_date?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  total_value: number;
  current_value: number;
  purchase_date: string;
  date: string;
  expected_return?: number;
}

export interface DashboardStats {
  total_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  investments: number;
  net_worth: number;
  balance_change_percent?: number;
  income_change_percent?: number;
  expenses_change_percent?: number;
  investments_change_percent?: number;
}

class ApiService {
  // Authentication
  async login(email: string, password: string): Promise<{ access_token: string; user: any; message: string }> {
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      access_token: 'mock-token',
      user: mockUser,
      message: 'Login realizado com sucesso!'
    };
  }

  async register(email: string, password: string, name: string): Promise<{ access_token: string; user: any; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      access_token: 'mock-token',
      user: { ...mockUser, name },
      message: 'Conta criada com sucesso!'
    };
  }

  async loginWithGoogle(): Promise<{ access_token: string; user: any; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      access_token: 'mock-token',
      user: mockUser,
      message: 'Login com Google realizado com sucesso!'
    };
  }

  async getCurrentUser(): Promise<any> {
    return mockUser;
  }

  async updateUserProfile(userData: any): Promise<any> {
    return { ...mockUser, ...userData };
  }

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const stored = localStorage.getItem('finfacil_transactions');
    return stored ? JSON.parse(stored) : mockTransactions;
  }

  async createTransaction(transaction: any): Promise<any> {
    const transactions = await this.getTransactions();
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      created_at: new Date().toISOString()
    };
    transactions.push(newTransaction);
    localStorage.setItem('finfacil_transactions', JSON.stringify(transactions));
    
    // Create notification for new transaction
    notificationService.create({
      type: NotificationType.TRANSACTION,
      priority: transaction.amount > 1000 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
      title: transaction.type === TransactionType.INCOME ? 'Nova Receita Registrada' : 'Nova Despesa Registrada',
      message: `${transaction.type === TransactionType.INCOME ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em ${transaction.category} foi registrada.`,
      read: false,
      actionUrl: '/dashboard/transactions',
      metadata: {
        transactionId: newTransaction.id,
        amount: transaction.amount
      }
    });
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('transaction:created'));
    
    return { message: 'Transação criada com sucesso!', ...newTransaction };
  }

  async updateTransaction(id: string, transaction: any): Promise<any> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...transaction };
      localStorage.setItem('finfacil_transactions', JSON.stringify(transactions));
    }
    return { message: 'Transação atualizada!', ...transactions[index] };
  }

  async deleteTransaction(id: string): Promise<{ message: string }> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    localStorage.setItem('finfacil_transactions', JSON.stringify(filtered));
    return { message: 'Transação excluída!' };
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const stored = localStorage.getItem('finfacil_accounts');
    return stored ? JSON.parse(stored) : mockAccounts;
  }

  async createAccount(account: any): Promise<any> {
    const accounts = await this.getAccounts();
    const newAccount = {
      id: Date.now().toString(),
      ...account,
      is_active: true,
      created_at: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem('finfacil_accounts', JSON.stringify(accounts));
    return { message: 'Conta criada com sucesso!', ...newAccount };
  }

  async updateAccount(id: string, account: any): Promise<any> {
    const accounts = await this.getAccounts();
    const index = accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...account };
      localStorage.setItem('finfacil_accounts', JSON.stringify(accounts));
    }
    return { message: 'Conta atualizada!', ...accounts[index] };
  }

  async deleteAccount(id: string): Promise<{ message: string }> {
    const accounts = await this.getAccounts();
    const filtered = accounts.filter(a => a.id !== id);
    localStorage.setItem('finfacil_accounts', JSON.stringify(filtered));
    return { message: 'Conta excluída!' };
  }

  // Investments
  async getInvestments(): Promise<Investment[]> {
    const stored = localStorage.getItem('finfacil_investments');
    return stored ? JSON.parse(stored) : mockInvestments;
  }

  async createInvestment(investment: any): Promise<any> {
    const investments = await this.getInvestments();
    const newInvestment = {
      id: Date.now().toString(),
      ...investment,
      created_at: new Date().toISOString()
    };
    investments.push(newInvestment);
    localStorage.setItem('finfacil_investments', JSON.stringify(investments));
    return { message: 'Investimento criado!', ...newInvestment };
  }

  async updateInvestment(id: string, investment: any): Promise<any> {
    const investments = await this.getInvestments();
    const index = investments.findIndex(i => i.id === id);
    if (index !== -1) {
      investments[index] = { ...investments[index], ...investment };
      localStorage.setItem('finfacil_investments', JSON.stringify(investments));
    }
    return { message: 'Investimento atualizado!', ...investments[index] };
  }

  async deleteInvestment(id: string): Promise<{ message: string }> {
    const investments = await this.getInvestments();
    const filtered = investments.filter(i => i.id !== id);
    localStorage.setItem('finfacil_investments', JSON.stringify(filtered));
    return { message: 'Investimento excluído!' };
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const transactions = await this.getTransactions();
    const accounts = await this.getAccounts();
    const investments = await this.getInvestments();

    const monthlyIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const investmentsTotal = investments.reduce((sum, inv) => sum + inv.current_value, 0);

    return {
      total_balance: totalBalance,
      monthly_income: monthlyIncome,
      monthly_expenses: monthlyExpenses,
      investments: investmentsTotal,
      net_worth: totalBalance + investmentsTotal,
      balance_change_percent: 5.2,
      income_change_percent: 8.5,
      expenses_change_percent: -3.2,
      investments_change_percent: 12.8
    };
  }

  async getRecorrentes(): Promise<any[]> {
    const stored = localStorage.getItem('finfacil_recorrentes');
    return stored ? JSON.parse(stored) : [];
  }

  async createRecorrente(recorrente: any): Promise<any> {
    const recorrentes = await this.getRecorrentes();
    const newRecorrente = {
      id: Date.now().toString(),
      ...recorrente,
      is_active: true,
      created_at: new Date().toISOString()
    };
    recorrentes.push(newRecorrente);
    localStorage.setItem('finfacil_recorrentes', JSON.stringify(recorrentes));
    return { message: 'Recorrente criado!', ...newRecorrente };
  }

  async updateRecorrente(id: string, recorrente: any): Promise<any> {
    const recorrentes = await this.getRecorrentes();
    const index = recorrentes.findIndex(r => r.id === id);
    if (index !== -1) {
      recorrentes[index] = { ...recorrentes[index], ...recorrente };
      localStorage.setItem('finfacil_recorrentes', JSON.stringify(recorrentes));
    }
    return { message: 'Recorrente atualizado!', ...recorrentes[index] };
  }
}

export const apiService = new ApiService();
export default apiService;