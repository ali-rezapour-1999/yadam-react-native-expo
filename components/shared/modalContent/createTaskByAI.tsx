import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/components/common/loading';

interface Props {
  onSubmit: (description?: string) => void;
  isLoading?: boolean;
}

export const GenerateTaskByAi: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit } = useForm<{ description?: string }>({
    defaultValues: { description: '' },
  });

  const handleFormSubmit = (data: { description?: string }) => {
    onSubmit(data.description);
  };

  return (
    <View style={styles.container}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            className="mt-2"
            style={[styles.textArea]}
            size="md"
          >
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('todos.write_description_todo')}
              placeholderTextColor={Colors.main.textSecondary}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
          </Textarea>
        )}
      />
      <Button
        onPress={handleSubmit(handleFormSubmit)}
        disabled={isLoading}
        style={styles.button}
      >
        <ButtonText style={styles.buttonText}>
          {isLoading ? <Loading style={{ backgroundColor: 'transparent' }} /> : 'ساخت فعالیت‌ها با هوش مصنوعی'}
        </ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 6 },
  textArea: {
    borderRadius: 10,
    borderWidth: 0,
    flex: 1,
  },
  textarea: {
    borderWidth: 1,
    borderColor: Colors.main.border,
    borderRadius: 10,
    padding: 12,
    color: Colors.main.textPrimary,
    fontSize: 16,
    backgroundColor: Colors.main.cardBackground,
    textAlignVertical: 'top',
    minHeight: 140,
  },
  button: {
    backgroundColor: Colors.main.success,
    borderRadius: 10,
    marginTop: 50,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: { color: Colors.main.textPrimary, fontSize: 16 },
});
