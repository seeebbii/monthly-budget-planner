"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToBudgets, Budget } from "@/services/budgetService";
import { subscribeToTransactions, Transaction } from "@/services/transactionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function BudgetChart() {
    const { user } = useAuth();
    const [data, setData] = useState<{ name: string; budget: number; actual: number }[]>([]);

    useEffect(() => {
        if (!user) return;

        const currentMonth = new Date().toISOString().slice(0, 7);

        // We need to combine data from two subscriptions. 
        // For simplicity, we'll just set up listeners and merge in a local effect or function.
        // A more robust solution might use a combined store or context.

        let budgets: Budget[] = [];
        let transactions: Transaction[] = [];

        const updateData = () => {
            const categoryMap = new Map<string, { budget: number; actual: number }>();

            budgets.forEach((b) => {
                if (!categoryMap.has(b.category)) {
                    categoryMap.set(b.category, { budget: 0, actual: 0 });
                }
                categoryMap.get(b.category)!.budget += b.amount;
            });

            transactions.forEach((t) => {
                if (t.type === "expense") {
                    const cat = t.category;
                    if (!categoryMap.has(cat)) {
                        categoryMap.set(cat, { budget: 0, actual: 0 });
                    }
                    categoryMap.get(cat)!.actual += t.amount;
                }
            });

            const chartData = Array.from(categoryMap.entries()).map(([name, values]) => ({
                name,
                budget: values.budget,
                actual: values.actual,
            }));

            setData(chartData);
        };

        const unsubBudgets = subscribeToBudgets(user.uid, currentMonth, (b) => {
            budgets = b;
            updateData();
        });

        const unsubTransactions = subscribeToTransactions(user.uid, (t) => {
            // Filter for current month transactions only
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            transactions = t.filter(trans => {
                const d = trans.date.toDate();
                return d >= startOfMonth && d <= endOfMonth;
            });
            updateData();
        });

        return () => {
            unsubBudgets();
            unsubTransactions();
        };
    }, [user]);

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Budget vs Actuals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Set a budget to see the comparison chart.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget vs Actuals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                            />
                            <Legend />
                            <Bar dataKey="budget" name="Budget" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" name="Actual" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
