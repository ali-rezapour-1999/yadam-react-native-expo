import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface AddTodoFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  style: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export const AddTodoForm = ({ value, onChange, error, placeholder, style, autoFocus }: AddTodoFormProps) => {
  return (
    <FormControl
      isInvalid={!!error}
      isRequired
      size="lg"
      className="mt-8 p-5"
      style={[
        styles.container,
        {
          borderWidth: error ? 2 : 0,
          borderColor: error ? Colors.main.accent : Colors.main.cardBackground,
        },
      ]}
    >
      <Box className="">
        <Text>{t('common.form.title')}</Text>
      </Box>
      <Input style={[styles.inputContainer, style]}>
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className="text-xl"
          autoFocus={autoFocus}
          placeholderTextColor={Colors.main.textSecondary}
        />
      </Input>
    </FormControl>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 15,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderBottomColor: Colors.main.textDisabled,
    borderBottomWidth: 1,
  },
});
