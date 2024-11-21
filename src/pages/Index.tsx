import { useState } from "react";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { ExpenseList } from "@/components/ExpenseList";

const Index = () => {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Budget Tracker</h1>
          <ExpenseList />
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default Index;