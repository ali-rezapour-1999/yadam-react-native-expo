import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Colors } from '@/constants/Colors';
import { useTopicsForm } from '@/hooks/useTopicsForm';
import { useTopicStore } from '@/store/topcisState';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { t } from 'i18next';
import HeaderTitle from '@/components/common/headerTitle';
import { Controller } from 'react-hook-form';
import { AddTodoForm } from '@/components/shared/forms/addTodo/todoForm';
import CategoryPicker from '@/components/shared/categorySelector';
import { Category } from '@/constants/Category';
import { TopicAdvancedFields } from '@/components/shared/forms/topciAdvancedField';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopicEdit = () => {
  const { topic } = useTopicStore();

  const { form, onSubmit } = useTopicsForm({ topic: topic });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}>
        <VStack className="flex-1 p-7 gap-4">
          <HeaderTitle title={t('event.edit_topic')} path={`/tabs/(tabs)/topics/detail/${topic?.id}`} />
          <Controller
            name="title"
            control={control}
            render={({ field }) => <AddTodoForm autoFocus style={{ height: 40 }} value={field.value} placeholder={t('event.title')} onChange={field.onChange} error={errors.title?.message} />}
          />

          <TopicAdvancedFields control={control} />

          <Controller name="categoryId" control={control} render={({ field }) => <CategoryPicker selectedCategory={field.value} onCategorySelect={field.onChange} categories={Category} error={errors.categoryId} />} />

          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <HStack className="items-center justify-between border-b-2 px-1 mt-3" style={{ borderColor: Colors.main.border }}>
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
        </VStack>
        <Box className="flex-1" />
        <Box style={styles.buttonContainer}>
          <Button onPress={handleSubmit(onSubmit)} style={styles.buttonStyle}>
            <ButtonText style={styles.buttonText}>{t('event.edit_topic')}</ButtonText>
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default TopicEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  buttonContainer: {
    padding: 18,
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
    fontSize: 18,
  },
});
