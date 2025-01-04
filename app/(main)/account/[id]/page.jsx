import React from 'react'
// import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
// import { BarLoader } from "react-spinners";
// import { TransactionTable } from "../_components/transaction-table";
// import { AccountChart } from "../_components/account-chart";
import { toast } from 'sonner';

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    console.log("404")
  }

  const { transactions, ...account } = accountData;

  return (
      <div className="space-y-8 px-5 bg-black p-10">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-teal-400 capitalize">
            {account.name}
          </h1>
          <p className=" text-green-400 pt-2">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold text-white">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground text-white">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>
    </div>
  );
}