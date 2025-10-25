import React, { Suspense, useCallback, useMemo, useState } from "react";
import HeaderTitle from "@/components/common/headerTitle";
import { Loading } from "@/components/common/loading";
import { Text } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Category } from "@/constants/Category";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { t } from "i18next";
import { ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AppModal from "@/components/common/appModal";
import TrashIcon from "@/assets/Icons/TrushIcon";
import { useUserState } from "@/store/authState/userState";
import { useBaseStore } from "@/store/baseState/base";
import { useLocalChangeTopicStore } from "@/store/topicState/localChange";
import { useLocalChangeTaskStore } from "@/store/taskState/localChange";
import { useServerChangeTopicState } from "@/store/topicState/serverChange";

const MemoizedTopicSubTaskList = React.lazy(() => import("@/components/shared/topicSubTaskList"));

const TopicDetail: React.FC = () => {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const inExplore = params.inExplore === "true";

  const [isOpen, setIsOpen] = useState(false);
  const user = useUserState().user;
  const language = useBaseStore().language;
  const { getTopicById, topic, removeTopic } = useLocalChangeTopicStore();
  const getTaskByTopicId = useLocalChangeTaskStore().getTaskByTopicId;
  const getTopicByIdApi = useServerChangeTopicState().getTopicByIdApi;

  useFocusEffect(
    useCallback(() => {
      if (id) {
        if (inExplore) {
          getTopicByIdApi(id);
        } else {
          getTopicById(id);
          getTaskByTopicId(id);
        }
      }
    }, [id, inExplore, getTopicByIdApi, getTopicById, getTaskByTopicId])
  );

  const category = useMemo(
    () => Category.find((c) => c.id === topic?.categoryId),
    [topic?.categoryId]
  );

  const removeTopicHandler = useCallback(() => {
    if (topic?.id) {
      setIsOpen(false);
      removeTopic(topic.id);
      router.push("/tabs/(tabs)/topics");
    }
  }, [topic?.id, removeTopic]);

  if (!topic) {
    return <Loading />;
  }

  const isOwned = user && String(user.id) === String(topic.userId);
  const buttonText = isOwned && !inExplore ? t("common.button.edit") : t("common.button.add");
  const buttonAction = () => router.push(`/tabs/(tabs)/topics/edit/${id}`);
  return (
    <SafeAreaView style={styles.screenContainer}>
      <GestureHandlerRootView style={styles.screenContainer}>
        <Suspense fallback={<Loading />}>
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <VStack space="xl">
              <HStack className="items-center">
                <Box className="w-4/5 flex-1">
                  <HeaderTitle size="lg" />
                </Box>
                {isOwned && (
                  <AppModal
                    title={`${t("common.button.delete")} ${topic.title}`}
                    buttonContent={<TrashIcon size={48} />}
                    buttonStyle={{ backgroundColor: "transparent", width: 45 }}
                    modalContentStyle={{ height: 280 }}
                    modalBodyStyle={{ paddingHorizontal: 20 }}
                    onChangeVisible={() => setIsOpen(!isOpen)}
                    visible={isOpen}
                  >
                    <Text >
                      {t("common.messages.delete_item")}
                    </Text>

                    <Button
                      onPress={removeTopicHandler}
                      style={{ backgroundColor: Colors.main.button }}
                      className="rounded-lg mt-5 h-14"
                    >
                      <ButtonText
                        style={{ color: Colors.main.textPrimary }}
                        className="text-xl"
                      >
                        {t("common.button.delete")}
                      </ButtonText>
                    </Button>

                    <Button
                      style={{ backgroundColor: Colors.main.textPrimary }}
                      className="rounded-lg mt-5 h-14"
                      onPress={() => setIsOpen(!isOpen)}
                    >
                      <ButtonText
                        style={{ color: Colors.main.button }}
                        className="text-xl"
                      >
                        {t("common.button.cancel")}
                      </ButtonText>
                    </Button>
                  </AppModal>
                )}
              </HStack>

              <Box style={styles.mainCard} className="p-5 px-7">
                <Heading style={styles.headerTitle}>
                  {t("common.form.title")}
                </Heading>
                <Text className="mt-4 text-[16px] rounded-lg px-4">
                  {topic.title}
                </Text>
              </Box>

              {topic.description ? (
                <Box style={styles.mainCard} className="p-5 px-7">
                  <Heading style={styles.headerTitle}>
                    {t("task_detail.description")}
                  </Heading>
                  <Text className="mt-4 text-[14px] rounded-lg px-4">
                    {topic.description || t("task_detail.no_description_todo")}
                  </Text>
                </Box>
              ) : null}

              <Box style={styles.mainCard} className="p-5 px-7">
                <Heading style={styles.headerTitle}>
                  {t("task_detail.category")}
                </Heading>
                <Text
                  className="mt-4 text-[14px] p-3 w-max rounded-md px-5"
                  style={{ backgroundColor: category?.color + "40" }}
                >
                  {language === "fa" ? category?.fa : category?.name}
                </Text>
                <HStack
                  className="pt-2 mt-4 border-t-2 items-center justify-between"
                  style={{ borderColor: Colors.main.border }}
                >
                  <Heading style={styles.headerTitle}>
                    {t("activity.is_public")}
                  </Heading>
                  <Text className="text-[14px] p-2 rounded-lg">
                    {topic.isPublic
                      ? t("common.button.yes")
                      : t("common.button.no")}
                  </Text>
                </HStack>
              </Box>
            </VStack>
            <Suspense fallback={<Loading />}>
              <MemoizedTopicSubTaskList
                isUserTask={isOwned!}
                id={id as string}
              />
            </Suspense>
          </ScrollView>
        </Suspense>
        <Box className="px-5 mb-5">
          <Button
            className="h-16 rounded-lg"
            style={{ backgroundColor: Colors.main.button }}
            onPress={buttonAction}
          >
            <ButtonText
              style={{ color: Colors.main.textPrimary }}
              className="text-xl"
            >
              {buttonText}
            </ButtonText>
          </Button>
        </Box>
      </GestureHandlerRootView>
    </SafeAreaView>
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
  },
  headerTitle: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
});
