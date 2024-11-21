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
    <Card className="p-3 animate-fadeIn">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <p className="text-xl font-semibold">${expense.amount.toFixed(2)}</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">{expense.description}</p>
            <p className="text-xs text-gray-500">{expense.date}</p>
            {expense.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {expense.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="icon" variant="outline" onClick={onEdit} className="h-8 w-8">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="destructive" onClick={onDelete} className="h-8 w-8">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};