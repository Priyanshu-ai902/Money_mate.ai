"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Target } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function Progress({ value, className = "" }) {
  return (
    <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 rounded-full ${className}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm hover:border-cyan-500/20 transition-all p-5 flex flex-col justify-between h-[110px] text-white">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Budget</span>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-16 h-6 bg-black/60 border-white/10 text-white text-xs px-1"
                  placeholder="Budget"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="h-6 w-6 hover:bg-white/5 p-0"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-6 w-6 hover:bg-white/5 p-0"
                >
                  <X className="h-3.5 w-3.5 text-rose-500" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-teal-400" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-5 w-5 hover:bg-white/5 text-slate-400 hover:text-white p-0"
                >
                  <Pencil className="h-2.5 w-2.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold text-slate-100 tracking-tight">
            {initialBudget ? `$${initialBudget.amount.toFixed(0)}` : "Not Set"}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-slate-500 truncate">
              {initialBudget
                ? `$${currentExpenses.toFixed(0)} spent (${percentUsed.toFixed(0)}%)`
                : "No budget set"}
            </span>
          </div>
          {initialBudget && (
            <div className="mt-1">
              <Progress
                value={percentUsed}
                className={`${
                  percentUsed >= 90
                    ? "bg-rose-500"
                    : percentUsed >= 75
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
