import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { StyleSheet } from 'react-native';
import { weekdaysEn, weekdaysFa } from '@/constants/enums/WeekEnum';
import { useBaseStore } from '@/store/baseState/base';

interface DaySelectorProps {
  field: {
    value: string[] | undefined;
    onChange: (value: string[]) => void;
  };
  selectDate: string;
}

const DaySelector = ({ field, selectDate }: DaySelectorProps) => {
  const value = field.value ?? [];
  const language = useBaseStore().language;

  const weekdays = language === 'fa' ? weekdaysFa : weekdaysEn;

  let selectedIndex = -1;
  if (selectDate) {
    const d = new Date(selectDate + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      const selectedNameEn = d.toLocaleDateString('en-US', { weekday: 'long' });
      selectedIndex = weekdays.findIndex((wd) => wd.en === selectedNameEn);
    }
  }

  const handleDayChange = (day: string) => {
    const isSelected = value.includes(day);
    const updatedDays = isSelected ? value.filter((d) => d !== day) : [...value, day];
    field.onChange(updatedDays);
  };


  return (
    <VStack style={styles.container}>
      <Text className="mb-3">{t('event.select_reminder_days')}</Text>
      <HStack className="flex-wrap gap-1">
        {weekdays.map((day, idx) => {
          const isSelected = value.includes(day.en);
          const isBeforeSelected = selectedIndex !== -1 ? idx <= selectedIndex : false;

          return (
            <Button
              key={day.id}
              onPress={() => {
                if (!isBeforeSelected) handleDayChange(day.en);
              }}
              disabled={isBeforeSelected}
              size="sm"
              className="rounded-full px-3"
              style={{
                backgroundColor: isSelected ? Colors.main.primary : Colors.main.background,
                opacity: isBeforeSelected ? 0.4 : 1,
              }}
            >
              <ButtonText style={{ color: Colors.main.textPrimary }} className="text-sm">
                {language === 'fa' ? day.fa : day.en}
              </ButtonText>
            </Button>
          );
        })}
      </HStack>
    </VStack>
  );
};

export default DaySelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowRadius: 2,
    marginBottom: 20,
  },
});
