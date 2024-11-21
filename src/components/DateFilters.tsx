import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format, subDays, startOfToday } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface DateFiltersProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onReset: () => void;
}

const QUICK_FILTERS = [
  { label: "Today", days: 0 },
  { label: "Last 3 days", days: 3 },
  { label: "Last 5 days", days: 5 },
  { label: "Last week", days: 7 },
  { label: "Last month", days: 30 },
] as const;

export const DateFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: DateFiltersProps) => {
  const handleQuickFilter = (days: number) => {
    const end = startOfToday();
    const start = subDays(end, days);
    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {QUICK_FILTERS.map(({ label, days }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter(days)}
          >
            {label}
          </Button>
        ))}
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
              onSelect={onStartDateChange}
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
              onSelect={onEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(startDate || endDate) && (
          <Button
            variant="ghost"
            className="h-8 px-2"
            onClick={onReset}
          >
            Reset dates
          </Button>
        )}
      </div>
    </div>
  );
};