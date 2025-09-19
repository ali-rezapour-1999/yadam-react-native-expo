import { Colors } from '@/constants/Colors';
import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const ITEM_WIDTH = 55;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  year: number | string;
  month: number | string;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

interface DayItem {
  date: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
}

const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateMonthDays = (year: number, month: number): DayItem[] => {
  const daysCount = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = getDateStr(today);
  const days: DayItem[] = [];

  for (let d = 1; d <= daysCount; d++) {
    const dateObj = new Date(year, month - 1, d);
    const dateStr = getDateStr(dateObj);
    days.push({
      date: dateStr,
      dayNumber: d,
      dayName: getDayName(dateObj),
      isToday: dateStr === todayStr,
    });
  }
  return days;
};

const GregorianCalendar: React.FC<Props> = ({ year, month, selectedDate, setSelectedDate }) => {
  const days = useMemo(() => generateMonthDays(parseInt(year.toString()), parseInt(month.toString())), [year, month]);
  const selectedIndex = useMemo(() => days.findIndex((d) => d.date === selectedDate), [days, selectedDate]);
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: selectedIndex,
          animated: true,
          viewPosition: -0.2,
        });
      }, 100);
    }
  }, [selectedIndex]);

  const renderItem = useCallback(
    ({ item }: { item: DayItem; index: number }) => {
      const isSelected = item.date === selectedDate;
      return (
        <TouchableOpacity
          onPress={() => setSelectedDate(item.date)}
          style={[styles.dayItem, isSelected ? styles.selectedDay : null, item.isToday && !isSelected ? styles.todayDay : null]}
          activeOpacity={0.5}
        >
          <Text style={[styles.dayName, isSelected ? styles.selectedText : item.isToday ? styles.todayText : styles.dayNameText]}>{item.dayName.toUpperCase()}</Text>
          <Text style={[styles.dayNumber, isSelected ? styles.selectedText : styles.dayNumberText]}>{item.dayNumber}</Text>
          {item.isToday && !isSelected && <View style={styles.todayDot} />}
        </TouchableOpacity>
      );
    },
    [selectedDate],
  );

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={days}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
          initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
          contentContainerStyle={{ paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2 }}
        />
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${((selectedIndex + 1) / days.length) * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
    borderRadius: 16,
    paddingVertical: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
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
    fontWeight: '700',
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

export default GregorianCalendar;
