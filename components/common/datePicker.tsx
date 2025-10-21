import DateTimePicker from '@react-native-community/datetimepicker';
import { ControllerRenderProps, Path } from 'react-hook-form';
import { useAppStore } from '@/store/appState';
import YearCalendar from '../shared/forms/yearCalender';

interface DatePickerProps<T extends Record<string, any>> {
  field: ControllerRenderProps<T, Path<T>>;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
}

const DatePicker = <T extends Record<string, any>>({ field, showDatePicker }: DatePickerProps<T>) => {

  return (
    <>
      {showDatePicker && (
        <YearCalendar selectedDate={field.value} setSelectedDate={field.onChange} />
      )}
    </>
  );
};

export default DatePicker;
