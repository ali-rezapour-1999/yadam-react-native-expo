import React, { useEffect, useMemo, Suspense, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useDateTime } from '@/hooks/useDateTime';
import { Box } from '@/components/ui/box';
import { useTodoStore } from '@/store/todoState';
import jalaliMoment from 'jalali-moment';
import { useAppStore } from '@/store/appState';
import { StyleSheet } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { t } from 'i18next';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/Themed';
import { Loading } from '@/components/common/loading';
import WeeklyDatePicker from '@/components/shared/forms/weekDatePicker';
import SelectYearWithMonth from '@/components/shared/forms/selectYearWithMonth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { FolderSync } from 'lucide-react-native';
import AppModal from '@/components/common/appModal';

const TaskListView = React.lazy(() => import('@/components/shared/taskListView'));

const HeaderComponent = React.memo(
  ({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setDateTimeSelectedDate, shouldShowTodayButton, goToToday, isToday, displayDate }: any) => {
    const { setSelectedDate } = useTodoStore();
    const { syncDataFromServer, isLoading } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setSelectedDate(selectedDate);
    }, [selectedDate]);

    const syncDataHandler = async () => {
      await syncDataFromServer().then(() => setIsOpen(false));
    }

    return (
      <SafeAreaView style={styles.container}>

        <HStack className="justify-between">
          <Heading style={{ color: Colors.main.primaryDark, fontSize: 26 }}>{t('todos.todo_list')}</Heading>
          <AppModal title={t("todos.sync_data")} buttonContent={<Icon as={FolderSync} size="2xl" color={Colors.main.textPrimary} />} buttonStyle={{ backgroundColor: Colors.main.button }} onCloseProps={() => setIsOpen(!isOpen)} modalBodyStyle={{ paddingHorizontal: 20 }} isOpenProps={isOpen}>
            <Text style={{ color: Colors.main.textPrimary, fontSize: 18, textAlign: 'center' }}>{t('todos.sync_data_description')}</Text>
            <Button onPress={syncDataHandler} style={{ backgroundColor: Colors.main.button }} className='rounded-md mt-5'>
              {isLoading ? <Loading style={{ backgroundColor: 'transparent' }} /> : <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 14 }}>{t('button.accept')}</ButtonText>}
            </Button>
          </AppModal>

        </HStack>

        <VStack className="mt-5">
          <HStack className="items-center justify-between mb-2">
            <Text>{t('todos.day_of_week')}</Text>
            <SelectYearWithMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </HStack>

          <WeeklyDatePicker selectedDate={selectedDate as string} setSelectedDate={setDateTimeSelectedDate} year={selectedYear} month={selectedMonth} />

          {shouldShowTodayButton && (
            <Box className="items-center mt-3">
              <Button onPress={goToToday} style={{ backgroundColor: Colors.main.cardBackground }} className='rounded-lg'>
                <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{t('todos.go_to_today')}</ButtonText>
              </Button>
            </Box>
          )}
        </VStack>

        <HStack className="items-center justify-between mb-2 mt-5 pb-3">
          <Text>{isToday ? t('todos.today') : t('todos.select_date')}</Text>
          <Text>{displayDate}</Text>
        </HStack>
      </SafeAreaView>
    );
  },
);

const Todos = () => {
  const { loadTasks } = useTodoStore();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate, isCurrentMonth, isToday, goToToday } = useDateTime();
  const { calender } = useAppStore();

  useEffect(() => {
    if (selectedDate) loadTasks(selectedDate);
  }, [selectedDate]);

  const weekComparison = useMemo(() => {
    if (!selectedDate) return { isCurrentWeek: false };
    const selectedWeekStart = jalaliMoment.utc(selectedDate, 'YYYY-MM-DD').startOf('week');
    const todayWeekStart = jalaliMoment.utc().startOf('week');
    return { isCurrentWeek: selectedWeekStart.isSame(todayWeekStart, 'day') };
  }, [selectedDate]);

  const shouldShowTodayButton = !weekComparison.isCurrentWeek || !isCurrentMonth || !isToday;

  const displayDate = useMemo(() => {
    if (!selectedDate) return '-';
    try {
      const moment = jalaliMoment.utc(selectedDate, 'YYYY-MM-DD');
      return calender === 'jalali' ? moment.format('jYYYY/jMM/jDD') : moment.format('YYYY/MM/DD');
    } catch {
      return '-';
    }
  }, [calender, selectedDate]);

  return (
    <Box style={{ flex: 1, backgroundColor: Colors.main.background }}>
      <HeaderComponent
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDate={selectedDate}
        setDateTimeSelectedDate={setSelectedDate}
        shouldShowTodayButton={shouldShowTodayButton}
        goToToday={goToToday}
        isToday={isToday}
        displayDate={displayDate}
      />
      <VStack className="px-5">
        <Suspense fallback={<Loading />}>
          <TaskListView mode="grouped" />
        </Suspense>
      </VStack>
    </Box>
  );
};

export default Todos;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
