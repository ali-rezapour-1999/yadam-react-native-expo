import React from 'react';
import { Button } from '@/components/ui/button';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { TouchableOpacity, StyleSheet } from 'react-native';
import jalaliMoment from 'jalali-moment';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { Text } from '@/components/Themed';
import { useBaseStore } from '@/store/baseState/base';
import AppDrawer from '@/components/common/appDrower';

interface MonthOption {
  value: string;
  labelEn: string;
  labelFa: string;
}

interface JalaliYearCalendarProps {
  selectedDate: string | null;
  setSelectedDateTime: (date: string) => void;
}

const jalaliMonths: MonthOption[] = [
  { value: '1', labelEn: 'Farvardin', labelFa: 'فروردین' },
  { value: '2', labelEn: 'Ordibehesht', labelFa: 'اردیبهشت' },
  { value: '3', labelEn: 'Khordad', labelFa: 'خرداد' },
  { value: '4', labelEn: 'Tir', labelFa: 'تیر' },
  { value: '5', labelEn: 'Mordad', labelFa: 'مرداد' },
  { value: '6', labelEn: 'Shahrivar', labelFa: 'شهریور' },
  { value: '7', labelEn: 'Mehr', labelFa: 'مهر' },
  { value: '8', labelEn: 'Aban', labelFa: 'آبان' },
  { value: '9', labelEn: 'Azar', labelFa: 'آذر' },
  { value: '10', labelEn: 'Dey', labelFa: 'دی' },
  { value: '11', labelEn: 'Bahman', labelFa: 'بهمن' },
  { value: '12', labelEn: 'Esfand', labelFa: 'اسفند' },
];

