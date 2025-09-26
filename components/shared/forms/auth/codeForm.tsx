import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';

interface CodeFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onResendCode?: () => void;
  length?: number;
  hasError?: boolean;
}

export const CodeForm = ({ value, onChange, error, onResendCode, length = 6, hasError }: CodeFormProps) => {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(120);
  const inputsRef = useRef<TextInput[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (hasError) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => {
        onChange('');
      });
    }
  }, [hasError]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newValue = value.split('');
    newValue[index] = text;
    const joined = newValue.join('').replace(/\s/g, '');
    onChange(joined);

    if (text && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(120);
      onChange('');
      onResendCode?.();
    }
  };

  return (
    <>
      <HStack className="w-full justify-between mb-3 px-5 items-center rtl">
        <HStack className="items-center gap-3">
          <Text className="text-background">{t('auth.we_send_code')}</Text>
        </HStack>
        {secondsLeft > 0 ? (
          <Text className="text-background">{formatTime(secondsLeft)}</Text>
        ) : (
          <Button onPress={handleResend} className="bg-blue-50 px-3 py-1 rounded-full" style={{ backgroundColor: Colors.main.background }}>
            <ButtonText style={{ color: Colors.main.textPrimary }} >{t('auth.resend_code')}</ButtonText>
          </Button>
        )}
      </HStack>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <HStack className="justify-center gap-3" style={{ direction: "ltr" }}>
          {Array.from({ length }).map((_, i) => (
            <TextInput
              key={i}
              value={value[i] || ''}
              ref={(el) => (inputsRef.current[i] = el!)}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.input,
                {
                  borderColor: hasError ? Colors.main.accent : Colors.main.primaryLight,
                  borderWidth: hasError ? 2 : 1,
                },
              ]}
            />
          ))}
        </HStack>
      </Animated.View>
      <Text className="text-center text-xs mt-4 leading-relaxed">{error}</Text>
    </ >
  );
};

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.main.primaryLight,
    textAlign: 'center',
    fontSize: 24,
    color: Colors.main.textPrimary,
    backgroundColor: Colors.main.background,
    shadowColor: Colors.main.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
