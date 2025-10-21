import React, { useEffect, useMemo, Suspense, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import jalaliMoment from 'jalali-moment';
import { t } from 'i18next';

// UI Components
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import { Icon } from '@/components/ui/icon';
import { FolderSync } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Common Components
import AppModal from '@/components/common/appModal';
import { Loading } from '@/components/common/loading';
import WeeklyDatePicker from '@/components/shared/forms/weekDatePicker';
import JalaliYearCalendar from '@/components/shared/datePicker/jalaliYearCalnder';

// Stores & Hooks
import { useTodoStore } from '@/store/todoState';
import { useAppStore } from '@/store/appState';
import { useDateTime } from '@/hooks/useDateTime';

// Lazy Load Components
const TaskListView = React.lazy(() => import('@/components/shared/taskListView'));

/**
 * ------------------------------------------------------------
 * Header Component
 * ------------------------------------------------------------
 */

const HeaderComponent = React.memo(
  ({
    selectedDate,
    setDateTimeSelectedDate,
    shouldShowTodayButton,
    goToToday,
    isToday,
    displayDate,
  }: any) => {
    const { setSelectedDate } = useTodoStore();
    const { syncDataFromServer, isLoading, token } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setSelectedDate(selectedDate);
    }, [selectedDate, setSelectedDate]);

    const handleSync = useCallback(async () => {
      await syncDataFromServer();
      setIsOpen(false);
    }, [syncDataFromServer]);

    return (
      <SafeAreaView style={styles.headerContainer}>
        {/* Header Title and Sync */}
        <HStack className="justify-between items-center">
          <Heading style={styles.headerTitle}>{t('todos.todo_list')}</Heading>
          {token && (
            <AppModal
              title={t('todos.sync_data')}
              buttonContent={<Icon as={FolderSync} size="2xl" color={Colors.main.info} />}
              buttonStyle={styles.syncButton}
              modalBodyStyle={{ paddingHorizontal: 10 }}
              visible={isOpen}
              onChangeVisible={setIsOpen}
            >
              <Text style={styles.syncDescription}>{t('todos.sync_data_description')}</Text>
              <Button onPress={handleSync} style={styles.syncConfirmButton}>
                {isLoading ? (
                  <Loading style={{ backgroundColor: 'transparent' }} />
                ) : (
                  <ButtonText style={styles.syncConfirmText}>{t('common.button.confirm')}</ButtonText>
                )}
              </Button>
            </AppModal>
          )}
        </HStack>

        {/* Year / Month Selectors */}
        <VStack className="mt-5">
          <HStack className="items-center">
            <JalaliYearCalendar selectedDate={selectedDate as string} setSelectedDate={setDateTimeSelectedDate} />
          </HStack>

          {/* Weekly Picker */}
          <WeeklyDatePicker
            selectedDate={selectedDate as string}
            setSelectedDate={setDateTimeSelectedDate}
          />

          {shouldShowTodayButton && (
            <Box className="items-center mt-3">
              <Button onPress={goToToday} style={styles.todayButton} className='rounded-lg'>
                <ButtonText style={styles.todayButtonText}>{t('todos.go_to_today')}</ButtonText>
              </Button>
            </Box>
          )}
        </VStack>

        {/* Date Summary */}
        <HStack className="items-center justify-between mt-5 pb-3">
          <Text>{isToday ? t('todos.today') : t('todos.select_date')}</Text>
          <Text>{displayDate}</Text>
        </HStack>
      </SafeAreaView>
    );
  }
);

/**
 * ------------------------------------------------------------
 * Main Todos Screen
 * ------------------------------------------------------------
 */

const Todos = () => {
  const { loadTasks } = useTodoStore();
  const { setSelectedMonth, selectedDate, setSelectedDate, isCurrentMonth, isToday, goToToday, } = useDateTime();
  const { calender } = useAppStore();

  useEffect(() => {
    if (selectedDate) loadTasks(selectedDate);
  }, [selectedDate, loadTasks]);

  const weekComparison = useMemo(() => {
    if (!selectedDate) return { isCurrentWeek: false };
    const selectedWeekStart = jalaliMoment.utc(selectedDate, 'YYYY-MM-DD').startOf('week');
    const todayWeekStart = jalaliMoment.utc().startOf('week');
    return { isCurrentWeek: selectedWeekStart.isSame(todayWeekStart, 'day') };
  }, [selectedDate]);

  const shouldShowTodayButton = !weekComparison.isCurrentWeek || !isCurrentMonth || !isToday;

  const displayDate = useMemo(() => {
    if (!selectedDate) return '-';
    const moment = jalaliMoment.utc(selectedDate, 'YYYY-MM-DD');
    return calender === 'jalali' ? moment.format('jYYYY/jMM/jDD') : moment.format('YYYY/MM/DD');
  }, [calender, selectedDate]);

  return (
    <Box style={styles.pageContainer}>
      <HeaderComponent
        setSelectedMonth={setSelectedMonth}
        selectedDate={selectedDate}
        setDateTimeSelectedDate={setSelectedDate}
        shouldShowTodayButton={shouldShowTodayButton}
        goToToday={goToToday}
        isToday={isToday}
        displayDate={displayDate}
      />

      {/* Task List */}
      <Suspense fallback={<Loading />}>
        <TaskListView mode="grouped" />
      </Suspense>
    </Box>
  );
};

export default Todos;

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  headerContainer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: Colors.main.background,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: Colors.main.primaryDark,
    fontSize: 26,
  },
  syncButton: {
    backgroundColor: 'transparent',
    height: 40,
    width: 45,
  },
  syncDescription: {
    color: Colors.main.textPrimary,
    fontSize: 18,
    textAlign: 'center',
  },
  syncConfirmButton: {
    backgroundColor: Colors.main.info,
    borderRadius: 8,
    marginTop: 20,
  },
  syncConfirmText: {
    color: Colors.main.textPrimary,
    fontSize: 14,
  },
  todayButton: {
    backgroundColor: Colors.main.cardBackground,
  },
  todayButtonText: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
});
