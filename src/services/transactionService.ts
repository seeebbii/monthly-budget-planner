import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Transaction {
    id?: string;
    userId: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: Timestamp;
    createdAt: Timestamp;
}

const COLLECTION_NAME = "transactions";

export const addTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...transaction,
            createdAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding transaction: ", error);
        throw error;
    }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, transaction);
    } catch (error) {
        console.error("Error updating transaction: ", error);
        throw error;
    }
};

export const deleteTransaction = async (id: string) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting transaction: ", error);
        throw error;
    }
};

export const subscribeToTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
    const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Transaction[];
        callback(transactions);
    });
};
