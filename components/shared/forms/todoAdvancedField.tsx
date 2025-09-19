import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/Themed';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { AddTodoSchemaType } from '@/components/schema/addTodoSchema';
import { Box } from '@/components/ui/box';
import { StyleSheet } from 'react-native';

interface TodoAdvancedFieldsProps {
  control: Control<AddTodoSchemaType>;
}

export const TodoAdvancedFields: React.FC<TodoAdvancedFieldsProps> = ({ control }) => {
  return (
    <VStack className="gap-4">
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <VStack style={styles.description}>
            <Box>
              <Text style={{ color: Colors.main.textPrimary }}>{t('profile.description')}</Text>
            </Box>
            <Textarea
              className="my-1 w-full rounded-lg px-4 h-[120px]"
              style={{
                backgroundColor: Colors.main.background,
                borderWidth: 1,
                borderColor: Colors.main.primaryLight,
              }}
              size="sm"
              isReadOnly={false}
              isInvalid={!!fieldState.error}
              isDisabled={false}
            >
              <TextareaInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('todos.write_description_todo')}
                className="h-10 items-start"
                style={{ textAlignVertical: 'top' }}
                placeholderTextColor={Colors.main.primaryLight}
              />
            </Textarea>
          </VStack>
        )}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  description: {
    backgroundColor: Colors.main.cardBackground,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
