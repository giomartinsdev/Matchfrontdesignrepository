// Transaction type enums for consistent usage across the application

export enum TransactionType {
  INCOME = 'entrada',
  EXPENSE = 'saida'
}

export enum TransactionTypeDisplay {
  INCOME = 'Entrada',
  EXPENSE = 'Saída'
}

export enum TransactionTypeUI {
  INCOME = 'income',
  EXPENSE = 'expense'
}

// Helper functions for type conversion
export const getTransactionTypeDisplay = (type: TransactionType): TransactionTypeDisplay => {
  return type === TransactionType.INCOME ? TransactionTypeDisplay.INCOME : TransactionTypeDisplay.EXPENSE;
};

export const getTransactionTypeUI = (type: TransactionType): TransactionTypeUI => {
  return type === TransactionType.INCOME ? TransactionTypeUI.INCOME : TransactionTypeUI.EXPENSE;
};

export const getTransactionTypeFromUI = (uiType: TransactionTypeUI): TransactionType => {
  return uiType === TransactionTypeUI.INCOME ? TransactionType.INCOME : TransactionType.EXPENSE;
};

export const isIncome = (type: TransactionType): boolean => {
  return type === TransactionType.INCOME;
};

export const isExpense = (type: TransactionType): boolean => {
  return type === TransactionType.EXPENSE;
};
