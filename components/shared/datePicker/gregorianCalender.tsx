import { Colors } from '@/constants/Colors';
import React, { useMemo, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

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

const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateWeekDays = (): DayItem[] => {
  const today = new Date();
  const todayStr = getDateStr(today);
  const currentDayOfWeek = today.getDay();
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysToMonday);

  const days: DayItem[] = [];

  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(startOfWeek);
    dateObj.setDate(startOfWeek.getDate() + i);
    const dateStr = getDateStr(dateObj);

    days.push({
      date: dateStr,
      dayNumber: dateObj.getDate(),
      dayName: getDayName(dateObj),
      isToday: dateStr === todayStr,
    });
  }

  return days;
};

const GregorianWeekCalendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  const days = useMemo(() => generateWeekDays(), []);
  const flatListRef = useRef<FlatList>(null);


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
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dayName,
              isSelected ? styles.selectedText : item.isToday ? styles.todayText : styles.dayNameText,
            ]}
          >
            {item.dayName.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.dayNumber,
              isSelected ? styles.selectedText : styles.dayNumberText,
            ]}
          >
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
        ref={flatListRef}
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
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
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

export default GregorianWeekCalendar;
