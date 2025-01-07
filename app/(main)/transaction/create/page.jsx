import React from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { getTransaction } from "@/actions/transaction";
import { AddTransactionForm } from "../_components/transaction-form";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="px-5 bg-black pt-12 ">
      <div className="flex justify-center md:justify-normal mb-12 ">
        <h1 className="mx-auto text-5xl text-teal-400">{editId?"Edit":"Add"} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}