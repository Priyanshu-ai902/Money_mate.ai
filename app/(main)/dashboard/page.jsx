import React from 'react'
import { Suspense } from "react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";

import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AccountCard from './_components/account-card';
import { BudgetProgress } from './_components/budget-progress';
import { getCurrentBudget } from '@/actions/budget';
import { DashboardOverview } from './_components/transaction-overview';

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  // Calculate Stats
  const totalBalance = accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0;
  const budgetSpent = budgetData?.currentExpenses || 0;
  const monthlyBudget = budgetData?.budget?.amount || null;

  const currentDate = new Date();
  const currentMonthTransactions = transactions?.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  }) || [];

  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Section 2: Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance Card */}
        <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 flex flex-col justify-between h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</span>
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Across all accounts</p>
          </div>
        </Card>

        {/* Monthly Budget Card */}
        {defaultAccount ? (
          <BudgetProgress
            initialBudget={budgetData?.budget}
            currentExpenses={budgetSpent}
          />
        ) : (
          <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 flex flex-col justify-between h-[110px] text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Budget</span>
              <Target className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-500 tracking-tight">Not Set</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Set a default account first</p>
            </div>
          </Card>
        )}

        {/* Income Card */}
        <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 flex flex-col justify-between h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              +${currentMonthIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">For current month</p>
          </div>
        </Card>

        {/* Expenses Card */}
        <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 flex flex-col justify-between h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Expenses</span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">
              -${currentMonthExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">For current month</p>
          </div>
        </Card>
      </div>

      {/* Section 3: Main Dashboard Grid */}
      <Suspense fallback={
        <div className="text-center py-8 text-slate-400">
          Loading Overview...
        </div>
      }>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-200">Account Overview</h2>
          <DashboardOverview
            accounts={accounts}
            transactions={transactions || []}
          />
        </div>
      </Suspense>

      {/* Section 4: Accounts Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-200">My Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <CreateAccountDrawer>
            <Card className="hover:scale-[1.01] hover:shadow-lg hover:border-cyan-500/20 transition-all duration-300 cursor-pointer border border-dashed border-white/20 bg-zinc-950 shadow-sm h-full flex flex-col items-center justify-center min-h-[120px] p-5">
              <CardContent className="flex flex-col items-center justify-center text-slate-400 p-0">
                <Plus className="h-6 w-6 mb-1 text-teal-400" />
                <p className="text-xs font-medium text-slate-300">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {accounts.length > 0 &&
            accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}