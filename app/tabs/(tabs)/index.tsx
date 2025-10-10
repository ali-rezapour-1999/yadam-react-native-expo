import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { t } from 'i18next';

// UI & Theme
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/Themed';
import { Image } from 'expo-image';
import AppModal from '@/components/common/appModal';
import { Colors } from '@/constants/Colors';

// Stores
import { useTodoStore } from '@/store/todoState';
import { useTopicStore } from '@/store/topcisState';
import { useAppStore } from '@/store/appState';

// Assets & Async Components
import emptyTask from '@/assets/images/emptyHome.png';
import lockImage from '@/assets/images/lockImage.png';
import { GenerateTaskByAi } from '@/components/shared/modalContent/createTaskByAI';
const TaskListView = React.lazy(() => import('@/components/shared/taskListView'));
const TopicFilter = React.lazy(() => import('@/components/shared/topicFilterList'));


type SectionType = 'header' | 'topicList' | 'todoList' | 'emptyState';

interface HomeSection {
  id: string;
  type: SectionType;
}

const ITEM_HEIGHTS: Record<SectionType, number> = {
  header: 60,
  topicList: 90,
  todoList: 300,
  emptyState: 500,
};

const HeaderSection = memo(function HeaderSection() {
  const UserHeaderTitle = React.lazy(() => import('@/components/common/userHeaderTitle'));
  return (
    <Suspense fallback={null}>
      <UserHeaderTitle />
    </Suspense>
  );
});

interface TopicListSectionProps {
  selectedTopicId: string;
  topics: any[];
  onSelect: (id: string) => void;
}
const TopicListSection = memo(function TopicListSection({ selectedTopicId, topics, onSelect }: TopicListSectionProps) {
  return (
    <Suspense fallback={<Loading />}>
      <TopicFilter selectedTopicId={selectedTopicId} topics={topics} onSelect={onSelect} />
    </Suspense>
  );
});

const TodoListSection = memo(function TodoListSection() {
  return (
    <Box>
      <Suspense fallback={''}>
        <TaskListView mode="flat" enableSwipeActions />
      </Suspense>
    </Box>
  );
});

interface AIGateProps {
  token: string | null | undefined;
  isLoading: boolean;
  onGenerate: () => void;
  onRequireLogin: () => void;
}
const AIGate = memo(function AIGate({ token, isLoading, onGenerate, onRequireLogin }: AIGateProps) {
  if (token) {
    return <GenerateTaskByAi isLoading={isLoading} onSubmit={onGenerate} />;
  }
  return (
    <Center className="gap-3 py-3">
      <Image source={lockImage} style={{ height: 120, width: '100%' }} contentFit="contain" />
      <Button style={{ backgroundColor: Colors.main.button, height: 40 }} onPress={onRequireLogin} className='rounded-lg'>
        <ButtonText className="text-lg">{t('event.need_to_login')}</ButtonText>
      </Button>
    </Center>
  );
});

const Loading = memo(function Loading() {
  const Raw = require('@/components/common/loading').Loading;
  return <Raw />;
});

const EmptyStateSection = memo(function EmptyStateSection({
  isOpen,
  setOpen,
  token,
  isLoading,
  onGenerate,
  onRequireLogin,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  token: string | null | undefined;
  isLoading: boolean;
  onGenerate: () => void;
  onRequireLogin: () => void;
}) {
  return (
    <Center style={styles.emptyStateContainer}>
      <VStack style={styles.emptyState}>
        <Image source={emptyTask} style={{ height: 350, width: 400 }} contentFit="contain" />
        <Text style={styles.emptyStateText}>{t('home.no_data_message')}</Text>
      </VStack>
      <AppModal
        title={t('ai.create_daily_task_with_ai')}
        buttonContent={<ButtonText className="text-xl">{t('ai.create_daily_task_with_ai')}</ButtonText>}
        buttonStyle={{ backgroundColor: Colors.main.button, width: '80%', height: 50 }}
        visible={isOpen}
        onChangeVisible={setOpen}
      >
        <AIGate token={token} isLoading={isLoading} onGenerate={onGenerate} onRequireLogin={onRequireLogin} />
      </AppModal>
    </Center>
  );
});

/**
 * ------------------------------------------------------------
 * Home Screen
 * ------------------------------------------------------------
 */

const Home = () => {
  const { getTodayAllTask, todayTasks, getTaskByTopicIdAndDate, createWithAi, isLoading } = useTodoStore();
  const { userTopics, loadUserTopics } = useTopicStore();
  const { user, token } = useAppStore();

  const [selectedTopicId, setSelectedTopicId] = useState<string>('0');
  const [isOpen, setIsOpen] = useState(false);

  // Load topics when user.id is available/changes
  useEffect(() => {
    if (user?.id) loadUserTopics(user.id);
  }, [user?.id, loadUserTopics]);

  // Fetch tasks on focus and when topic changes
  useFocusEffect(
    useCallback(() => {
      if (selectedTopicId && selectedTopicId !== '0') {
        getTaskByTopicIdAndDate(selectedTopicId);
      } else {
        getTodayAllTask();
      }
    }, [selectedTopicId, getTaskByTopicIdAndDate, getTodayAllTask])
  );

  // Derive whether there are tasks (assumes todayTasks is an array)
  const hasTasks = useMemo(() => Array.isArray(todayTasks) ? todayTasks.length > 0 : Boolean(todayTasks && Object.keys(todayTasks).length > 0), [todayTasks]);

  // Precompute sections for FlatList
  const sections: HomeSection[] = useMemo(() => {
    const base: HomeSection[] = [
      { id: 'header', type: 'header' },
      { id: 'topicList', type: 'topicList' },
    ];
    return hasTasks ? [...base, { id: 'todoList', type: 'todoList' }] : [...base, { id: 'emptyState', type: 'emptyState' }];
  }, [hasTasks]);

  const handleTopicSelect = useCallback((topicId: string) => setSelectedTopicId(topicId), []);

  const handleGenerateTasks = useCallback(async (description?: string) => {

    await createWithAi(description as string);
  }, [createWithAi]);

  const handleRequireLogin = useCallback(() => {
    setIsOpen(false);
    router.push('/tabs/(auth)/emailAuth');
  }, []);

  // Render a section by type — stable between renders
  const renderSectionContent = useCallback(
    (type: SectionType) => {
      switch (type) {
        case 'header':
          return <HeaderSection />;
        case 'topicList':
          return <TopicListSection selectedTopicId={selectedTopicId} topics={userTopics} onSelect={handleTopicSelect} />;
        case 'todoList':
          return <TodoListSection />;
        case 'emptyState':
          return (
            <EmptyStateSection
              isOpen={isOpen}
              setOpen={setIsOpen}
              token={token}
              isLoading={isLoading}
              onGenerate={handleGenerateTasks}
              onRequireLogin={handleRequireLogin}
            />
          );
        default:
          return null;
      }
    },
    [selectedTopicId, userTopics, isOpen, token, isLoading, handleTopicSelect, handleGenerateTasks, handleRequireLogin]
  );

  const renderItem: ListRenderItem<HomeSection> = useCallback(({ item }) => renderSectionContent(item.type), [renderSectionContent]);

  const keyExtractor = useCallback((item: HomeSection) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHTS[sections[index].type],
      offset: sections.slice(0, index).reduce((sum, s) => sum + ITEM_HEIGHTS[s.type], 0),
      index,
    }),
    [sections]
  );

  return (
    <Box style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, !hasTasks && styles.listContentEmpty]}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />
    </Box>
  );
};

export default memo(Home);

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 40,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
