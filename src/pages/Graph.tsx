import { useExpenses } from "@/context/ExpenseContext";
import { format, parse } from "date-fns";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Graph = () => {
  const { expenses } = useExpenses();
  const navigate = useNavigate();

  // Process data for the chart
  const monthlyData = expenses.reduce((acc: any[], expense) => {
    const date = parse(expense.date, 'yyyy-MM-dd', new Date());
    const monthKey = format(date, 'MMM yyyy');
    
    const existingMonth = acc.find(item => item.month === monthKey);
    if (existingMonth) {
      existingMonth.amount += expense.amount;
    } else {
      acc.push({
        month: monthKey,
        amount: expense.amount,
      });
    }
    
    return acc;
  }, []);

  // Sort by date
  monthlyData.sort((a, b) => {
    const dateA = parse(a.month, 'MMM yyyy', new Date());
    const dateB = parse(b.month, 'MMM yyyy', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Monthly Expenses</h1>
          <Button onClick={() => navigate('/')}>Back to List</Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="h-[500px]">
            <ChartContainer
              config={{
                amount: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
                <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `$${value.toLocaleString()}`} />} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;