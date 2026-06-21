"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#2dd4bf", // teal-400
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="text-white font-medium capitalize">{payload[0].name}</p>
        <p className="text-white font-bold mt-0.5">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Recent Transactions Card (2/3 width on desktop) */}
      <Card className="lg:col-span-2 border border-white/10 rounded-2xl bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 text-white flex flex-col justify-between h-[360px]">
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <CardTitle className="text-sm font-semibold tracking-tight text-slate-200">
              Recent Transactions
            </CardTitle>
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="w-[130px] h-7 bg-black/60 border-white/10 text-[11px] text-slate-200">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id} className="text-[11px] hover:bg-white/5">
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 overflow-y-auto mt-3 pr-1 scrollbar-thin flex flex-col justify-center">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No recent transactions
              </p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-0"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug truncate max-w-[180px] sm:max-w-[280px]">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm">
                      {transaction.type === "EXPENSE" ? (
                        <span className="flex items-center text-rose-400">
                          <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                          -${transaction.amount.toFixed(2)}
                        </span>
                      ) : (
                        <span className="flex items-center text-emerald-400">
                          <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                          +${transaction.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Expense Chart Card (1/3 width on desktop) */}
      <Card className="lg:col-span-1 border border-white/10 rounded-2xl bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 text-white flex flex-col justify-between h-[360px]">
        <div className="flex flex-col h-full justify-between">
          <div className="pb-4 border-b border-white/5">
            <CardTitle className="text-sm font-semibold tracking-tight text-slate-200">
              Monthly Expense Breakdown
            </CardTitle>
          </div>
          <div className="flex-1 flex items-center justify-center mt-3">
            {pieChartData.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">
                No expenses this month
              </p>
            ) : (
              <div className="w-full h-[220px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="48%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={32} 
                      iconSize={8} 
                      iconType="circle"
                      wrapperStyle={{ fontSize: "10px", color: "#a1a1aa" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}