const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const generateMonthDays = (year: number, month: number) => {
  const firstDay = jalaliMoment(`${year}/${month}/01`, 'jYYYY/jM/jD');
  const daysInMonth = firstDay.jDaysInMonth();
  const startDayOfWeek = firstDay.day();

  const iranianDayOfWeek = (startDayOfWeek + 1) % 7;
  const days: (number | null)[] = [];

  for (let i = 0; i < iranianDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

const JalaliYearCalendar: React.FC<JalaliYearCalendarProps> = ({ selectedDate, setSelectedDateTime }) => {
  const { language, setSelectedDate } = useBaseStore()
  const [showDrawer, setShowDrawer] = React.useState(false);

  const currentJalaliMonth = jalaliMoment().jMonth() + 1;
  const [selectedMonth, setSelectedMonth] = React.useState<string>(currentJalaliMonth.toString());
  const [selectedYear, setSelectedYear] = React.useState<number>(jalaliMoment().jYear());

  const handlePreviousMonth = React.useCallback(() => {
    setSelectedMonth((prev) => {
      const currentMonth = parseInt(prev);
      if (currentMonth === 1) {
        setSelectedYear(y => y - 1);
        return '12';
      }
      return (currentMonth - 1).toString();
    });
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setSelectedMonth((prev) => {
      const currentMonth = parseInt(prev);
      if (currentMonth === 12) {
        setSelectedYear(y => y + 1);
        return '1';
      }
      return (currentMonth + 1).toString();
    });
  }, []);

  const handleDrawerClose = React.useCallback(() => {
    setShowDrawer(false);
    setSelectedMonth(jalaliMoment().jMonth() + 1 + '');
    setSelectedYear(jalaliMoment().jYear());
  }, []);

  const handleDrawerOpen = React.useCallback(() => {
    setSelectedMonth(jalaliMoment().jMonth() + 1 + '');
    setSelectedYear(jalaliMoment().jYear());
    setShowDrawer(true);
  }, []);

  const selectedMonthLabel = React.useMemo(() => {
    return jalaliMonths.find((m) => m.value === selectedMonth);
  }, [selectedMonth]);

  const monthDays = React.useMemo(() => {
    return generateMonthDays(selectedYear, parseInt(selectedMonth));
  }, [selectedYear, selectedMonth]);

  const handleDayPress = React.useCallback((day: number) => {
    const dateStr = jalaliMoment(`${selectedYear}/${selectedMonth}/${day}`, 'jYYYY/jM/jD').format('YYYY-MM-DD');
    setSelectedDateTime(dateStr);
    setSelectedDate(dateStr);
    setShowDrawer(false);
  }, [selectedYear, selectedMonth, setSelectedDate, setSelectedDateTime]);

  const buttonText = React.useMemo(() => {
    if (selectedDate) {
      const jDate = jalaliMoment(selectedDate);
      const monthName = jalaliMonths[jDate.jMonth()];
      return `${jDate.format('jYYYY/jMM/jDD')} - ${language === 'fa' ? monthName.labelFa : monthName.labelEn}`;
    }
    return t('select_date');
  }, [selectedDate, language]);

  return (
    <AppDrawer showHeaderButton={false} showHeader={false} trigger={
      <HStack className='w-full flex items-center justify-between'>
        <Text className='text-lg'>{buttonText}</Text>
        <CalenderIcon />
      </HStack>
    }
      isOpen={showDrawer}
      onToggle={showDrawer ? handleDrawerClose : handleDrawerOpen}
      contentStyle={{ padding: 20, paddingBottom: 40 }}
      triggerStyle={{ backgroundColor: Colors.main.button + 60, borderWidth: 1, borderColor: Colors.main.button, padding: 10 }}
    >
      <VStack className="items-center gap-2 ">
        <HStack className="items-center gap-10">
          <Button onPress={handlePreviousMonth} className="rounded-lg" style={{ backgroundColor: Colors.main.border, height: 40 }}>
            <Icon as={language === 'en' ? ArrowLeftIcon : ArrowRightIcon} size="xl" color={Colors.main.textPrimary} />
          </Button>

          <Text style={{ fontSize: 18, color: Colors.main.textPrimary, minWidth: 100, textAlign: 'center' }}>
            {language === 'fa' ? selectedMonthLabel?.labelFa : selectedMonthLabel?.labelEn} {selectedYear}
          </Text>

          <Button onPress={handleNextMonth} className="rounded-lg" style={{ backgroundColor: Colors.main.border, height: 40 }}>
            <Icon as={language === 'en' ? ArrowRightIcon : ArrowLeftIcon} size="xl" color={Colors.main.textPrimary} />
          </Button>
        </HStack>
      </VStack>

      <VStack className="items-center space-y-4">
        <Box style={styles.calendarContainer}>
          <Box style={styles.weekHeader}>
            {weekDays.map((day, index) => (
              <Box key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </Box>
            ))}
          </Box>

          <Box style={styles.daysContainer}>
            {monthDays.map((day, index) => {
              if (day === null) {
                return <Box key={`empty-${index}`} style={styles.dayCell} />;
              }

              const dateStr = jalaliMoment(`${selectedYear}/${selectedMonth}/${day}`, 'jYYYY/jM/jD').format('YYYY-MM-DD');
              const isSelected = dateStr === selectedDate;
              const isToday = jalaliMoment().isSame(jalaliMoment(dateStr), 'day');

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDayPress(day)}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDay,
                    isToday && !isSelected && styles.todayDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isToday && !isSelected && styles.todayDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Box>
        </Box>
      </VStack>
    </AppDrawer>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    marginTop: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingVertical: 8,
    backgroundColor: Colors.main.border,
    borderRadius: 12,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.main.textPrimary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  selectedDay: {
    backgroundColor: Colors.main.primaryDark,
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: Colors.main.primary,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: Colors.main.textSecondary,
  },
  selectedDayText: {
    color: Colors.main.textPrimary,
    fontWeight: 'bold',
  },
  todayDayText: {
    color: Colors.main.primary,
    fontWeight: '600',
  },
});

export default JalaliYearCalendar;
