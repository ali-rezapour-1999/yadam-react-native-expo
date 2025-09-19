import React, { Suspense, useCallback } from 'react';
import TrashIcon from '@/assets/Icons/TrushIcon';
import HeaderTitle from '@/components/common/headerTitle';
import { Loading } from '@/components/common/loading';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Category } from '@/constants/Category';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useTopicStore } from '@/store/topcisState';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TopicSubTaskList from '@/components/shared/topicSubTaskList';
import { useTodoStore } from '@/store/todoState';

const TopicDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const { language } = useAppStore();
  const { getTopicById, topic, removeTopic } = useTopicStore();
  const { getTaskByTopicId } = useTodoStore();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getTopicById(id as string);
        getTaskByTopicId(id as string);
      }
    }, [id]),
  );

  const category = Category.find((c) => c.id === topic?.categoryId);

  const removeTopicHandler = () => {
    removeTopic(topic!.id);
    router.push('/tabs/(tabs)/topics');
  };

  return (
    <GestureHandlerRootView style={styles.screenContainer}>
      <Suspense fallback={<Loading />}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <VStack space="xl">
            <HStack className="items-center justify-between ">
              <HeaderTitle path={'/tabs/(tabs)/topics'} size="md" width="[80%]" />
              <Pressable onPress={removeTopicHandler}>
                <TrashIcon size={48} />
              </Pressable>
            </HStack>

            <Box style={styles.mainCard} className="p-5 px-7">
              <Heading style={styles.headerTitle}>{t('task_detail.title')}</Heading>
              <Text className="mt-4 text-[16px]  rounded-lg px-4">{topic?.title}</Text>
            </Box>

            {topic?.description ? (
              <Box style={styles.mainCard} className="p-5 px-7">
                <Heading style={styles.headerTitle}>{t('task_detail.description')}</Heading>
                <Text className="mt-4 text-[14px]  rounded-lg px-4">{topic?.description || t('task_detail.no_description_todo')}</Text>
              </Box>
            ) : null}

            <Box style={styles.mainCard} className="p-5 px-7">
              <Heading style={styles.headerTitle}>{t('task_detail.category')}</Heading>
              <Text className="mt-4 text-[14px] p-2 w-max rounded-lg px-5" style={{ backgroundColor: category?.color + '40' }}>
                {language === 'fa' ? category?.fa : category?.name}
              </Text>
              <HStack className="pt-2 mt-4 border-t-2  items-center justify-between" style={{ borderColor: Colors.main.border }}>
                <Heading style={styles.headerTitle}>{t('activity.is_public')}</Heading>
                <Text className="text-[14px] p-2 rounded-lg">{topic?.isPublic ? t('activity.yes') : t('activity.no')}</Text>
              </HStack>
            </Box>
          </VStack>
          <TopicSubTaskList id={id as string} />
        </ScrollView>
      </Suspense>
      <Box className="px-5 mb-5">
        <Button className="h-16 rounded-lg" style={{ backgroundColor: Colors.main.button }} onPress={() => router.push(`/tabs/(tabs)/topics/edit/${id}`)}>
          <ButtonText className="text-xl">{t('button.edit')}</ButtonText>
        </Button>
      </Box>
    </GestureHandlerRootView>
  );
};

export default TopicDetail;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  mainCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
});
