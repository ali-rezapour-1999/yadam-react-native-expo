import React, { memo } from 'react';
import GregorianCalendar from '../datePicker/gregorianCalender';
import JalaliCalendar from '../datePicker/jalaliCalendar';
import { useAppStore } from '@/store/appState';

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const WeeklyDatePicker = memo(({ selectedDate, setSelectedDate }: Props) => {
  const { calender } = useAppStore();

  if (calender == 'jalali') {
    return <JalaliCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
  }

  return <GregorianCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
});

WeeklyDatePicker.displayName = 'WeeklyDatePicker';

export default WeeklyDatePicker;
