import { Card } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  return (
    <Card className="p-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-2xl font-semibold">
            ${expense.amount.toFixed(2)}
          </p>
          <p className="text-gray-600">{expense.description}</p>
          <p className="text-sm text-gray-500">{expense.date}</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {expense.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {expense.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
};