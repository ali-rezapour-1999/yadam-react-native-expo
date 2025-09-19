import { useTodoStore } from '@/store/todoState';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Button } from '../ui/button';
import { Text } from '../Themed';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { HStack } from '../ui/hstack';
import TaskCardInTopic from './card/taskCardInTopic';
import { Task } from '@/types/database-type';
import EmptySlot from './emptySlot';

interface TopicSubTaskListProps {
  id: string;
}

const Wrapper = React.memo(({ children, id }: { children: React.ReactNode; id?: string }) => (
  <ScrollView showsVerticalScrollIndicator={false} className="mt-5 rounded-lg min-h-max" contentContainerStyle={{ backgroundColor: Colors.main.cardBackground, padding: 20, minHeight: 300 }}>
    <HStack className="mb-4 items-center justify-between">
      <Text className="text-xl" style={{ color: Colors.main.textPrimary }}>
        {t('task_detail.sub_tasks')}
      </Text>
      <Button className="rounded-full h-7 px-3" onPress={() => router.push(`/tabs/(tabs)/tasks/createTask?topicId=${id}`)}>
        <Text className="text-sm" style={{ color: Colors.main.textPrimary }}>
          {t('task_detail.add_task')}
        </Text>
      </Button>
    </HStack>
    {children}
  </ScrollView>
));

const TopicSubTaskList: React.FC<TopicSubTaskListProps> = ({ id }) => {
  const allTaskByTopicId = useTodoStore((state) => state.allTaskByTopicId);

  if (allTaskByTopicId.length === 0) {
    return (
      <Wrapper>
        <EmptySlot route={`/tabs/(tabs)/tasks/createTask?topicId=${id}`} placeholder={t('activity.any_topics_sub_task')} />
      </Wrapper>
    );
  }

  return (
    <Wrapper id={id}>
      {allTaskByTopicId.map((item: Task) => (
        <TaskCardInTopic key={item.id} data={item} />
      ))}
    </Wrapper>
  );
};

export default TopicSubTaskList;
