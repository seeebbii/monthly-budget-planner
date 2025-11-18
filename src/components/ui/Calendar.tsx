"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={className}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-6", // Increased spacing
                caption: "flex justify-center pt-1 relative items-center mb-4", // Added margin bottom
                caption_label: "text-lg font-semibold text-foreground", // Larger font
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-full transition-all", // Rounded buttons
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex mb-2", // Added margin bottom
                head_cell:
                    "text-muted-foreground rounded-md w-12 font-medium text-[0.9rem] uppercase tracking-wider", // Wider cells, uppercase
                row: "flex w-full mt-2 justify-between", // Justify between for spacing
                cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-all flex items-center justify-center", // Rounded full, larger touch target
                day_range_end: "day-range-end",
                day_selected:
                    "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white shadow-md", // Calendly blue
                day_today: "bg-muted text-foreground font-semibold",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />, // Larger icons
                IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
            }}
            {...props}
        />
    );
}
