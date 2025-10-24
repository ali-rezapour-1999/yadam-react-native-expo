import React from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody } from '@/components/ui/drawer';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { Box } from '@/components/ui/box';
import { useAppStore } from '@/store/authState/authState';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import CalenderIcon from '@/assets/Icons/CalenderIcon';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react-native';
import { Text } from '@/components/Themed';

interface MonthOption {
  value: string;
  labelEn: string;
  labelFa: string;
}

interface GregorianYearCalendarProps {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

const gregorianMonths: MonthOption[] = [
  { value: '1', labelEn: 'January', labelFa: 'ژانویه' },
  { value: '2', labelEn: 'February', labelFa: 'فوریه' },
  { value: '3', labelEn: 'March', labelFa: 'مارس' },
  { value: '4', labelEn: 'April', labelFa: 'آوریل' },
  { value: '5', labelEn: 'May', labelFa: 'می' },
  { value: '6', labelEn: 'June', labelFa: 'ژوئن' },
  { value: '7', labelEn: 'July', labelFa: 'جولای' },
  { value: '8', labelEn: 'August', labelFa: 'آگوست' },
  { value: '9', labelEn: 'September', labelFa: 'سپتامبر' },
  { value: '10', labelEn: 'October', labelFa: 'اکتبر' },
  { value: '11', labelEn: 'November', labelFa: 'نوامبر' },
  { value: '12', labelEn: 'December', labelFa: 'دسامبر' },
];

const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekDaysFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

const generateMonthDays = (year: number, month: number) => {
  const firstDay = moment(`${year}-${month}-01`, 'YYYY-M-D');
  const daysInMonth = firstDay.daysInMonth();
  const startDayOfWeek = firstDay.day();

  const days: (number | null)[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

const GregorianYearCalendar: React.FC<GregorianYearCalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const { language } = useAppStore();
  const [showDrawer, setShowDrawer] = React.useState(false);

  const currentMonth = moment().month() + 1;
  const [selectedMonth, setSelectedMonth] = React.useState<string>(currentMonth.toString());
  const [selectedYear, setSelectedYear] = React.useState<number>(moment().year());

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
    setSelectedMonth((moment().month() + 1).toString());
    setSelectedYear(moment().year());
  }, []);

  const handleDrawerOpen = React.useCallback(() => {
    setSelectedMonth((moment().month() + 1).toString());
    setSelectedYear(moment().year());
    setShowDrawer(true);
  }, []);

  const selectedMonthLabel = React.useMemo(() => {
    return gregorianMonths.find((m) => m.value === selectedMonth);
  }, [selectedMonth]);

  const monthDays = React.useMemo(() => {
    return generateMonthDays(selectedYear, parseInt(selectedMonth));
  }, [selectedYear, selectedMonth]);

  const handleDayPress = React.useCallback((day: number) => {
    const dateStr = moment(`${selectedYear}-${selectedMonth}-${day}`, 'YYYY-M-D').format('YYYY-MM-DD');
    setSelectedDate(dateStr);
    setShowDrawer(false);
  }, [selectedYear, selectedMonth, setSelectedDate]);

  const buttonText = React.useMemo(() => {
    if (selectedDate) {
      const date = moment(selectedDate);
      const monthName = gregorianMonths[date.month()];
      return `${date.format('YYYY/MM/DD')} - ${language === 'fa' ? monthName.labelFa : monthName.labelEn}`;
    }
    return t('select_date');
  }, [selectedDate, language]);

  const weekDays = language === 'fa' ? weekDaysFa : weekDaysEn;

  return (
    <>
      <Button onPress={handleDrawerOpen}
        style={{ backgroundColor: Colors.main.primary + 30, borderColor: Colors.main.primary, borderWidth: 2 }}
        className="rounded-lg h-[48px] w-full justify-between px-8 mt-3"
      >
        <ButtonText className='text-lg'>
          {buttonText}
        </ButtonText>
        <CalenderIcon />
      </Button>

      <Drawer isOpen={showDrawer} onClose={handleDrawerClose} size="lg" anchor="bottom" className="bg-black/80 border-0">
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.main.cardBackground }} className="h-max rounded-t-[40px] border-0">
          <DrawerHeader className="justify-center py-1">
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
          </DrawerHeader>

          <DrawerBody>
            <ScrollView showsVerticalScrollIndicator={false}>
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

                      const dateStr = moment(`${selectedYear}-${selectedMonth}-${day}`, 'YYYY-M-D').format('YYYY-MM-DD');
                      const isSelected = dateStr === selectedDate;
                      const isToday = moment().isSame(moment(dateStr), 'day');

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
            </ScrollView>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
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

export default GregorianYearCalendar;
