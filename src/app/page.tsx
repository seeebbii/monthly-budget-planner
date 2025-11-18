"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToTransactions, Transaction } from "@/services/transactionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import { LandingPage } from "@/components/LandingPage";

import { BudgetChart } from "@/components/BudgetChart";
import { BudgetForm } from "@/components/BudgetForm";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BigCalendar } from "@/components/BigCalendar";
import { startOfMonth, endOfMonth, isWithinInterval, isSameDay } from "date-fns";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToTransactions(user.uid, (data) => {
        setTransactions(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length >= 0) { // Run even if empty to reset
      // If a date is selected, we filter by that specific DATE for the list?
      // Or do we still show the whole month?
      // The user said "on each date switch we will show the data related to it".
      // This implies daily view when a date is clicked.
      // BUT, for the summary cards, usually you want Monthly context.
      // Let's try this:
      // Summary Cards: Always Monthly (based on the calendar's current view? Or selected date's month?)
      // Transaction List: Daily (if date selected) or Monthly?
      // Let's stick to: Selected Date determines the context.

      // Actually, for a "Monthly Budget Planner", the summary should probably be for the MONTH of the selected date.
      // The transaction list could show the specific day's transactions if a day is selected.

      if (!selectedDate) return;

      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);

      // 1. Calculate Monthly Summary
      const monthlyTransactions = transactions.filter((t) => {
        if (!t.date) return false;
        const tDate = t.date.toDate();
        return isWithinInterval(tDate, { start: monthStart, end: monthEnd });
      });

      const income = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);
      const expense = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);
      setSummary({ income, expense, balance: income - expense });

      // 2. Filter List for the Selected Date (Specific Day)
      // If the user wants to see "Monthly" list, they might need a "Clear Selection" or "View Month" button.
      // For now, let's show transactions for the selected DAY to match "data related to it".
      const dailyTransactions = transactions.filter((t) => {
        if (!t.date) return false;
        return isSameDay(t.date.toDate(), selectedDate);
      });

      setFilteredTransactions(dailyTransactions);
    }
  }, [transactions, selectedDate]);

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><LoadingSpinner /></div>;

  if (!user) {
    return <LandingPage />;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance (Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.balance.toFixed(2)}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income (Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +${summary.income.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses (Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -${summary.expense.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-1">
        <motion.div variants={item}>
          <BigCalendar
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            transactions={transactions}
            className="min-h-[600px]"
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={item} className="space-y-8">
            <BudgetChart />
            <BudgetForm />
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                Transactions for {selectedDate?.toLocaleDateString()}
              </h2>
              <div className="space-x-2">
                <Button asChild variant="outline">
                  <Link href="/transactions/new?type=income">Add Income</Link>
                </Button>
                <Button asChild>
                  <Link href="/transactions/new?type=expense">Add Expense</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-md border bg-card">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No transactions found for this date.
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Description
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Category
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {filteredTransactions.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">{t.description}</td>
                          <td className="p-4 align-middle capitalize">{t.category}</td>
                          <td
                            className={`p-4 align-middle text-right font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
