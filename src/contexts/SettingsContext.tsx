"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = {
    code: string;
    symbol: string;
    name: string;
};

export const CURRENCIES: Currency[] = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

interface SettingsContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    isSettingsOpen: boolean;
    toggleSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("flowfunds_currency");
        if (saved) {
            try {
                setCurrency(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved currency", e);
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("flowfunds_currency", JSON.stringify(currency));
        }
    }, [currency, mounted]);

    const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

    return (
        <SettingsContext.Provider
            value={{
                currency,
                setCurrency,
                isSettingsOpen,
                toggleSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
