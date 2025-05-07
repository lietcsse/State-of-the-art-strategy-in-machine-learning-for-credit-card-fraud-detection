import { Shield, ShieldX, Clock, CreditCard, DollarSign, Percent, AlertTriangle, ShieldCheck, ShieldOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  totalTransactions: number;
  predictedFraudulentTransactions: number;
  predictedLegitimateTransactions: number;
  predictedFraudPercentage: number;
  actualFraudulentTransactions?: number;
  actualLegitimateTransactions?: number;
  actualFraudPercentage?: number;
  fraudulentTransactions: number;
  legitimateTransactions: number;
  fraudPercentage: number;
  averageAmount: number;
  maxAmount: number;
  fraudByTimeData: { name: string; count: number }[];
  fraudByAmountData: { name: string; value: number }[];
  recentFraudulentTransactions: {
    id: string;
    amount: number;
    date: string;
    description: string;
  }[];
}

const FraudAlert = ({ 
  fraudPercentage, 
  totalTransactions, 
  actualFraudulentTransactions 
}: { 
  fraudPercentage: number;
  totalTransactions: number;
  actualFraudulentTransactions: number;
}) => {
  const getAlertConfig = (percentage: number) => {
    if (percentage <= 5) {
      return {
        color: "green",
        title: "All Good",
        icon: ShieldCheck,
        message: "Normal transaction patterns detected. No immediate action required.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-500"
      };
    } else if (percentage <= 25) {
      return {
        color: "amber",
        title: "Monitor Closely",
        icon: AlertTriangle,
        message: "Some suspicious activity detected. We recommend monitoring this account closely for the next 72 hours.",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
        iconColor: "text-amber-500"
      };
    } else {
      return {
        color: "red",
        title: "Immediate Action Required",
        icon: ShieldOff,
        message: "High fraud activity detected. Immediate card block recommended.",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        iconColor: "text-red-500"
      };
    }
  };

  const config = getAlertConfig(fraudPercentage);
  const Icon = config.icon;

  return (
    <div className={`rounded-lg text-card-foreground shadow-sm border-2 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-4">
          <Icon className={`h-8 w-8 ${config.iconColor}`} />
          <h3 className={`text-2xl font-semibold leading-none tracking-tight ${config.textColor}`}>
            {config.title}
          </h3>
        </div>
        <p className="text-muted-foreground mt-2 text-base">
          {config.message}
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium mb-2">Summary</h3>
              <p className="text-sm">
                Out of {totalTransactions} transactions, {actualFraudulentTransactions} were 
                flagged as fraudulent ({fraudPercentage.toFixed(2)}%).
              </p>
            </div>
            <div className="bg-white bg-opacity-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium mb-2">Recommended Actions</h3>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {fraudPercentage <= 5 && (
                  <>
                    <li>Continue regular monitoring</li>
                    <li>No additional action required</li>
                    <li>Maintain standard security measures</li>
                  </>
                )}
                {fraudPercentage > 5 && fraudPercentage <= 25 && (
                  <>
                    <li>Set up enhanced transaction monitoring</li>
                    <li>Consider temporary spending limits</li>
                    <li>Send fraud alert notification to the customer</li>
                  </>
                )}
                {fraudPercentage > 25 && (
                  <>
                    <li>Immediately block the card</li>
                    <li>Contact the customer urgently</li>
                    <li>Initiate fraud investigation</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionAnalytics = ({ data }: { data: AnalyticsData }) => {
  const COLORS = ["#0160a3", "#16a34a", "#e11d48", "#eab308", "#64748b"];

  return (
    <div className="space-y-8">
      <FraudAlert 
        fraudPercentage={data.actualFraudPercentage || 0}
        totalTransactions={data.totalTransactions}
        actualFraudulentTransactions={data.actualFraudulentTransactions || 0}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Predicted Fraud Statistics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Predicted Fraudulent Transactions</p>
              <p className="text-2xl font-bold">{data.predictedFraudulentTransactions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Predicted Fraud Percentage</p>
              <p className="text-2xl font-bold">{data.predictedFraudPercentage}%</p>
            </div>
          </div>
        </div>

        {data.actualFraudulentTransactions !== undefined && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actual Fraud Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Actual Fraudulent Transactions</p>
                <p className="text-2xl font-bold">{data.actualFraudulentTransactions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Actual Fraud Percentage</p>
                <p className="text-2xl font-bold">{data.actualFraudPercentage}%</p>
              </div>
            </div>
          </div>
        )}
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Analyzed transaction records
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-fraud-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-fraud-red-800">Fraudulent Transactions</CardTitle>
            <ShieldX className="h-4 w-4 text-fraud-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fraud-red-800">{data.actualFraudulentTransactions}</div>
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-fraud-red-600">Percentage</p>
                <p className="text-xs font-bold text-fraud-red-800">{data.actualFraudPercentage}%</p>
              </div>
              <Progress 
                value={data.actualFraudPercentage} 
                className="h-1.5 mt-1 bg-fraud-red-100" 
                indicatorClassName="bg-fraud-red-500" 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-fraud-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-fraud-green-800">Legitimate Transactions</CardTitle>
            <Shield className="h-4 w-4 text-fraud-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-fraud-green-800">{data.totalTransactions - data.actualFraudulentTransactions}</div>
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-fraud-green-600">Percentage</p>
                <p className="text-xs font-bold text-fraud-green-800">{100 - data.actualFraudPercentage}%</p>
              </div>
              <Progress 
                value={100 - data.actualFraudPercentage} 
                className="h-1.5 mt-1 bg-fraud-green-100" 
                indicatorClassName="bg-fraud-green-500" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
