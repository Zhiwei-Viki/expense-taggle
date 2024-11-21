import { Expense } from "@/types/expense";
import { v4 as uuidv4 } from "@/lib/uuid";
import { subMonths, format, startOfDay, endOfDay } from "date-fns";

const categories = [
  ["Housing", "Monthly Bills"],
  ["Food", "Groceries"],
  ["Entertainment", "Subscriptions"],
  ["Transportation", "Car"],
  ["Utilities", "Monthly Bills"],
  ["Food", "Entertainment", "Social"],
  ["Healthcare", "Medical"],
  ["Shopping", "Personal"],
  ["Education", "Books"],
  ["Travel", "Leisure"],
];

const descriptions = [
  "Monthly Rent",
  "Grocery Shopping",
  "Netflix Subscription",
  "Gas Station",
  "Electric Bill",
  "Dinner with Friends",
  "Doctor's Appointment",
  "Shopping Mall",
  "Online Course",
  "Weekend Trip",
  "Water Bill",
  "Internet Bill",
  "Phone Bill",
  "Car Insurance",
  "Home Insurance",
];

export const generateMockExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const now = new Date();

  // Generate 1000 expenses spread over the last 12 months
  for (let i = 0; i < 1000; i++) {
    const randomMonthsAgo = Math.floor(Math.random() * 12);
    const date = subMonths(now, randomMonthsAgo);
    
    // Random amount between 10 and 2000
    const amount = Math.round((Math.random() * 1990 + 10) * 100) / 100;
    
    // Random category and description
    const tags = categories[Math.floor(Math.random() * categories.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    expenses.push({
      id: uuidv4(),
      amount,
      description,
      date: format(date, 'yyyy-MM-dd'),
      tags,
    });
  }

  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockExpenses = generateMockExpenses();