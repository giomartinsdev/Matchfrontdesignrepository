import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Wallet, CreditCard } from 'lucide-react';
import { apiService, type Account } from '../../services/api';

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const data = await apiService.getAccounts();
    setAccounts(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Contas</h2>
          <p className="text-slate-600 dark:text-slate-400">Gerencie suas contas bancárias</p>
        </div>
        <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {account.type === 'CREDIT_CARD' ? (
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{account.name}</h3>
                <p className="text-sm text-slate-500">{account.bank_name || 'Banco'}</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            {account.type === 'CREDIT_CARD' && account.credit_limit && (
              <div className="mt-2 text-sm text-slate-500">
                Limite: R$ {account.credit_limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
