import React, { useCallback, useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from '../common/noInternetConnection';
import NeedLogin from '../common/needLogin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopicWithCount } from '@/types/database-type';
import { getListOfTopics } from '@/api/topicsApi/getPublicApi';
import { FlatList } from 'react-native';
import TopicsCard from './card/topicsCard';
import { Loading } from '../common/loading';
import { useUserState } from '@/store/authState/userState';
import { useAuthState } from '@/store/authState/authState';

const TopicExploreList = () => {
  const connection = useNetworkStatus();
  const isLogin = useAuthState().isLogin;
  const token = useUserState().token;

  const [exploreData, setExploreData] = useState<TopicWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderItem = useCallback(
    ({ item }: { item: TopicWithCount }) => <TopicsCard data={item} inExplore={false} />,
    []
  );

  useEffect(() => {
    if (!connection || !isLogin) return;

    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const res = await getListOfTopics(token!!);
        if (res.success) {
          const topics: TopicWithCount[] = res.data;
          setExploreData(topics);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [connection, isLogin, token]);

  if (!connection) return <NoInternetConnection />;
  if (!isLogin) return <NeedLogin />;
  if (isLoading) return <Loading />;

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
