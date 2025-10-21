import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
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
            className="my-1 w-full rounded-xl h-[130px] px-1"
            style={{
              backgroundColor: Colors.main.cardBackground,
              borderWidth: 1,
              borderColor: Colors.main.border,

            }}
            size="sm"
          >
            <TextareaInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={t('common.placeholder.write_description_placeholder')}
              placeholderTextColor={Colors.main.textSecondary}
              style={{ textAlignVertical: 'top', color: Colors.main.textPrimary }}
              multiline
              numberOfLines={4}
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
  button: {
    backgroundColor: Colors.main.textPrimary,
    borderRadius: 10,
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: { color: Colors.main.background, fontSize: 16 },
});
