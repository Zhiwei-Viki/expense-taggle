import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseCard } from "./ExpenseCard";
import { ExpenseForm } from "./ExpenseForm";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export const ExpenseList = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(expenses.flatMap((expense) => expense.tags))
  );

  const filteredExpenses = selectedTag
    ? expenses.filter((expense) => expense.tags.includes(selectedTag))
    : expenses;

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Total: ${totalAmount.toFixed(2)}
          </h2>
          <p className="text-gray-600">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Expense</Button>
      </div>

      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTag === null ? "secondary" : "outline"}
            onClick={() => setSelectedTag(null)}
            size="sm"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "secondary" : "outline"}
              onClick={() => setSelectedTag(tag)}
              size="sm"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {filteredExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={() => setEditingExpense(expense.id)}
            onDelete={() => setDeletingExpense(expense.id)}
          />
        ))}
        {filteredExpenses.length === 0 && (
          <p className="text-center text-gray-500 py-8">No expenses found</p>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={(data) => {
              addExpense(data);
              setIsAddDialogOpen(false);
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingExpense !== null}
        onOpenChange={() => setEditingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialData={expenses.find((e) => e.id === editingExpense)!}
              onSubmit={(data) => {
                updateExpense(editingExpense, data);
                setEditingExpense(null);
              }}
              onCancel={() => setEditingExpense(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingExpense !== null}
        onOpenChange={() => setDeletingExpense(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This expense will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingExpense) {
                  deleteExpense(deletingExpense);
                  setDeletingExpense(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};