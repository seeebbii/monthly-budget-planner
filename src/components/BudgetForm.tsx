"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { setBudget } from "@/services/budgetService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const CATEGORIES = [
    "Housing",
    "Transportation",
    "Food",
    "Utilities",
    "Insurance",
    "Healthcare",
    "Savings",
    "Personal",
    "Entertainment",
    "Other",
];

export function BudgetForm() {
    const { user } = useAuth();
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
            await setBudget({
                userId: user.uid,
                category,
                amount: parseFloat(amount),
                month: currentMonth,
            });
            setAmount("");
            // Optional: Show success message
        } catch (error) {
            console.error("Error setting budget", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Set Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Limit</label>
                        <Input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        Set
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
