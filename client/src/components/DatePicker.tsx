import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DatePickerProps {
  selectedDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onDateSelect: (date: Date) => void;
  highlightRange?: boolean;
  rangeStart?: Date | null;
}

const DatePicker = ({ 
  selectedDate, 
  minDate, 
  maxDate, 
  onDateSelect,
  highlightRange = false,
  rangeStart = null
}: DatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([]);
  
  // Generate calendar days for the current month
  useEffect(() => {
    const days: Array<Date | null> = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add empty cells for days before first day of month
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      // Set the time to noon to avoid timezone issues
      date.setHours(12, 0, 0, 0);
      days.push(date);
    }
    
    setCalendarDays(days);
  }, [currentMonth]);
  
  // Go to previous month
  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    // Don't allow going before current month if minDate is today
    if (minDate && previousMonth.getMonth() < minDate.getMonth() && 
        previousMonth.getFullYear() <= minDate.getFullYear()) {
      return;
    }
    
    setCurrentMonth(previousMonth);
  };
  
  // Go to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    if (!date) return false;
    
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    
    return true;
  };
  
  // Check if date is in range
  const isDateInRange = (date: Date): boolean => {
    if (!highlightRange || !rangeStart || !date) return false;
    
    return date > rangeStart && (!selectedDate || date < selectedDate);
  };
  
  // Check if date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate || !date) return false;
    
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Check if date is the range start
  const isRangeStart = (date: Date): boolean => {
    if (!rangeStart || !date) return false;
    
    return date.getDate() === rangeStart.getDate() && 
           date.getMonth() === rangeStart.getMonth() && 
           date.getFullYear() === rangeStart.getFullYear();
  };
  
  return (
    <div className="date-picker w-72">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={goToPreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={goToNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <div 
            key={index} 
            className={`
              h-8 flex items-center justify-center text-sm rounded cursor-pointer
              ${!date ? 'invisible' : ''}
              ${!isDateSelectable(date!) ? 'text-neutral-300 cursor-not-allowed' : ''}
              ${isDateSelected(date!) ? 'bg-primary text-white' : ''}
              ${isRangeStart(date!) ? 'bg-primary text-white' : ''}
              ${isDateInRange(date!) ? 'bg-primary/10' : ''}
              ${isDateSelectable(date!) && !isDateSelected(date!) && !isRangeStart(date!) && !isDateInRange(date!) ? 'hover:bg-neutral-100' : ''}
            `}
            onClick={() => {
              if (date && isDateSelectable(date)) {
                onDateSelect(date);
              }
            }}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
