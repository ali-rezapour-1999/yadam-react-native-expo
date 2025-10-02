import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Loading } from '../common/loading';
import { useTopicStore } from '@/store/topcisState';
import TopicsCard from './card/topicsCard';
import { TopicWithCount } from '@/types/database-type';

interface TopicListViewProps {
  data: TopicWithCount[];
}

const TopicListView = ({ data }: TopicListViewProps) => {
  const { isLoading } = useTopicStore();

  const renderItem = useCallback(({ item }: { item: TopicWithCount }) => <TopicsCard data={item} inExplore={false} />, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

export default TopicListView;
