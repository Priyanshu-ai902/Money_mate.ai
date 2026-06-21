"use client"

import React, { useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableBody,
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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Card } from "@/components/ui/card"
import useFetch from '@/hooks/use-fetch'
import { bulkDeleteTransactions } from '@/actions/accounts'
import { toast } from 'sonner'
import { BarLoader } from 'react-spinners'

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recurringFilter, setRecurringFilter] = useState("");

  const itemsPerPage = 8;

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filteredAndSortedTransactions.length
        ? []
        : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='space-y-4 text-white'>
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}

      {/* Filters Toolbar Card */}
      <Card className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-sm text-white hover:border-cyan-500/20 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-black/60 border-white/10 text-white placeholder:text-zinc-600 rounded-xl h-9 text-xs focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={typeFilter || "all"}
              onValueChange={(value) => {
                setTypeFilter(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] h-9 bg-black/60 border-white/10 text-xs text-slate-200 rounded-xl">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                <SelectItem value="all" className="text-xs hover:bg-white/5">All Types</SelectItem>
                <SelectItem value="INCOME" className="text-xs hover:bg-white/5">Income</SelectItem>
                <SelectItem value="EXPENSE" className="text-xs hover:bg-white/5">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={recurringFilter || "all"}
              onValueChange={(value) => {
                setRecurringFilter(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] h-9 bg-black/60 border-white/10 text-xs text-slate-200 rounded-xl">
                <SelectValue placeholder="All Transactions" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                <SelectItem value="all" className="text-xs hover:bg-white/5">All Transactions</SelectItem>
                <SelectItem value="recurring" className="text-xs hover:bg-white/5">Recurring Only</SelectItem>
                <SelectItem value="non-recurring" className="text-xs hover:bg-white/5">Non-recurring Only</SelectItem>
              </SelectContent>
            </Select>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="h-9 rounded-xl text-xs bg-rose-600 hover:bg-rose-500 font-semibold"
              >
                <Trash className="h-3.5 w-3.5 mr-1.5" />
                Delete ({selectedIds.length})
              </Button>
            )}

            {(searchTerm || typeFilter || recurringFilter) && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearFilters}
                className="h-9 w-9 rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card className="rounded-2xl border border-white/10 bg-zinc-950 shadow-sm overflow-hidden text-white">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="w-[48px] py-3.5 pl-4">
                <Checkbox 
                  className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded"
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredAndSortedTransactions.length &&
                    filteredAndSortedTransactions.length > 0
                  }
                />
              </TableHead >
              <TableHead className="cursor-pointer py-3.5" onClick={() => handleSort("date")}>
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1 hover:text-white transition-colors">
                  Date
                  {sortConfig.field === "date" && (
                    sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-300 py-3.5">Description</TableHead>
              <TableHead className="cursor-pointer py-3.5" onClick={() => handleSort("category")}>
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1 hover:text-white transition-colors">
                  Category
                  {sortConfig.field === "category" && (
                    sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer py-3.5" onClick={() => handleSort("amount")}>
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-end gap-1 hover:text-white transition-colors">
                  Amount
                  {sortConfig.field === "amount" && (
                    sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-300 py-3.5">Recurring</TableHead>
              <TableHead className="w-[48px] py-3.5 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length ? (
              paginatedTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id} 
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >
                  <TableCell className="py-3 pl-4">
                    <Checkbox 
                      className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 rounded"
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-slate-300 py-3">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-200 py-3">
                    {transaction.description || "Untitled Transaction"}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      style={{
                        backgroundColor: categoryColors[transaction.category] + "1A", // 10% opacity
                        color: categoryColors[transaction.category],
                        border: `1px solid ${categoryColors[transaction.category]}33`,
                      }}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase inline-block"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right text-xs font-bold py-3 ${
                    transaction.type === "EXPENSE" ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 border-white/10 text-teal-400 bg-teal-400/5 hover:bg-teal-400/10 text-[10px] rounded-md h-5 px-1.5 font-medium transition-colors">
                              <RefreshCw className="h-2.5 w-2.5 animate-spin-slow" />
                              {RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 border-white/10 text-white rounded-lg text-[11px] p-2.5 shadow-lg">
                            <div>
                              <span className="text-slate-400 font-semibold block">Next Date:</span>
                              <span className="font-bold">{format(new Date(transaction.nextRecurringDate), "PP")}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-white/10 text-slate-400 bg-white/[0.02] text-[10px] rounded-md h-5 px-1.5 font-medium">
                        <Clock className="h-2.5 w-2.5" />
                        One Time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-950 border-white/10 text-white rounded-xl">
                        <DropdownMenuItem
                          className="text-xs hover:bg-white/5 cursor-pointer rounded-lg m-1"
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          className="text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg m-1 font-semibold"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs text-slate-400 py-12">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 py-2 mt-4 text-xs text-slate-400">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="h-8 w-8 bg-zinc-950 border-white/10 hover:bg-white/5 hover:text-white rounded-xl transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-slate-300 font-medium">
        Page {currentPage} of {totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-8 w-8 bg-zinc-950 border-white/10 hover:bg-white/5 hover:text-white rounded-xl transition-all"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TransactionTable;
