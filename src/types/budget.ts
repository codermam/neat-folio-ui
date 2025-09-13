export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: Date;
  recurring?: boolean;
  frequency?: 'weekly' | 'monthly';
}

export interface BudgetGoal {
  id: string;
  category: string;
  limit: number;
  month: string;
}

export interface TransactionFilters {
  category?: string;
  dateStart?: string;
  dateEnd?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: 'category-food' },
  { id: 'transport', name: 'Transportation', color: 'category-transport' },
  { id: 'entertainment', name: 'Entertainment', color: 'category-entertainment' },
  { id: 'shopping', name: 'Shopping', color: 'category-shopping' },
  { id: 'utilities', name: 'Utilities', color: 'category-utilities' },
  { id: 'healthcare', name: 'Healthcare', color: 'category-healthcare' },
  { id: 'education', name: 'Education', color: 'category-education' },
  { id: 'other', name: 'Other', color: 'category-other' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: 'category-utilities' },
  { id: 'freelance', name: 'Freelance', color: 'category-education' },
  { id: 'investment', name: 'Investment', color: 'category-entertainment' },
  { id: 'other', name: 'Other Income', color: 'category-other' },
];