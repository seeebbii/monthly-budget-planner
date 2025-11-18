"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSettings, CURRENCIES } from "@/contexts/SettingsContext";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SettingsSidebar() {
    const { isSettingsOpen, toggleSettings, currency, setCurrency } = useSettings();

    return (
        <AnimatePresence>
            {isSettingsOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSettings}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-background border-l z-50 shadow-2xl p-6 flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                <h2 className="text-xl font-bold">Settings</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={toggleSettings}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Preferences
                                </h3>

                                <Card className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Currency
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {CURRENCIES.map((c) => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => setCurrency(c)}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${currency.code === c.code
                                                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                                            : "hover:bg-muted hover:border-muted-foreground/50"
                                                        }`}
                                                >
                                                    <span className="text-lg font-bold">{c.symbol}</span>
                                                    <span className="text-xs text-muted-foreground">{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t text-center text-sm text-muted-foreground">
                            <p>FlowFunds v1.0</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
