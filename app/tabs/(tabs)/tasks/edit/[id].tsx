import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, I18nManager, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { t } from 'i18next';
import { useTodoForm } from '@/hooks/useTodoForm';
import { Box } from '@/components/ui/box';
import { TodoBasicFields } from '@/components/shared/forms/todoBaseField';
import TaskAdvancedFields from '@/components/shared/forms/taskAdvancedField';
import HeaderTitle from '@/components/common/headerTitle';
import { Text } from '@/components/Themed';
import { ChevronUpIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { useTopicStore } from '@/store/topcisState';
import { Controller } from 'react-hook-form';
import DaySelector from '@/components/common/daySelecter';
import TopicSelector from '@/components/shared/topicSelector';
import { CancelIcon } from '@/assets/Icons/Cancel';
import { useAppStore } from '@/store/appState';
import ModalOption from '@/components/common/modelOption';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightFromLine } from 'lucide-react-native';
import { router } from 'expo-router';

const EditTask: React.FC = () => {
  const { selectedDate, task } = useTodoStore();
  const { user } = useAppStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userTopics, loadUserTopics } = useTopicStore();

  useEffect(() => {
    loadUserTopics(user?.id as string);
  }, [loadUserTopics]);

  const { form, onSubmit } = useTodoForm({ selectedDate, task });
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <Box className="mt-5">
          <HeaderTitle title={t('todos.edit_event')} path={`/tabs/(tabs)/tasks/detail/${task?.id}`} />
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
            {userTopics.length > 0 && <Icon as={ChevronUpIcon} size="md" color={Colors.main.textSecondary} />}
          </TouchableOpacity>
          <Controller
            name="topicId"
            control={control}
            render={({ field }) => <TopicSelector visible={isModalVisible} onClose={() => setIsModalVisible(false)} topics={userTopics} selectedTopicId={field.value} onSelectTopic={field.onChange} />}
          />
        </Box>

        <Box style={styles.section}>
          <ModalOption title={t('event.options')} style={{ padding: 16 }}>
            <Controller name="reminderDays" control={control} render={({ field }) => <DaySelector field={field} />} />
            <TaskAdvancedFields control={control} />
          </ModalOption>
        </Box>
      </KeyboardAvoidingView>
      <Box style={styles.fixedButtonContainer}>
        <Button onPress={handleSubmit(onSubmit)} style={[styles.buttonStyle, { backgroundColor: Colors.main.button }]} className='rounded-full'>
          <Icon as={ArrowRightFromLine} size="2xl" color={Colors.main.textPrimary} />
        </Button>
        <Button onPress={() => router.back()} style={[styles.buttonStyle, { backgroundColor: Colors.main.textPrimary }]} className='rounded-full'>
          <Icon as={CloseIcon} size="xl" color={Colors.main.background} />
        </Button>
      </Box>
    </SafeAreaView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  keyboardView: {
    paddingHorizontal: 18,
  },
  section: {
    marginBottom: 10,
  },
  sectionButton: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowRadius: 2,
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
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowRadius: 8,
    height: 130,
  },
  buttonStyle: {
    backgroundColor: Colors.main.button,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 50,
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.main.textPrimary,
    fontSize: 17,
  },
});
