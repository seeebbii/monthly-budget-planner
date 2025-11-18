"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addTransaction } from "@/services/transactionService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Timestamp } from "firebase/firestore";

const CATEGORIES = {
    income: ["Salary", "Freelance", "Investments", "Other"],
    expense: [
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
    ],
};

export function TransactionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type") as "income" | "expense" | null;
    const { user } = useAuth();

    const [type, setType] = useState<"income" | "expense">(typeParam || "expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await addTransaction({
                userId: user.uid,
                type,
                amount: parseFloat(amount),
                description,
                category: category || "Other",
                date: Timestamp.fromDate(new Date(date)),
            });
            router.push("/");
        } catch (error) {
            console.error("Error adding transaction", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Add {type === "income" ? "Income" : "Expense"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4 mb-4">
                        <Button
                            type="button"
                            variant={type === "income" ? "default" : "outline"}
                            onClick={() => setType("income")}
                            className="w-full"
                        >
                            Income
                        </Button>
                        <Button
                            type="button"
                            variant={type === "expense" ? "default" : "outline"}
                            onClick={() => setType("expense")}
                            className="w-full"
                        >
                            Expense
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Monthly Salary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {CATEGORIES[type].map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Transaction"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
