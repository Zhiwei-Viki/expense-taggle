import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseCard } from "./ExpenseCard";
import { ExpenseForm } from "./ExpenseForm";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const ExpenseList = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const allTags = Array.from(
    new Set(expenses.flatMap((expense) => expense.tags))
  );

  const filteredExpenses = expenses
    .filter((expense) =>
      selectedTag ? expense.tags.includes(selectedTag) : true
    )
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const isAfterStart = startDate ? expenseDate >= startDate : true;
      const isBeforeEnd = endDate
        ? expenseDate <= new Date(endDate.setHours(23, 59, 59, 999))
        : true;
      return isAfterStart && isBeforeEnd;
    });

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

      <div className="flex gap-4 flex-wrap items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {startDate || endDate ? (
          <Button
            variant="ghost"
            className="h-8 px-2"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Reset dates
          </Button>
        ) : null}
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