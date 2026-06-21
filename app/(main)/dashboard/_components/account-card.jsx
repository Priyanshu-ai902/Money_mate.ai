"use client"

import React, { useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from '@/actions/accounts';
import { toast } from 'sonner';



const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("You need atleast 1 default account");
            return;
        }

        await updateDefaultFn(id);
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Account is updated successfully");
        }
    }, [updatedAccount, updateDefaultLoading]);
    
    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account");
        }
    }, [error]);
    

    return (
        <Card className="hover:scale-[1.01] hover:shadow-lg hover:border-cyan-500/20 transition-all duration-300 group relative bg-zinc-950 border border-white/10 rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <Link href={`/account/${id}`} className="flex flex-col h-full justify-between">
                <div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                        <CardTitle className="text-sm font-semibold capitalize text-slate-200">
                            {name}
                        </CardTitle>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Switch checked={isDefault}
                                onClick={handleDefaultChange}
                                disabled={updateDefaultLoading}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
                            ${parseFloat(balance).toFixed(2)}
                        </div>
                        <p className="text-xs text-slate-400 capitalize">
                            {type.toLowerCase()} Account
                        </p>
                    </CardContent>
                </div>
                <CardFooter className="flex justify-between text-xs text-slate-400 px-6 pb-6 pt-0 mt-auto">
                    <div className="flex items-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        <span>Income</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ArrowDownRight className="h-4 w-4 text-rose-500" />
                        <span>Expense</span>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard
