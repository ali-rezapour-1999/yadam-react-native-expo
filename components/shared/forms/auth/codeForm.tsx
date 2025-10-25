import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Text } from '@/components/Themed';

interface CodeFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hasError?: boolean;
  maxLength?: number;
}

export const CodeForm: React.FC<CodeFormProps> = ({ value, onChange, error, hasError, maxLength = 6 }) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        placeholder="******"
        placeholderTextColor={Colors.main.textSecondary + '80'}
        style={[
          styles.input,
          { borderColor: hasError ? Colors.main.accent : focused ? Colors.main.primary : Colors.main.border },
        ]}
      />
      {error && (
        <Text style={styles.errorText} numberOfLines={2}>
          {error}
        </Text>
      )}
    </View>
  );
};

/* ------------------------------- Styles ------------------------------- */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 60,
    borderRadius: 14,
    fontSize: 20,
    letterSpacing: 10,
    textAlign: 'center',
    color: Colors.main.textPrimary,
    backgroundColor: Colors.main.cardBackground,
    writingDirection: 'ltr',
    paddingHorizontal: 16,
  },
  errorText: {
    textAlign: 'center',
    color: Colors.main.accent,
    fontSize: 13,
    marginTop: 8,
  },
});
