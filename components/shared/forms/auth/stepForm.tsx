import { FormControl, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { HStack } from '@/components/ui/hstack';

interface StepFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError | undefined;
  placeholder?: string;
  title: string;
}

export const StepForm = ({ title, value, onChange, error, placeholder }: StepFormProps) => {
  return (
    <FormControl isInvalid={!!error} isRequired size="lg">
      <HStack className="items-center">
        <FormControlLabelText className="px-3" style={{ color: Colors.main.textPrimary }}>
          {title}
        </FormControlLabelText>
      </HStack>
      <Input
        className="h-20 w-full rounded-xl px-4"
        style={{
          backgroundColor: Colors.main.cardBackground,
          borderWidth: 1,
          borderColor: error != null ? Colors.main.accent : Colors.main.border,
        }}
      >
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className="w-full text-lg"
          style={{ borderColor: Colors.main.primaryLight, color: Colors.main.textPrimary }}
          placeholderTextColor={Colors.main.textSecondary}
        />
      </Input>
    </FormControl>
  );
};
