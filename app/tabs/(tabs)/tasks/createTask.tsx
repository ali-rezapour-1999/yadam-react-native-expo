import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, I18nManager, TouchableOpacity, ScrollView, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { useTodoForm } from '@/hooks/useTodoForm';
import { Box } from '@/components/ui/box';
import { TodoBasicFields } from '@/components/shared/forms/todoBaseField';
import HeaderTitle from '@/components/common/headerTitle';
import { Text } from '@/components/Themed';
import { Icon } from '@/components/ui/icon';
import { useTopicStore } from '@/store/topcisState';
import { Controller } from 'react-hook-form';
import DaySelector from '@/components/common/daySelecter';
import TopicSelector from '@/components/shared/topicSelector';
import { CancelIcon } from '@/assets/Icons/Cancel';
import { useAppStore } from '@/store/appState';
import ModalOption from '@/components/common/modelOption';
import { useLocalSearchParams } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import TaskAdvancedFields from '@/components/shared/forms/taskAdvancedField';


const CreateTask: React.FC = () => {
  const { selectedDate } = useTodoStore();
  const { user } = useAppStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userTopics, loadUserTopics } = useTopicStore();
  const { topicId: topicIdFromRoute } = useLocalSearchParams<{ topicId?: string }>();

  useEffect(() => {
    loadUserTopics(user?.id as string);
  }, [loadUserTopics]);

  const { form, onSubmit } = useTodoForm({ selectedDate, topicNumber: topicIdFromRoute });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const selectedCategoryId = watch('topicId');

  const selectedTopic = userTopics.find((topic) => topic.id === selectedCategoryId);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={true}>
          <Box style={styles.header}>
            <HeaderTitle title={t('create_task.create_task')} path={topicIdFromRoute ? `tabs/(tabs)/topics/detail/${topicIdFromRoute}` : '/tabs/(tabs)'} />
          </Box>

          <Box style={styles.section}>
            <TodoBasicFields control={control} errors={errors} startTime={startTime} endTime={endTime} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} />
          </Box>

          <Box style={styles.section}>
            <TouchableOpacity
              style={[styles.sectionButton, { opacity: userTopics.length === 0 ? 0.7 : 1 }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
              disabled={userTopics.length === 0}
            >
              <Box style={styles.sectionButtonContent}>
                <Text style={styles.sectionTitle}>{t('activity.title')}</Text>
                <Text style={[styles.sectionSubtitle, { display: userTopics.length === 0 ? 'flex' : 'none' }]}>{t('create_task.no_topics')}</Text>
                <Text style={[styles.sectionSubtitle, { display: selectedTopic ? 'flex' : 'none' }]}>{selectedTopic ? selectedTopic.title : ''}</Text>
              </Box>
              {userTopics.length === 0 && <CancelIcon color={'transparent'} />}
              {userTopics.length > 0 && <Icon as={ChevronDown} size="md" color={Colors.main.textSecondary} />}
            </TouchableOpacity>
            <Controller
              name="topicId"
              control={control}
              render={({ field }) => (
                <TopicSelector visible={isModalVisible} onClose={() => setIsModalVisible(false)} topics={userTopics} selectedTopicId={field.value} onSelectTopic={field.onChange} />
              )}
            />
          </Box>

          <ModalOption title={t('event.options')} style={{ padding: 16 }}>
            <Controller name="reminderDays" control={control} render={({ field }) => <DaySelector field={field} />} />
            <TaskAdvancedFields control={control} />
          </ModalOption>
        </ScrollView>

        <Box style={styles.fixedButtonContainer}>
          <Button onPress={handleSubmit(onSubmit)} style={styles.buttonStyle}>
            <ButtonText style={styles.buttonText}>{t('button.add_task')}</ButtonText>
          </Button>
        </Box>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginBottom: 100,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    paddingVertical: 5,
  },
  section: {
    marginBottom: 16,
  },
  sectionButton: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionButtonContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.main.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.main.textSecondary,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.main.background,
    paddingTop: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.main.cardBackground,
  },
  buttonStyle: {
    backgroundColor: Colors.main.button,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 50,
  },
  buttonText: {
    color: Colors.main.textPrimary,
    fontSize: 17,
  },
});
