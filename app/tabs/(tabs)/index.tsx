import React, { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { useTodoStore } from '@/store/todoState';
import { Center } from '@/components/ui/center';
import UserHeaderTitle from '@/components/common/userHeaderTitle';
import { Text } from '@/components/Themed';
import emptyTask from '@/assets/images/emptyHome.png';
import { useTopicStore } from '@/store/topcisState';
import { useAppStore } from '@/store/appState';
import { useFocusEffect } from 'expo-router';
import _ from 'lodash';
import { Image } from 'expo-image';
import { Loading } from '@/components/common/loading';
const TaskListView = React.lazy(() => import('@/components/shared/taskListView'));
const TopicFilter = React.lazy(() => import('@/components/shared/topicFilterList'));

interface HomeSection {
  id: string;
  type: 'header' | 'topicList' | 'todoList' | 'emptyState';
}

const ITEM_HEIGHTS = {
  header: 60,
  addTodo: 80,
  topicList: 90,
  progress: 120,
  todosHeader: 80,
  todoList: 300,
  emptyState: 500,
};

const Home: React.FC = () => {
  const { getTodayAllTask, todayTasks, getTaskByTopicIdAndDate } = useTodoStore();
  const { userTopics, loadUserTopics } = useTopicStore();
  const { user } = useAppStore();
  const [hasTasks, setHasTasks] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('0');

  useEffect(() => {
    if (user?.id) {
      loadUserTopics(user.id);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedTopicId && selectedTopicId !== '0') {
        getTaskByTopicIdAndDate(selectedTopicId);
      } else {
        getTodayAllTask();
      }
    }, [selectedTopicId, getTaskByTopicIdAndDate, getTodayAllTask]),
  );

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        setHasTasks(!_.isEmpty(todayTasks));
      }, 100);

      return () => clearTimeout(timer);
    }, [todayTasks, userTopics]),
  );

  const sections: HomeSection[] = useMemo(() => {
    const baseSections: HomeSection[] = [
      { id: 'header', type: 'header' },
      { id: 'topicList', type: 'topicList' },
    ];

    if (hasTasks) {
      return [...baseSections, { id: 'todoList', type: 'todoList' }];
    } else {
      return [...baseSections, { id: 'emptyState', type: 'emptyState' }];
    }
  }, [hasTasks]);

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
  }, []);

  const renderSectionContent = useCallback(
    (type: HomeSection['type']) => {
      const components = {
        header: <UserHeaderTitle />,
        topicList: (
          <Suspense fallback={<Loading />}>
            <TopicFilter selectedTopicId={selectedTopicId} onSelect={handleTopicSelect} topics={userTopics} />
          </Suspense>
        ),
        todoList: (
          <Box>
            <Suspense fallback={''}>
              <TaskListView mode="flat" enableSwipeActions={true} />
            </Suspense>
          </Box>
        ),
        emptyState: (
          <Center style={styles.emptyStateContainer}>
            <VStack style={styles.emptyState}>
              <Image source={emptyTask} style={{ height: 400, width: 400 }} contentFit="contain" />
              <Text style={styles.emptyStateText}>{t('home.no_data_message')}</Text>
            </VStack>
          </Center>
        ),
      };

      return components[type] || null;
    },
    [selectedTopicId, userTopics, selectedTopicId],
  );

  const renderItem: ListRenderItem<HomeSection> = useCallback(({ item }) => renderSectionContent(item.type), [renderSectionContent]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHTS[sections[index].type],
      offset: sections.slice(0, index).reduce((sum, section) => sum + ITEM_HEIGHTS[section.type], 0),
      index,
    }),
    [sections],
  );

  return (
    <Box style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, !hasTasks && styles.listContentEmpty]}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
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
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.main.textSecondary,
    marginBottom: 24,
  },
});
