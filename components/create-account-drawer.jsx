"use client";

import { accountSchema } from "@/app/lib/schema";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        {/* Backdrop Blur overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-200 animate-in fade-in" />
        
        {/* Centered Modal Content */}
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-32px)] sm:w-full max-w-[500px] bg-zinc-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl z-50 focus:outline-none text-white animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between mb-5">
            <div>
              <Dialog.Title className="text-xl font-semibold tracking-tight text-slate-100">
                Create New Account
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-400 mt-1">
                Add a new account to track transactions and budgets.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="h-6 w-6 text-slate-400 hover:text-white rounded-md hover:bg-white/5 flex items-center justify-center transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Account Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold text-slate-300"
              >
                Account Name
              </label>
              <Input
                className="bg-zinc-950 border-white/10 text-white text-sm rounded-xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full h-10 placeholder:text-zinc-600"
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-0.5">{errors.name.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-xs font-semibold text-slate-300"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="bg-zinc-950 border-white/10 text-white text-sm rounded-xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full h-10">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                  <SelectItem value="CURRENT" className="hover:bg-white/5 cursor-pointer text-xs">Current</SelectItem>
                  <SelectItem value="SAVINGS" className="hover:bg-white/5 cursor-pointer text-xs">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-rose-500 mt-0.5">{errors.type.message}</p>
              )}
            </div>

            {/* Initial Balance */}
            <div className="space-y-1.5">
              <label
                htmlFor="balance"
                className="text-xs font-semibold text-slate-300"
              >
                Initial Balance
              </label>
              <Input
                className="bg-zinc-950 border-white/10 text-white text-sm rounded-xl focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full h-10 placeholder:text-zinc-600"
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-xs text-rose-500 mt-0.5">{errors.balance.message}</p>
              )}
            </div>

            {/* Set as Default Switch */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all">
              <div className="space-y-0.5 pr-2">
                <label
                  htmlFor="isDefault"
                  className="text-sm font-semibold cursor-pointer text-slate-200"
                >
                  Set as Default
                </label>
                <p className="text-[11px] text-slate-400 leading-normal max-w-[280px]">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-zinc-800 relative inline-flex h-6 w-11 rounded-full transition-colors border border-white/5"
              >
                <span
                  className={`absolute left-0.5 top-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    watch("isDefault") ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Switch>
            </div>

            {/* Cancel / Submit Buttons */}
            <div className="flex gap-4 pt-2">
              <Dialog.Close asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 bg-transparent border-white/10 hover:bg-white/5 hover:text-white rounded-xl text-xs h-10 transition-all"
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium rounded-xl text-xs h-10 transition-colors"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}