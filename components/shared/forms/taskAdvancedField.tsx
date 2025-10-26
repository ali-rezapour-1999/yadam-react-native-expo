import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { AddTodoSchemaType } from '@/components/schema/addTodoSchema';

import { Text } from '@/components/Themed';
import { Textarea, TextareaInput } from '@/components/ui/textarea';

interface TaskAdvancedFieldsProps {
  control: Control<AddTodoSchemaType>;
}

const TaskAdvancedFields: React.FC<TaskAdvancedFieldsProps> = ({ control }) => {
  return (
    <Controller
      control={control}
      name="description"
      render={({ field, fieldState }) => (
        <View style={[styles.card, fieldState.error && styles.cardError]}>
          <Text style={styles.label}>{t('profile.description')}</Text>
          <Textarea
            className="mt-2"
            style={[styles.textArea, fieldState.error && { borderColor: Colors.main.accent }]}
            size="md"
            isInvalid={!!fieldState.error}
          >
            <TextareaInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('common.placeholder.description_task')}
              placeholderTextColor={Colors.main.textSecondary}
              className="text-base"
              style={styles.textInput}
              multiline
            />
          </Textarea>

          {fieldState.error && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
};

export default TaskAdvancedFields;

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.main.border,
    padding: 16,
  },
  cardError: {
    borderColor: Colors.main.accent,
  },
  label: {
    fontSize: 16,
    color: Colors.main.textPrimary,
  },
  textArea: {
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: Colors.main.background,
    padding: 5
  },
  textInput: {
    color: Colors.main.textPrimary,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.main.accent,
    fontSize: 13,
    marginTop: 6,
  },
});
