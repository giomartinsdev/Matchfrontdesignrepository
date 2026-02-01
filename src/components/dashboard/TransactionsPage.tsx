import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { apiService, type Transaction } from '../../services/api';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await apiService.getTransactions();
    setTransactions(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Transações</h2>
          <p className="text-slate-600 dark:text-slate-400">Gerencie suas transações financeiras</p>
        </div>
        <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              Nenhuma transação encontrada
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{transaction.description}</h4>
                  <p className="text-sm text-slate-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className={`text-lg font-semibold ${transaction.type === 'entrada' ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.type === 'entrada' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
