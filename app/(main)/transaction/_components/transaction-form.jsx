"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";
import { Card, CardTitle } from "@/components/ui/card";

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Section 1: Page Header */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-teal-400">
          {editMode ? "Edit" : "Add"} Transaction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Track income and expenses across your accounts.
        </p>
      </div>

      {/* Section 2: AI Scanner Card */}
      {!editMode && (
        <Card className="rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-sm text-white hover:border-cyan-500/20 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-200">Smart Receipt Scanner</h3>
            <p className="text-xs text-slate-400">
              Upload an image of a receipt to automatically extract transaction details using AI.
            </p>
          </div>
          <div className="w-full sm:w-auto shrink-0">
            <ReceiptScanner onScanComplete={handleScanComplete} />
          </div>
        </Card>
      )}

      {/* Section 3: Form Card */}
      <Card className="rounded-2xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-sm text-white hover:border-cyan-500/20 transition-all">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Type + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 text-white">
              <label className="text-xs font-semibold text-slate-300">Type</label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
                <SelectTrigger className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-rose-500 mt-0.5">{errors.type.message}</p>}
            </div>

            <div className="space-y-1.5 text-white">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={getValues("category")}
              >
                <SelectTrigger className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-xs hover:bg-white/5">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-rose-500 mt-0.5">{errors.category.message}</p>}
            </div>
          </div>

          {/* Row 2: Amount + Account */}
          <div className="grid gap-5 md:grid-cols-2 text-white">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Amount</label>
              <Input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                {...register("amount")} 
                className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full placeholder:text-zinc-600"
              />
              {errors.amount && <p className="text-xs text-rose-500 mt-0.5">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account</label>
              <Select
                onValueChange={(value) => setValue("accountId", value)}
                defaultValue={getValues("accountId")}
              >
                <SelectTrigger className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="text-xs hover:bg-white/5">
                      {account.name} (${parseFloat(account.balance).toFixed(2)})
                    </SelectItem>
                  ))}
                  <CreateAccountDrawer>
                    <Button
                      variant="ghost"
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-xs outline-none hover:bg-accent hover:text-accent-foreground h-8 mt-1"
                    >
                      Create Account
                    </Button>
                  </CreateAccountDrawer>
                </SelectContent>
              </Select>
              {errors.accountId && <p className="text-xs text-rose-500 mt-0.5">{errors.accountId.message}</p>}
            </div>
          </div>

          {/* Row 3: Date + Recurring Interval */}
          <div className="grid gap-5 md:grid-cols-2 text-white">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className={cn("w-full pl-3 text-left font-normal bg-zinc-950 border border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all", !date && "text-slate-400")}>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-zinc-950 border border-white/10 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => setValue("date", date)}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-rose-500 mt-0.5">{errors.date.message}</p>}
            </div>

            {isRecurring ? (
              <div className="space-y-1.5 text-white">
                <label className="text-xs font-semibold text-slate-300">Recurring Interval</label>
                <Select
                  onValueChange={(value) => setValue("recurringInterval", value)}
                  defaultValue={getValues("recurringInterval")}
                >
                  <SelectTrigger className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                    <SelectItem value="DAILY" className="text-xs hover:bg-white/5">Daily</SelectItem>
                    <SelectItem value="WEEKLY" className="text-xs hover:bg-white/5">Weekly</SelectItem>
                    <SelectItem value="MONTHLY" className="text-xs hover:bg-white/5">Monthly</SelectItem>
                    <SelectItem value="YEARLY" className="text-xs hover:bg-white/5">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurringInterval && (
                  <p className="text-xs text-rose-500 mt-0.5">{errors.recurringInterval.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 text-white">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <Input 
                  placeholder="Enter description" 
                  {...register("description")} 
                  className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full placeholder:text-zinc-600"
                />
                {errors.description && <p className="text-xs text-rose-500 mt-0.5">{errors.description.message}</p>}
              </div>
            )}
          </div>

          {/* Row 4: Description (only shown when recurring is active since it occupied row 3) */}
          {isRecurring && (
            <div className="space-y-1.5 text-white">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <Input 
                placeholder="Enter description" 
                {...register("description")} 
                className="bg-zinc-950 border-white/10 text-white rounded-xl h-11 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full placeholder:text-zinc-600"
              />
              {errors.description && <p className="text-xs text-rose-500 mt-0.5">{errors.description.message}</p>}
            </div>
          )}

          {/* Section 4: Recurring Settings Card */}
          <div className="flex flex-row items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-white">
            <div className="space-y-0.5 pr-2">
              <label className="text-sm font-semibold cursor-pointer text-slate-200">Recurring Transaction</label>
              <p className="text-[11px] text-slate-400 leading-normal">
                Set up a recurring schedule for this transaction
              </p>
            </div>
            <Switch
              checked={isRecurring}
              onCheckedChange={(checked) => setValue("isRecurring", checked)}
              className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-zinc-800 relative inline-flex h-6 w-11 rounded-full transition-colors border border-white/5"
            >
              <span
                className={`absolute left-0.5 top-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isRecurring ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </Switch>
          </div>

          {/* Section 5: Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent border-white/10 hover:bg-white/5 hover:text-white rounded-xl text-xs h-10 px-6 transition-all"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-xs h-10 px-6 transition-colors" 
              disabled={transactionLoading}
            >
              {transactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Update Transaction"
              ) : (
                "Create Transaction"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}