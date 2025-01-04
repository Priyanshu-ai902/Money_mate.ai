"use client"


import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { categoryColors } from '@/data/categories'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'


const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};




const TransactionTable = ({ transactions }) => {
  const filteredAndSortedTransactions = transactions || [];


  return (
    <div className='space-y-4 text-white'>
      <div className="rounded-md  border">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox className="border-white" />
              </TableHead >
              <TableHead className="cursor-pointer"
                onClick={() => handleSort("date")}>
                <div className='text-white flex items-center'>

                  Date
                </div>
              </TableHead>
              <TableHead className="text-white">
                Description
              </TableHead>

              <TableHead className="cursor-pointer"
                onClick={() => handleSort("category")}>
                <div className='text-white flex items-center'>

                  Category
                </div>
              </TableHead>

              <TableHead className="cursor-pointer"
                onClick={() => handleSort("amount")}>
                <div className='text-white flex justify-end'>

                  Amount
                </div>
              </TableHead>
              <TableHead className="text-white">Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-white text-center">
                  No transction Found
                </TableCell>
              </TableRow>
            ) : (

              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium"><Checkbox className="border-white" /></TableCell>
                  <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                  <TableCell className="text-white">{transaction.description}</TableCell>
                  <TableCell className="text-white capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className='px-2 py-1 rounded text-white text-sm'>
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right "
                  style={{
                    color: transaction.type == "EXPENSE" ? "red" :"green",
                  }}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    ${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.isRecurring?(
                      <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Badge  variant="outline" className="gap-1 text-white">
                        <Clock className='h-3 w-3'/>
                        One Time</Badge></TooltipTrigger>
                        <TooltipContent>
                          <p>Add to library</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    ):(
                      <Badge  variant="outline" className="gap-1 text-white">
                        <Clock className='h-3 w-3'/>
                        One Time</Badge>
                    )}</TableCell>
                </TableRow>
              ))
            )
            }
          </TableBody>
        </Table>

      </div>

    </div>
  )
}

export default TransactionTable
