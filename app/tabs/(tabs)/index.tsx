import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { t } from 'i18next';

// UI & Theme
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/Themed';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

// Assets & Async Components
import emptyTask from '@/assets/images/emptyHome.png';
import { GenerateTaskByAi } from '@/components/shared/modalContent/createTaskByAI';
import { Button, ButtonText } from '@/components/ui/button';
import { useUserState } from '@/store/authState/userState';
import { useLocalChangeTaskStore } from '@/store/taskState/localChange';
import { useLocalChangeTopicStore } from '@/store/topicState/localChange';
import { useServerChangeTaskStore } from '@/store/taskState/serverChange';
const UserHeaderTitle = React.lazy(() => import('@/components/common/userHeaderTitle'));
const TaskListView = React.lazy(() => import('@/components/shared/taskListView'));
const TopicFilter = React.lazy(() => import('@/components/shared/topicFilterList'));


interface TopicListSectionProps {
  selectedTopicId: string;
  topics: any[];
  onSelect: (id: string) => void;
}

const TopicListSection = memo(function TopicListSection({ selectedTopicId, topics, onSelect }: TopicListSectionProps) {
  return (
    <Suspense fallback={<Loading />}>
      <TopicFilter
        selectedTopicId={selectedTopicId}
        topics={topics}
        onSelect={onSelect}
      />
    </Suspense>
  );
});

const TodoListSection = memo(function TodoListSection() {
  return (
    <Box>
      <Suspense fallback={null}>
        <TaskListView mode="flat" enableSwipeActions />
      </Suspense>
    </Box>
  );
});

const Loading = memo(function Loading() {
  const Raw = require('@/components/common/loading').Loading;
  return <Raw />;
});

interface EmptyStateSectionProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  token: string | null | undefined;
  isLoading: boolean;
  onGenerate: (description?: string) => void;
  onRequireLogin: () => void;
}

const EmptyStateSection = memo(function EmptyStateSection({ isOpen, setOpen, token, isLoading, onGenerate, onRequireLogin }: EmptyStateSectionProps) {
  return (
    <Center style={styles.emptyStateContainer}>
      <VStack style={styles.emptyState}>
        <Image
          source={emptyTask}
          style={{ height: 350, width: 400 }}
          contentFit="contain"
        />
        <Text style={styles.emptyStateText}>
          {t('home.no_data_message')}
        </Text>
      </VStack>
      <Button style={{ backgroundColor: Colors.main.button }} className='h-14' onPress={() => setOpen(true)}>
        <ButtonText className="text-xl">{t('ai.create_daily_task_with_ai')}</ButtonText>
      </Button>
      <GenerateTaskByAi
        token={token}
        isLoading={isLoading}
        onSubmit={onGenerate}
        visible={isOpen}
        onClose={() => setOpen(false)}
        onRequireLogin={onRequireLogin}
      />
    </Center>
  );
});

// Home Screen
// ============================================================

const Home = () => {
  const { getTodayAllTask, todayTasks, getTaskByTopicIdAndDate, isLoading } = useLocalChangeTaskStore();
  const createWithAi = useServerChangeTaskStore().createWithAi;

  const { userTopics, loadUserTopics } = useLocalChangeTopicStore();
  const { user, token } = useUserState();

  const [selectedTopicId, setSelectedTopicId] = useState<string>('0');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUserTopics(user.id);
    }
  }, [user?.id, loadUserTopics]);

  useFocusEffect(
    useCallback(() => {
      if (selectedTopicId && selectedTopicId !== '0') {
        getTaskByTopicIdAndDate(selectedTopicId);
      } else {
        getTodayAllTask();
      }
    }, [selectedTopicId, getTaskByTopicIdAndDate, getTodayAllTask])
  );

  const hasTasks = useMemo(() => {
    if (Array.isArray(todayTasks)) {
      return todayTasks.length > 0;
    }
    return Boolean(todayTasks && Object.keys(todayTasks).length > 0);
  }, [todayTasks]);

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
  }, []);

  const handleGenerateTasks = useCallback(async (description?: string) => {
    if (description) {
      await createWithAi(description);
    }
  }, [createWithAi]);

  const handleRequireLogin = useCallback(() => {
    setIsOpen(false);
    router.push('/tabs/(auth)/emailAuth');
  }, []);

  return (
    <Box style={styles.container}>
      {/* Header */}
      <UserHeaderTitle />

      {/* Topic Filter */}
      <TopicListSection
        selectedTopicId={selectedTopicId}
        topics={userTopics}
        onSelect={handleTopicSelect}
      />

      {hasTasks ? (
        <TodoListSection />
      ) : (
        <EmptyStateSection
          isOpen={isOpen}
          setOpen={setIsOpen}
          token={token}
          isLoading={isLoading}
          onGenerate={handleGenerateTasks}
          onRequireLogin={handleRequireLogin}
        />
      )}
    </Box>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 500,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.main.textSecondary,
    marginBottom: 24,
  },
});
