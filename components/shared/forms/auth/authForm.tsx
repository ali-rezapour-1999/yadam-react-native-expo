import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/Colors';
import React from 'react';
import MailIcon from '@/assets/Icons/Mail';
import { t } from 'i18next';

interface AuthFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const AuthForm = ({ value, onChange, error, placeholder }: AuthFormProps) => {
  return (
    <FormControl isInvalid={!!error} isRequired size="lg" className="mt-8">
      <Input
        className="my-1 h-16 rounded-xl px-4"
        style={{
          direction: 'ltr',
          backgroundColor: Colors.main.textPrimary,
          borderWidth: 1,
          borderColor: error ? Colors.main.accent : Colors.main.textPrimary,
        }}
      >
        <InputField type="text" placeholder={placeholder} value={value} onChangeText={onChange} className="text-xl" />
        <MailIcon color={error ? Colors.main.accent : Colors.main.button} />
      </Input>

      {error && (
        <FormControlError className="mx-4">
          <FormControlErrorText style={{ color: Colors.main.accent }} className="text-sm">
            {t(error)}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
