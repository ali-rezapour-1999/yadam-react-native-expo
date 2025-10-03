import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Search from '@/components/common/search';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';
import { t } from 'i18next';
import { StyleSheet } from 'react-native';
import noTopics from '@/assets/images/noTopicImage.png';
import searchNotFoundData from '@/assets/images/notFoundData.png';
import { Text } from '@/components/Themed';
import { debounce } from 'lodash';
import { Loading } from '@/components/common/loading';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopicExploreList from '@/components/shared/topicExploreList';

const TopicListView = React.lazy(() => import("@/components/shared/topicListView"))

const NoTopicsImage = () => {
  return (
    <Box className="items-center justify-center overflow-hidden">
      <Image source={noTopics} contentFit="contain" style={{ width: 300, height: 300 }} />
      <Text className="text-center text-lg mt-5" style={{ color: Colors.main.textPrimary }}>
        {t('activity.not_topics')}
      </Text>
    </Box>
  );
};

const NotFoundDataBySearch = () => {
  return (
    <Box className="flex-1 items-center justify-start overflow-hidden">
      <Image source={searchNotFoundData} style={{ width: 250, height: 250 }} contentFit="contain" />
      <Text className="text-center text-xl " style={{ color: Colors.main.textPrimary }}>
        {t('activity.not_found_data')}
      </Text>
    </Box>
  );
};

enum TopicSelect {
  MY_TOPICS,
  EXPLORE_TOPICS,
}

const MyTopicsSection = () => {
  const { loadUserTopics, userTopics, searchTopics } = useTopicStore();
  const [search, onChange] = useState<string>('');
  const { user } = useAppStore();

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim() !== '') {
        searchTopics(value);
      }
    }, 300),
    [user, searchTopics],
  );

  useEffect(() => {
    if (search.trim() === '') {
      const userIdStr = user?.id.toString();
      if (!userIdStr) return;
      loadUserTopics(userIdStr);
    }
  }, [search]);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search]);

  const NoData = useCallback(() => {
    if (search.trim() === '') {
      return <NoTopicsImage />;
    } else {
      return <NotFoundDataBySearch />;
    }
  }, [search]);

  return (
    <>
      <Search search={search} onChange={onChange} />
      {userTopics.length === 0 ? NoData() : <Suspense fallback={<Loading />}><TopicListView data={userTopics} /></Suspense>}
    </>
  );
};

const Activity = () => {
  const [topicSelect, setTopicSelect] = useState<TopicSelect>(TopicSelect.MY_TOPICS);

  return (
    <SafeAreaView style={styles.container}>
      <HStack className="items-center justify-between gap-4">
        <Heading style={styles.title} size="2xl">
          {t('activity.title')}
        </Heading>
        <Button className="rounded-lg px-7" style={styles.addButton} onPress={() => router.push('/tabs/(tabs)/topics/createTopics')}>
          <Text className='text-xl'>{t('event.add_topic')}</Text>
        </Button>
      </HStack>
      <HStack className="w-full px-4 mt-4 justify-center items-center gap-4 mx-auto">
        <Button
          className="w-1/2 rounded-lg"
          style={{ backgroundColor: topicSelect === TopicSelect.MY_TOPICS ? Colors.main.button : Colors.main.border }}
          onPress={() => setTopicSelect(TopicSelect.MY_TOPICS)}
        >
          <Text style={styles.title}>{t('activity.my_topics')}</Text>
        </Button>
        <Button
          className="w-1/2 rounded-lg"
          style={{ backgroundColor: topicSelect === TopicSelect.EXPLORE_TOPICS ? Colors.main.button : Colors.main.border }}
          onPress={() => setTopicSelect(TopicSelect.EXPLORE_TOPICS)}
        >
          <Text style={styles.title}>{t('activity.explore_topics')}</Text>
        </Button>
      </HStack>

      <Box className="flex-1">
        <Suspense fallback={<Loading />}>{topicSelect === TopicSelect.MY_TOPICS ? <MyTopicsSection /> : <TopicExploreList />}</Suspense>
      </Box>
    </SafeAreaView>
  );
};

export default Activity;

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
