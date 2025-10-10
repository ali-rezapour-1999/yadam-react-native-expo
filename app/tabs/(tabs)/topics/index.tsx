import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import { t } from 'i18next';
import { router } from 'expo-router';
import { Image } from 'expo-image';

// UI Components
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';

// Stores
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';

// Components
import Search from '@/components/common/search';
import { Loading } from '@/components/common/loading';
import TopicExploreList from '@/components/shared/topicExploreList';

// Assets & Lazy Imports
import noTopics from '@/assets/images/noTopicImage.png';
import searchNotFoundData from '@/assets/images/notFoundData.png';
const TopicListView = React.lazy(() => import('@/components/shared/topicListView'));

/**
 * ------------------------------------------------------------
 * Helper Components
 * ------------------------------------------------------------
 */

const NoTopicsImage = () => (
  <Box className="items-center justify-center overflow-hidden">
    <Image source={noTopics} contentFit="contain" style={{ width: 300, height: 300 }} />
    <Text className="text-center text-lg mt-5" style={{ color: Colors.main.textPrimary }}>
      {t('activity.not_topics')}
    </Text>
  </Box>
);

const NotFoundDataBySearch = () => (
  <Box className="flex-1 items-center justify-start overflow-hidden">
    <Image source={searchNotFoundData} style={{ width: 250, height: 250 }} contentFit="contain" />
    <Text className="text-center text-xl" style={{ color: Colors.main.textPrimary }}>
      {t('activity.not_found_data')}
    </Text>
  </Box>
);

/**
 * ------------------------------------------------------------
 * Enums & Sub Components
 * ------------------------------------------------------------
 */

enum TopicTab {
  MY_TOPICS,
  EXPLORE_TOPICS,
}

const MyTopicsSection = () => {
  const { loadUserTopics, userTopics, searchTopics } = useTopicStore();
  const { user } = useAppStore();
  const [search, setSearch] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim()) searchTopics(value);
      }, 300),
    [searchTopics]
  );

  useEffect(() => {
    if (!user?.id) return;

    if (search.trim() === '') {
      loadUserTopics(user.id.toString());
    } else {
      debouncedSearch(search);
    }

    return () => debouncedSearch.cancel();
  }, [search, user?.id, loadUserTopics, debouncedSearch]);

  const NoData = useMemo(() => (search.trim() ? <NotFoundDataBySearch /> : <NoTopicsImage />), [search]);

  return (
    <>
      <Search search={search} onChange={setSearch} />
      {userTopics.length === 0 ? (
        NoData
      ) : (
        <Suspense fallback={<Loading />}>
          <TopicListView data={userTopics} />
        </Suspense>
      )}
    </>
  );
};

/**
 * ------------------------------------------------------------
 * Main Activity Screen
 * ------------------------------------------------------------
 */

const Activity = () => {
  const [activeTab, setActiveTab] = useState<TopicTab>(TopicTab.MY_TOPICS);

  const handleTabChange = (tab: TopicTab) => setActiveTab(tab);

  const renderTabButton = (label: string, tab: TopicTab) => (
    <Button
      className="w-1/2 rounded-lg"
      style={{ backgroundColor: activeTab === tab ? Colors.main.button : Colors.main.border }}
      onPress={() => handleTabChange(tab)}
    >
      <Text style={styles.title}>{label}</Text>
    </Button>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HStack className="items-center justify-between gap-4">
        <Heading style={styles.title} size="2xl">
          {t('activity.title')}
        </Heading>
        <Button
          className="rounded-lg px-7"
          style={styles.addButton}
          onPress={() => router.push('/tabs/(tabs)/topics/createTopics')}
        >
          <ButtonText className="text-xl">{t('event.add_topic')}</ButtonText>
        </Button>
      </HStack>

      {/* Tabs */}
      <HStack className="w-full px-4 mt-4 justify-center items-center gap-4 mx-auto">
        {renderTabButton(t('activity.my_topics'), TopicTab.MY_TOPICS)}
        {renderTabButton(t('activity.explore_topics'), TopicTab.EXPLORE_TOPICS)}
      </HStack>

      {/* Content */}
      <Box className="flex-1">
        <Suspense fallback={<Loading />}>
          {activeTab === TopicTab.MY_TOPICS ? <MyTopicsSection /> : <TopicExploreList />}
        </Suspense>
      </Box>
    </SafeAreaView>
  );
};

export default Activity;

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
    padding: 16,
  },
  title: {
    color: Colors.main.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.main.button,
  },
});
