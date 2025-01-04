import React from 'react'
import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";

// import { AccountChart } from "../_components/account-chart";
import { RingLoader } from 'react-spinners';
import TransactionTable from '../_components/transaction-table';

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

 

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5 bg-black p-10 h-screen overflow-auto">
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



      <Suspense
        fallback={<div className="fixed inset-0 flex items-center justify-center bg-white">
          <RingLoader color="#36d7b7" size={60} />
        </div>}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}



