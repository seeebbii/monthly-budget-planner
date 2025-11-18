import { TransactionForm } from "@/components/TransactionForm";
import { Suspense } from "react";

export default function NewTransactionPage() {
    return (
        <div className="py-8">
            <Suspense fallback={<div>Loading...</div>}>
                <TransactionForm />
            </Suspense>
        </div>
    );
}
