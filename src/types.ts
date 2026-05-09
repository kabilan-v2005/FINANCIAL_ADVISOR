export type TransactionType = 'income' | 'expense';

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  balance?: number;
}

export interface Category {
  name: string;
  amount: number;
  pct?: number;
}

export interface Leak {
  title: string;
  subtitle?: string;
  icon?: string;
  severity?: 'high' | 'medium' | 'low';
  amount: number;
  potentialSave: number;
  tips: string[];
}

export interface BudgetRow {
  category: string;
  icon: string;
  actual: number;
  target: number;
  action: string;
}

export interface WeekPlan {
  week: string;
  title: string;
  desc: string;
}

export interface Goal {
  icon: string;
  title: string;
  desc: string;
  amount: string;
  period: string;
}

export interface FlowPoint {
  date: string;
  income: number;
  expense: number;
}

export interface AIResponse {
  currency: string;
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  healthScore: number;
  healthLabel: string;
  summary: string;
  transactions: Transaction[];
  expenseCategories: Category[];
  incomeSources: Category[];
  dailyFlow: FlowPoint[];
  leaks: Leak[];
  budgetRows: BudgetRow[];
  budgetSavingsRow?: BudgetRow;
  weekPlan: WeekPlan[];
  goals: Goal[];
}
