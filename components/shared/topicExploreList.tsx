import React, { useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from '../common/noInternetConnection';
import NeedLogin from '../common/needLogin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../Themed';
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';

const TopicExploreList = () => {
  const connection = useNetworkStatus();
  const isLogin = useAppStore((state) => state.isLogin);
  const { getTopicsByApi } = useTopicStore();
  if (!connection) {
    return <NoInternetConnection />;
  } else if (!isLogin) {
    return <NeedLogin />;
  }

  useEffect(() => {
    getTopicsByApi();
  }, [])
  return (
    <SafeAreaView>
      <Text>noInternetConnection</Text>
    </SafeAreaView>
  );
};

export default TopicExploreList;
