"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 shadow-xl text-xs space-y-1.5 animate-in fade-in duration-100 z-50">
        <p className="text-white font-semibold tracking-tight">{label}</p>
        <div className="space-y-1">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-400 capitalize">{item.name}</span>
              </div>
              <span className="text-white font-bold">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const { filteredTransactions, filteredData } = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    const sortedData = Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return {
      filteredTransactions: filtered,
      filteredData: sortedData,
    };
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const transactionCount = filteredTransactions.length;
  const showChart = transactionCount >= 10;
  const hasNoData = transactionCount === 0;

  if (!showChart) {
    const netBalance = totals.income - totals.expense;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* LEFT SIDE (50%) */}
        <div className="flex flex-col gap-4">
          {/* Total Income Card */}
          <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between flex-1 hover:border-cyan-500/20 transition-all text-white">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-2">
              ${totals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </Card>

          {/* Total Expenses Card */}
          <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between flex-1 hover:border-cyan-500/20 transition-all text-white">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
            <div className="text-2xl font-bold text-red-400 tracking-tight mt-2">
              ${totals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </Card>

          {/* Net Balance Card */}
          <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 flex flex-col justify-between flex-1 hover:border-cyan-500/20 transition-all text-white">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Balance</span>
            <div className={`text-2xl font-bold tracking-tight mt-2 ${netBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ${netBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE (50%) */}
        <div className="flex">
          <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-6 hover:border-cyan-500/20 transition-all text-white flex flex-col justify-between flex-1 w-full">
            <div className="space-y-6">
              <div className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
                <CardTitle className="text-xs font-semibold tracking-tight text-slate-200">
                  Summary Overview
                </CardTitle>
                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[130px] h-7 bg-black/60 border-white/10 text-[11px] text-slate-200">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-white text-[11px]">
                    {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key} className="text-[11px] hover:bg-white/5">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Total Income</span>
                  <span className="font-semibold text-emerald-400">
                    ${totals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Total Expenses</span>
                  <span className="font-semibold text-red-400">
                    ${totals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Net Balance</span>
                  <span className={`font-semibold ${netBalance >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${netBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 font-medium">Transaction Count</span>
                  <span className="font-semibold text-slate-200">{transactionCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Date Range</span>
                  <span className="font-medium text-slate-200">{DATE_RANGES[dateRange].label}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section 2: Overview Stats (3 KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {/* Total Income Card */}
        <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-4 shadow-sm hover:border-cyan-500/20 transition-all flex flex-col justify-between h-[96px] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            ${totals.income.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </Card>

        {/* Total Expenses Card */}
        <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-4 shadow-sm hover:border-cyan-500/20 transition-all flex flex-col justify-between h-[96px] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 tracking-tight">
            ${totals.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </Card>

        {/* Net Balance Card */}
        <Card className="border border-white/10 rounded-2xl bg-zinc-950 p-4 shadow-sm hover:border-cyan-500/20 transition-all flex flex-col justify-between h-[96px] text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Net Balance</span>
            <span className="text-[9px] text-slate-500">Filtered</span>
          </div>
          <div className={`text-xl font-bold tracking-tight ${totals.income - totals.expense >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            ${(totals.income - totals.expense).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </Card>
      </div>

      {/* Section 3: Chart Card */}
      <Card className="border border-white/10 rounded-2xl bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 text-white">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
            <CardTitle className="text-xs font-semibold tracking-tight text-slate-200">
              Analytics Overview
            </CardTitle>
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[130px] h-7 bg-black/60 border-white/10 text-[11px] text-slate-200">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white text-[11px]">
                {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key} className="text-[11px] hover:bg-white/5">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-[240px] w-full transition-all duration-300">
            {hasNoData ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
                <span>No transactions found in this period.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ 
                    top: 10, 
                    right: 10, 
                    left: 10, 
                    bottom: 0 
                  }}
                >
                  <CartesianGrid stroke="rgba(255, 255, 255, 0.02)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{ fill: "rgba(255, 255, 255, 0.4)" }}
                  />
                  <YAxis
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    stroke="rgba(255, 255, 255, 0.3)"
                    tick={{ fill: "rgba(255, 255, 255, 0.4)" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={24} 
                    iconSize={6}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px", color: "#a1a1aa" }}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10b981"
                    barSize={10}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#f43f5e"
                    barSize={10}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}