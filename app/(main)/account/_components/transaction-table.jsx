"use client"


import React, { useState } from 'react'
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
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'



const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};




const TransactionTable = ({ transactions }) => {
  const filteredAndSortedTransactions = transactions;

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const router = useRouter()



  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };


  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };


  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  return (
    <div className='space-y-4 text-white'>
      <div className="rounded-md  border">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox className="border-white"
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead >
              <TableHead className="cursor-pointer"
                onClick={() => handleSort("date")}>
                <div className='text-white flex items-center'>

                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-white">
                Description
              </TableHead>

              <TableHead className="cursor-pointer"
                onClick={() => handleSort("category")}>
                <div className='text-white flex items-center'>

                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
                </div>
              </TableHead>

              <TableHead className="cursor-pointer"
                onClick={() => handleSort("amount")}>
                <div className='text-white flex justify-end'>

                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className='ml-1 h-4 w-4' />
                    ))}
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
                  No transaction Found
                </TableCell>
              </TableRow>
            ) : (

              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <Checkbox className="border-white"
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
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
                      color: transaction.type == "EXPENSE" ? "red" : "green",
                    }}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    ${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger><Badge variant="outline" className="gap-1 text-white">
                          <RefreshCw className='h-3 w-3' />
                          {
                            RECURRING_INTERVALS[transaction.recurringInterval]
                          }
                        </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className='font-medium'>Next Date:</div>
                            <div>
                              {format(new Date(transaction.nextRecurringDate), "PP")}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                  ) : (
                    <Badge variant="outline" className="gap-1 text-white">
                      <Clock className='h-3 w-3' />
                      One Time</Badge>
                  )}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel
                          onClick={() => router.push(
                            `/transaction/create?edit=${transaction.id}`
                          )}
                        >Edit</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                        // onClick={()=> deleteFn([transaction.id])}
                        >Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </TableCell>
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
