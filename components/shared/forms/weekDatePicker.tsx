import React, { memo } from 'react';
import GregorianCalendar from '../datePicker/gregorianCalender';
import JalaliCalendar from '../datePicker/jalaliCalendar';
import { useAppStore } from '@/store/appState';

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  year: string;
  month: number | string;
}

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  const { language } = useAppStore();

  if (language === 'fa') {
    return <JalaliCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} year={year} month={month} />;
  }

  return <GregorianCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} year={year} month={month} />;
});

WeeklyDatePicker.displayName = 'WeeklyDatePicker';

export default WeeklyDatePicker;
