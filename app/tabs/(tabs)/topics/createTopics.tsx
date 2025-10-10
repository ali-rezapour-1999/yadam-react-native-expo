import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Box } from '@/components/ui/box';
import HeaderTitle from '@/components/common/headerTitle';
import { Controller } from 'react-hook-form';
import { AddForm } from '@/components/shared/forms/addTopic/addForm';
import CategoryPicker from '@/components/shared/categorySelector';
import { Category } from '@/constants/Category';
import { TopicAdvancedFields } from '@/components/shared/forms/topciAdvancedField';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Switch } from '@/components/ui/switch';
import { useTopicsForm } from '@/hooks/useTopicsForm';
import ModalOption from '@/components/common/modelOption';

const CreateTopics = () => {
  const { form, onSubmit } = useTopicsForm({ topic: null });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const title = watch('title');
  const categoryId = watch('categoryId');

  const isFormValid = title?.trim().length > 0 && categoryId?.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
        <VStack className="flex-1 p-4 gap-4">
          <HeaderTitle title={t('event.create_topics')} />
          <Controller
            name="title"
            control={control}
            render={({ field }) => <AddForm autoFocus style={{ height: 40 }} value={field.value} placeholder={t('common.placeholder.title_place_holder')} onChange={field.onChange} error={errors.title?.message} />}
          />

          <Controller
            name="categoryId"
            control={control}
            render={({ field, fieldState }) => <CategoryPicker selectedCategory={field.value} onCategorySelect={field.onChange} categories={Category} error={fieldState.error} />}
          />
          <ModalOption title={t('event.options')} style={{ padding: 16 }}>
            <TopicAdvancedFields control={control} />
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <HStack className="items-center justify-between border-bP-2 px-1 mt-3" style={{ borderColor: Colors.main.border }}>
                  <Text style={{ color: Colors.main.textPrimary }} className="text-lg">
                    {t('event.is_public')}
                  </Text>
                  <Switch
                    thumbColor={field.value?.valueOf() ? Colors.main.primary : Colors.main.textPrimary}
                    trackColor={{ false: Colors.main.border, true: Colors.main.primary }}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </HStack>
              )}
            />
          </ModalOption>
        </VStack>
      </KeyboardAvoidingView>
      <Box className="flex-1" />
      <Box style={styles.buttonContainer}>
        <Button onPress={handleSubmit(onSubmit)} style={[styles.buttonStyle, { backgroundColor: isFormValid ? Colors.main.button : Colors.main.border }]} disabled={!isFormValid}>
          <ButtonText style={styles.buttonText}>{t('event.add_topic')}</ButtonText>
        </Button>
      </Box>
    </SafeAreaView>
  );
};

export default CreateTopics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  buttonContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main.background,
  },
  buttonStyle: {
    backgroundColor: Colors.main.button,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 50,
    padding: 10,
  },
  buttonText: {
    color: Colors.main.textPrimary,
    fontSize: 17,
  },
});
