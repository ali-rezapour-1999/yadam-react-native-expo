import { Text } from '@/components/Themed';
import { Button } from '@/components/ui/button';
import { MotiView } from 'moti';
import { Colors } from '@/constants/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { memo, useState } from 'react';

interface TimePickerProps {
  field: any;
  placeholder?: string;
  label?: string;
  onTimeChange?: (time: string) => void;
  width?: string;
  height?: string;
  disabled?: boolean;
}

export const TimePicker = memo(({ field, placeholder = '00:00', label, onTimeChange, width, height, disabled = false }: TimePickerProps) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const showTimePicker = () => {
    if (!disabled) {
      setIsTimePickerVisible(true);
    }
  };

  const hideTimePicker = () => {
    setIsTimePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    field.onChange(formattedTime);
    onTimeChange?.(formattedTime);
    hideTimePicker();
  };

  const handlePress = () => {
    if (!disabled) {
      showTimePicker();
    }
  };

  return (
    <>
      {label && (
        <Text className="text-start w-full px-8 text-sm mb-2" style={{ color: Colors.main.textSecondary }}>
          {label}
        </Text>
      )}

      <Button
        onPress={handlePress}
        className={`w-${width} h-${height} rounded-full`}
        style={{
          borderWidth: field.value ? 2 : 0,
          borderColor: field.value ? Colors.main.primary : Colors.main.primaryLight,
          backgroundColor: field.value ? Colors.main.primary + '40' : Colors.main.lightBlue,
          borderRadius: 12,
        }}
        disabled={disabled}
      >
        <MotiView
          animate={{
            scale: field.value ? 1.05 : 1,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        >
          <Text
            className="text-lg font-medium"
            style={{
              color: field.value ? Colors.main.primary : Colors.main.textPrimary,
            }}
          >
            {field.value || placeholder}
          </Text>
        </MotiView>
      </Button>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        accentColor={Colors.main.textPrimary}
        textColor={Colors.main.button}
        is24Hour={false}
        display="inline"
        minuteInterval={5}
      />
    </>
  );
});
