import React, { useCallback, useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from '../common/noInternetConnection';
import NeedLogin from '../common/needLogin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/appState';
import { TopicWithCount } from '@/types/database-type';
import { getListOfTopics } from '@/api/topicsApi/getPublicApi';
import { FlatList } from 'react-native';
import TopicsCard from './card/topicsCard';
import { Loading } from '../common/loading';
import { mapTopicFromBackend } from '@/utils/topicConverter';

const TopicExploreList = () => {
  const connection = useNetworkStatus();
  const isLogin = useAppStore((state) => state.isLogin);
  const [exploreData, setExploreData] = useState<TopicWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!connection) {
    return <NoInternetConnection />;
  } else if (!isLogin) {
    return <NeedLogin />;
  }

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const res = await getListOfTopics();
        if (res.success) {
          const topics: TopicWithCount[] = res.data.map(mapTopicFromBackend);
          setExploreData(topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  isLoading ? <Loading /> : null;

  const renderItem = useCallback(({ item }: { item: TopicWithCount }) => <TopicsCard data={item} />, []);

  return (
    <SafeAreaView>

      <FlatList
        data={exploreData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

export default TopicExploreList;
