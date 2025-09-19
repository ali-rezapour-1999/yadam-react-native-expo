import React, { memo, useMemo, useRef, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import jalaliMoment from 'jalali-moment';
import { Text } from '@/components/Themed';

const ITEM_WIDTH = 55;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  year: string;
  month: number | string;
}

interface DayItem {
  date: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString('fa-IR', { weekday: 'short' });
};

const generateMonthDays = (year: number, month: number): DayItem[] => {
  const daysInMonth = jalaliMoment(`${year}-${month}-01`, 'jYYYY-jMM-jDD').jDaysInMonth();
  const todayStr = jalaliMoment().format('YYYY-MM-DD');

  const days: DayItem[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const m = jalaliMoment(`${year}-${month}-${d}`, 'jYYYY-jMM-jDD');
    days.push({
      date: m.format('YYYY-MM-DD'),
      dayNumber: d,
      dayName: getDayName(m.toDate()),
      isToday: m.format('YYYY-MM-DD') === todayStr,
    });
  }
  return days;
};

const JalaliCalendar = memo(({ selectedDate, setSelectedDate, year, month }: Props) => {
  const days = useMemo(() => generateMonthDays(parseInt(year), parseInt(month.toString())), [year, month]);

  const selectedIndex = useMemo(() => days.findIndex((d) => d.date === selectedDate), [days, selectedDate]);
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: selectedIndex,
        animated: true,
        viewPosition: -0.3,
      });
    }
  }, [selectedIndex]);

  const renderItem = useCallback(
    ({ item }: { item: DayItem }) => {
      const isSelected = item.date === selectedDate;
      return (
        <TouchableOpacity onPress={() => setSelectedDate(item.date)} style={[styles.dayItem, isSelected && styles.selectedDay, item.isToday && !isSelected && styles.todayDay]} activeOpacity={0.6}>
          <Text style={[styles.dayName, isSelected ? styles.selectedText : item.isToday ? styles.todayText : styles.dayNameText]}>{item.dayName}</Text>
          <Text style={[styles.dayNumber, isSelected ? styles.selectedText : styles.dayNumberText]}>{item.dayNumber}</Text>
          {item.isToday && !isSelected && <View style={styles.todayDot} />}
        </TouchableOpacity>
      );
    },
    [selectedDate],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
        }}
      />
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${((selectedIndex + 1) / days.length) * 100}%` }]} />
      </View>
    </View>
  );
});

export default JalaliCalendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
    direction: 'ltr',
    borderRadius: 16,
    paddingVertical: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  dayItem: {
    width: ITEM_WIDTH,
    height: 64,
    borderRadius: 12,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main.border,
  },
  selectedDay: {
    backgroundColor: Colors.main.primaryDark,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  todayDay: {
    borderColor: Colors.main.lightBlue,
    borderWidth: 1.5,
    backgroundColor: Colors.main.primaryDark + 60,
  },
  dayName: {
    fontSize: 10,
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
  },
  dayNumber: {
    fontSize: 17,
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
  progressBarBackground: {
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    marginTop: 8,
    marginHorizontal: 8,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.main.primaryDark,
    borderRadius: 2,
  },
});
