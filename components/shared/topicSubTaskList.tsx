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
import { Box } from '../ui/box';
import { useLocalChangeTaskStore } from '@/store/taskState/localChange';

interface TopicSubTaskListProps {
  id: string;
  isUserTask: boolean;
}

const Wrapper = React.memo(({ children, id }: { children: React.ReactNode; id?: string, isUserTask?: boolean }) => (
  <ScrollView showsVerticalScrollIndicator={false} className="mt-5 rounded-lg min-h-max" contentContainerStyle={{ backgroundColor: Colors.main.cardBackground, padding: 20, minHeight: 300 }}>
    <HStack className="mb-4 items-center justify-between">
      <Text className="text-xl" style={{ color: Colors.main.textPrimary }}>
        {t('task_detail.sub_tasks')}
      </Text>
      <Button className="rounded-full h-7 px-3" onPress={() => router.push(`/tabs/(tabs)/tasks/createTask?topicId=${id}`)}>
        <Text className="text-sm" style={{ color: Colors.main.textPrimary }}>
          {t('event.create_task')}
        </Text>
      </Button>
    </HStack>
    {children}
  </ScrollView>
));

const TopicSubTaskList: React.FC<TopicSubTaskListProps> = ({ id, isUserTask }) => {
  const allTaskByTopicId = useLocalChangeTaskStore((state) => state.allTaskByTopicId);

  if (allTaskByTopicId.length === 0) {
    return (
      <Wrapper isUserTask={isUserTask} >
        {
          isUserTask
            ?
            <EmptySlot route={`/tabs/(tabs)/tasks/createTask?topicId=${id}`} placeholder={t('activity.any_topics_sub_task')} />
            :
            <Box style={{ backgroundColor: Colors.main.background, padding: 20 }} className='rounded-lg'>
              <Text className='text-center'>{t('todos.no_task_for_topic')}</Text>
            </Box>
        }
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
