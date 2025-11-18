import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Budget {
    id?: string;
    userId: string;
    category: string;
    amount: number;
    month: string; // YYYY-MM format
    createdAt: Timestamp;
}

const COLLECTION_NAME = "budgets";

export const setBudget = async (budget: Omit<Budget, "id" | "createdAt">) => {
    try {
        // Check if budget exists for this category and month
        // For simplicity in this MVP, we'll just add a new one or the user can manage duplicates.
        // Ideally we'd upsert.
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...budget,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error setting budget: ", error);
        throw error;
    }
};

export const subscribeToBudgets = (userId: string, month: string, callback: (budgets: Budget[]) => void) => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        where("month", "==", month)
    );

    return onSnapshot(q, (snapshot) => {
        const budgets = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Budget[];
        callback(budgets);
    });
};
