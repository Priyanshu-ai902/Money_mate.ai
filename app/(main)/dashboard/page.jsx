import React from 'react'
import { Suspense } from "react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { CreateAccountDrawer } from "@/components/create-account-drawer";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
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



  return (
    <div className="bg-black px-5 pt-12 h-screen">
      {defaultAccount && (
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      <Suspense fallback={"Loading Overview..."}>
        <h1 className='text-teal-500 pt-8 text-xl'>Account Overview</h1>
        <DashboardOverview
          accounts={accounts}
          transactions={transactions || []}
        />
      </Suspense>

      <h1 className='text-teal-500 pt-8 text-xl'>Create Account</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
       
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5 bg-black border-white">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
    </div>




  )
}