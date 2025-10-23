import { ControllerRenderProps, Path } from 'react-hook-form';
import YearCalendar from '../shared/forms/yearCalender';

interface DatePickerProps<T extends Record<string, any>> {
  field: ControllerRenderProps<T, Path<T>>;
}

const DatePicker = <T extends Record<string, any>>({ field }: DatePickerProps<T>) => {

  return <YearCalendar selectedDate={field.value} setSelectedDate={field.onChange} />
};

export default DatePicker;
