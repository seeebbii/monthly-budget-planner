"use client";

import * as React from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Transaction } from "@/services/transactionService";

interface BigCalendarProps {
    className?: string;
    selectedDate: Date | undefined;
    onSelectDate: (date: Date) => void;
    transactions: Transaction[];
}

export function BigCalendar({
    className,
    selectedDate,
    onSelectDate,
    transactions,
}: BigCalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    // Synchronize currentMonth with selectedDate if it changes externally (optional, but good for UX)
    React.useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(selectedDate);
        }
    }, [selectedDate]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDailyStats = (date: Date) => {
        const dailyTransactions = transactions.filter(t =>
            t.date && isSameDay(t.date.toDate(), date)
        );

        const income = dailyTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = dailyTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        return { income, expense, count: dailyTransactions.length };
    };

    return (
        <div className={cn("flex flex-col h-full bg-card rounded-lg shadow-sm border", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-2xl font-bold text-primary">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b bg-muted/30">
                {weekDays.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {calendarDays.map((day, dayIdx) => {
                    const stats = getDailyStats(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onSelectDate(day)}
                            className={cn(
                                "min-h-[120px] p-2 border-b border-r relative transition-colors cursor-pointer hover:bg-muted/50",
                                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                                isSelected && "bg-primary/5 ring-2 ring-inset ring-primary",
                                dayIdx % 7 === 0 && "border-l-0", // Remove left border for first col if needed (grid handles this mostly)
                                dayIdx % 7 === 6 && "border-r-0"  // Remove right border for last col
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span
                                    className={cn(
                                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                        isDayToday && "bg-primary text-primary-foreground",
                                        !isDayToday && isSelected && "text-primary font-bold"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                            </div>

                            {/* Daily Stats Indicators */}
                            <div className="mt-2 space-y-1">
                                {stats.income > 0 && (
                                    <div className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium truncate">
                                        +${stats.income.toFixed(0)}
                                    </div>
                                )}
                                {stats.expense > 0 && (
                                    <div className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium truncate">
                                        -${stats.expense.toFixed(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
