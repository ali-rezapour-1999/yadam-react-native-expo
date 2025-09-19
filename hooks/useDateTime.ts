import { useState, useEffect, useCallback, useMemo } from 'react';
import jalaliMoment from 'jalali-moment';
import { useAppStore } from '@/store/appState';

const dateCalculationCache = new Map<string, any>();

interface UseDateTimeReturn {
  selectedYear: string | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMonth: string | null;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  today: any;
  todayFormatted: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  goToToday: () => void;
  resetToCurrentMonth: () => void;
}

const getCachedToday = (calender: string) => {
  const cacheKey = `today-${calender}-${new Date().toDateString()}`;
  if (dateCalculationCache.has(cacheKey)) {
    return dateCalculationCache.get(cacheKey);
  }

  const today = jalaliMoment.utc();
  const result = {
    moment: today,
    formatted: today.format('YYYY-MM-DD'),
    year: calender === 'jalali' ? today.jYear().toString() : today.year().toString(),
    month: calender === 'jalali' ? (today.jMonth() + 1).toString() : (today.month() + 1).toString(),
  };

  setTimeout(() => dateCalculationCache.delete(cacheKey), 60 * 60 * 1000);
  dateCalculationCache.set(cacheKey, result);

  return result;
};

export const useDateTime = (): UseDateTimeReturn => {
  const { calender } = useAppStore();
  const todayValues = useMemo(() => getCachedToday(calender), [calender]);
  const [selectedYear, setSelectedYear] = useState<string | null>(todayValues.year);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(todayValues.month);
  const [selectedDate, setSelectedDate] = useState<string | null>(todayValues.formatted);

  const isCurrentMonth = useMemo(() => {
    return selectedYear === todayValues.year && selectedMonth === todayValues.month;
  }, [selectedYear, selectedMonth, todayValues.year, todayValues.month]);

  const isToday = useMemo(() => {
    return selectedDate === todayValues.formatted;
  }, [selectedDate, todayValues.formatted]);

  const goToToday = useCallback(() => {
    const currentTodayValues = getCachedToday(calender);
    setSelectedYear(currentTodayValues.year);
    setSelectedMonth(currentTodayValues.month);
    setSelectedDate(currentTodayValues.formatted);
  }, [calender]);

  const resetToCurrentMonth = useCallback(() => {
    const currentTodayValues = getCachedToday(calender);
    setSelectedYear(currentTodayValues.year);
    setSelectedMonth(currentTodayValues.month);
  }, [calender]);

  const optimizedSetSelectedDate = useCallback((date: string) => {
    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.warn('Invalid date format:', date);
      return;
    }
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    const newTodayValues = getCachedToday(calender);
    setSelectedYear(newTodayValues.year);
    setSelectedMonth(newTodayValues.month);
    setSelectedDate(newTodayValues.formatted);
  }, [calender]);

  useEffect(() => {
    return () => {
      const now = Date.now();
      for (const [key, value] of dateCalculationCache.entries()) {
        if (value.timestamp && now - value.timestamp > 60 * 60 * 1000) {
          dateCalculationCache.delete(key);
        }
      }
    };
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate: optimizedSetSelectedDate,
    today: todayValues.moment,
    todayFormatted: todayValues.formatted,
    isCurrentMonth,
    isToday,
    goToToday,
    resetToCurrentMonth,
  };
};
