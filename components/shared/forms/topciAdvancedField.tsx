import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/Themed';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { AddTopicSchemaType } from '@/components/schema/addTopicSchema';

interface TopicAdvancedFieldsProps {
  control: Control<AddTopicSchemaType>;
}

export const TopicAdvancedFields: React.FC<TopicAdvancedFieldsProps> = ({ control }) => {
  return (
    <VStack className="gap-4">
      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <VStack style={{ backgroundColor: Colors.main.cardBackground }} className='rounded-lg p-3'>
            <Text style={{ color: Colors.main.textPrimary }}>{t('common.form.description')}</Text>
            <Textarea
              className="my-4 w-full rounded-lg px-4 h-[100px]"
              style={{
                backgroundColor: Colors.main.background,
                borderWidth: 0,
              }}
              size="sm"
              isReadOnly={false}
              isInvalid={!!fieldState.error}
              isDisabled={false}
            >
              <TextareaInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={t('common.placeholder.description_topic')}
                className="h-10 items-start text-[14px]"
                style={{ textAlignVertical: 'top', color: Colors.main.textPrimary }}
                placeholderTextColor={Colors.main.textDisabled}
              />
            </Textarea>
          </VStack>
        )}
      />
    </VStack>
  );
};

