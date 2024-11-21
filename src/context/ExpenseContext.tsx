import React, { createContext, useContext, useState } from "react";
import { Expense, ExpenseFormData } from "@/types/expense";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";

// Mock data with common expense categories
const mockExpenses: Expense[] = [
  {
    id: uuidv4(),
    amount: 1200,
    description: "Monthly Rent",
    date: "2024-02-01",
    tags: ["Housing", "Monthly Bills"],
  },
  {
    id: uuidv4(),
    amount: 85.50,
    description: "Grocery Shopping",
    date: "2024-02-15",
    tags: ["Food", "Groceries"],
  },
  {
    id: uuidv4(),
    amount: 45.99,
    description: "Netflix Subscription",
    date: "2024-02-10",
    tags: ["Entertainment", "Subscriptions"],
  },
  {
    id: uuidv4(),
    amount: 35.00,
    description: "Gas Station",
    date: "2024-02-14",
    tags: ["Transportation", "Car"],
  },
  {
    id: uuidv4(),
    amount: 120.00,
    description: "Electric Bill",
    date: "2024-02-05",
    tags: ["Utilities", "Monthly Bills"],
  },
  {
    id: uuidv4(),
    amount: 60.00,
    description: "Dinner with Friends",
    date: "2024-02-13",
    tags: ["Food", "Entertainment", "Social"],
  },
];

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: ExpenseFormData) => void;
  updateExpense: (id: string, expense: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  getExpense: (id: string) => Expense | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses); // Initialize with mock data

  const addExpense = (expenseData: ExpenseFormData) => {
    const newExpense = {
      ...expenseData,
      id: uuidv4(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    toast.success("Expense added successfully");
  };

  const updateExpense = (id: string, expenseData: ExpenseFormData) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expenseData, id } : expense
      )
    );
    toast.success("Expense updated successfully");
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  const getExpense = (id: string) => {
    return expenses.find((expense) => expense.id === id);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};