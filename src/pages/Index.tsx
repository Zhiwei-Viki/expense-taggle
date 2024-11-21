import { ExpenseProvider } from "@/context/ExpenseContext";
import { ExpenseList } from "@/components/ExpenseList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Budget Tracker</h1>
            <Button onClick={() => navigate('/graph')} variant="outline">
              <BarChart className="w-4 h-4 mr-2" />
              View Graph
            </Button>
          </div>
          <ExpenseList />
        </div>
      </div>
    </ExpenseProvider>
  );
};

export default Index;