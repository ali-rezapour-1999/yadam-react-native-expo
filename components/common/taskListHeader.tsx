import { Box } from '@/components/ui/box';
import React from 'react';
export const HeaderComponent = React.memo(
  ({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, selectedDate, setSelectedDate, shouldShowTodayButton, goToToday, isToday, displayDate }: any) => {
    return (
      <Box style={styles.container}>
        <HeaderPage title={t('todos.todo_list')} />

        <VStack className="mt-5">
          <HStack className="items-center justify-between mb-2">
            <Heading style={{ color: Colors.main.textSecondary, fontSize: 18 }}>{t('todos.day_of_week')}</Heading>
            <SelectYearWithMonth selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </HStack>

          <WeeklyDatePicker selectedDate={selectedDate as string} setSelectedDate={setSelectedDate} year={selectedYear ?? ''} month={selectedMonth ?? ''} />

          {shouldShowTodayButton && (
            <Box className="items-center mt-3">
              <Button variant="link" onPress={goToToday}>
                <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{t('todos.go_to_today')}</ButtonText>
              </Button>
            </Box>
          )}
        </VStack>

        <HStack className="items-center justify-between mb-2 mt-5 pb-3">
          <Heading style={{ color: Colors.main.textPrimary, fontSize: 20 }}>{isToday ? t('todos.today') : t('todos.select_date')}</Heading>
          <Heading style={{ color: Colors.main.textPrimary, fontSize: 16 }}>{displayDate}</Heading>
        </HStack>
      </Box>
    );
  },
);
