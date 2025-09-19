import React from 'react';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from '../common/noInternetConnection';
import NeedLogin from '../common/needLogin';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../Themed';

const TopicExploreList = () => {
  const connection = useNetworkStatus();
  //const isLogin = useAppStore((state) => state.isLogin);
  const isLogin = false;
  if (!connection) {
    return <NoInternetConnection />;
  } else if (!isLogin) {
    return <NeedLogin />;
  }
  return (
    <SafeAreaView>

      <Text>noInternetConnection</Text>
    </SafeAreaView>
  );
};

export default TopicExploreList;
