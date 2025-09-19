import React from 'react';
import { useNetworkStatus } from '@/hooks/networkStatus';
import Search from '../common/search';
import NoInternetConnection from '../common/noInternetConnection';
import { useAppStore } from '@/store/appState';
import NeedLogin from '../common/needLogin';

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
    <>
      <Search />
    </>
  );
};

export default TopicExploreList;
