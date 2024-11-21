export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  tags: string[];
}

export type ExpenseFormData = Omit<Expense, "id">;