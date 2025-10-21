import React, { memo, useMemo, useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import jalaliMoment from 'jalali-moment';
import { Text } from '@/components/Themed';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SCREEN_WIDTH / 8.2;

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

interface DayItem {
  date: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
}

const getDayName = (date: jalaliMoment.Moment) => {
  return date.locale('fa').format('ddd');
};

const generateWeekDays = (newDate: string): DayItem[] => {
  const today = jalaliMoment(newDate);

  const currentDayOfWeek = today.day();

  const daysToSaturday = (currentDayOfWeek + 1) % 7;

  const startOfWeek = today.clone().subtract(daysToSaturday, 'days');

  const days: DayItem[] = [];

  for (let i = 0; i < 7; i++) {
    const m = startOfWeek.clone().add(i, 'day');
    days.push({
      date: m.format('YYYY-MM-DD'),
      dayNumber: parseInt(m.format('jD')),
      dayName: getDayName(m),
      isToday: m.isSame(today, 'day'),
    });
  }

  return days;
};

const JalaliWeekCalendar = memo(({ selectedDate, setSelectedDate }: Props) => {
  const days = useMemo(() => generateWeekDays(selectedDate!), [selectedDate]);


  const renderItem = useCallback(
    ({ item }: { item: DayItem }) => {
      const isSelected = item.date === selectedDate;
      return (
        <TouchableOpacity
          onPress={() => setSelectedDate(item.date)}
          style={[
            styles.dayItem,
            isSelected && styles.selectedDay,
            item.isToday && !isSelected && styles.todayDay,
          ]}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.dayName,
              isSelected ? styles.selectedText : item.isToday ? styles.todayText : styles.dayNameText,
            ]}>
            {item.dayName}
          </Text>
          <Text
            style={[
              styles.dayNumber,
              isSelected ? styles.selectedText : styles.dayNumberText,
            ]}>
            {item.dayNumber}
          </Text>
          {item.isToday && !isSelected && <View style={styles.todayDot} />}
        </TouchableOpacity>
      );
    },
    [selectedDate],
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{
          justifyContent: 'space-between',
          width: "100%",
        }}
      />
    </View>
  );
});

export default JalaliWeekCalendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
    direction: 'ltr',
    borderRadius: 16,
    padding: 4,
  },
  dayItem: {
    width: ITEM_WIDTH - 2,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main.border,
  },
  selectedDay: {
    backgroundColor: Colors.main.primaryDark,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  todayDay: {
    borderColor: Colors.main.background,
    borderWidth: 1,
    backgroundColor: Colors.main.primaryDark + 60,
  },
  dayName: {
    fontSize: 11,
    marginBottom: 2,
  },
  dayNameText: {
    color: Colors.main.textPrimary,
  },
  todayText: {
    color: Colors.main.textPrimary,
  },
  selectedText: {
    color: Colors.main.textPrimary,
    fontWeight: 'bold',
  },
  dayNumber: {
    fontSize: 16,
  },
  dayNumberText: {
    color: Colors.main.textSecondary,
  },
  todayDot: {
    marginTop: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.main.info,
  },
});
