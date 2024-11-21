import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExpenseFormData } from "@/types/expense";
import { useState } from "react";

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: ExpenseFormData;
  onCancel?: () => void;
}

export const ExpenseForm = ({
  onSubmit,
  initialData,
  onCancel,
}: ExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseFormData>(
    initialData || {
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      tags: [],
    }
  );
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              amount: parseFloat(e.target.value) || 0,
            }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
          />
          <Button type="button" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save Expense</Button>
      </div>
    </form>
  );
};