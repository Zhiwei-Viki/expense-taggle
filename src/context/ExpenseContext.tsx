import React, { createContext, useContext, useState } from "react";
import { Expense, ExpenseFormData } from "@/types/expense";
import { v4 as uuidv4 } from "@/lib/uuid";
import { toast } from "sonner";
import { mockExpenses } from "@/data/mockExpenses";

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: ExpenseFormData) => void;
  updateExpense: (id: string, expense: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  getExpense: (id: string) => Expense | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const addExpense = (expenseData: ExpenseFormData) => {
    const newExpense = {
      ...expenseData,
      id: uuidv4(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
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