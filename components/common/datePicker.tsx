import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ControllerRenderProps, Path } from 'react-hook-form';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { useCallback } from 'react';
import { Button, ButtonText } from '../ui/button';
import { Icon } from '../ui/icon';
import { useAppStore } from '@/store/appState';
import jalaliMoment from 'jalali-moment';
import { t } from 'i18next';

interface DatePickerProps<T extends Record<string, any>> {
  field: ControllerRenderProps<T, Path<T>>;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
}

const DatePicker = <T extends Record<string, any>>({ field, setShowDatePicker, showDatePicker }: DatePickerProps<T>) => {
  const { calender } = useAppStore();

  const formatDate = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const getDisplayDate = useCallback(
    (gregorianDate: string) => {
      if (!gregorianDate) return null;
      const moment = jalaliMoment(gregorianDate, 'YYYY-MM-DD');
      return calender === 'jalali' ? moment.format('jYYYY/jMM/jDD') : moment.format('YYYY/MM/DD');
    },
    [calender],
  );

  return (
    <>
      <Button
        onPress={() => setShowDatePicker(true)}
        style={{ backgroundColor: Colors.main.primary + 30, borderColor: Colors.main.primary, borderWidth: 2 }}
        className="rounded-lg h-[48px] w-full justify-between px-8 mt-3"
      >
        <ButtonText style={{ color: Colors.main.primary }}>{field.value ? getDisplayDate(field.value) : t('todos.select_date')}</ButtonText>
        <Icon as={CalenderIcon} color={Colors.main.primary} />
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={field.value ? new Date(field.value) : new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              field.onChange(formatDate(selectedDate));
            }
          }}
        />
      )}
    </>
  );
};

export default DatePicker;
