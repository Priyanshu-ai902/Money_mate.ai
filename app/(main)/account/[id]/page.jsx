import React from 'react'
import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { RingLoader } from 'react-spinners';
import TransactionTable from '../_components/transaction-table';
import { AccountChart } from '../_components/account-chart';
import { Card } from "@/components/ui/card";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-6">
      {/* Section 1: Compact Header Card */}
      <Card className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-sm text-white hover:border-cyan-500/20 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-400 capitalize leading-tight">
              {account.name}
            </h1>
            <p className="text-xs text-slate-400 capitalize">
              {account.type.toLowerCase()} Account
            </p>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-1">
            <div className="text-2xl font-extrabold text-slate-100 tracking-tight leading-tight">
              ${parseFloat(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-400">
              {account._count.transactions} transactions
            </p>
          </div>
        </div>
      </Card>

      <Suspense fallback={
        <div className="flex items-center justify-center py-10">
          <RingLoader color="#2dd4bf" size={60} />
        </div>
      }>
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <RingLoader color="#2dd4bf" size={60} />
          </div>
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
