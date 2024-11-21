import { useState } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseCard } from "./ExpenseCard";
import { ExpenseForm } from "./ExpenseForm";
import { Button } from "./ui/button";
import { DateFilters } from "./DateFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const ITEMS_PER_PAGE = 20;

export const ExpenseList = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExpenses = filteredExpenses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
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

      <DateFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={() => {
          setStartDate(null);
          setEndDate(null);
        }}
      />

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

      <div className="grid gap-2">
        {paginatedExpenses.map((expense) => (
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

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem className="flex items-center">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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