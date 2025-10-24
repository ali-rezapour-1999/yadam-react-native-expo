import React, { Suspense, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { debounce } from "lodash";
import { t } from "i18next";
import { router } from "expo-router";
import { Image } from "expo-image";

// UI Components
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/Colors";
import { Icon } from "@/components/ui/icon";
import { User2, Wifi } from "lucide-react-native";


// Components
import Search from "@/components/common/search";
import { Loading } from "@/components/common/loading";
import TopicExploreList from "@/components/shared/topicExploreList";

// Assets
import noTopics from "@/assets/images/noTopicImage.png";
import searchNotFoundData from "@/assets/images/notFoundData.png";
import { useLocalChangeTopicStore } from "@/store/topicState/localChange";
import { useUserState } from "@/store/authState/userState";

// Lazy import
const TopicListView = React.lazy(() => import("@/components/shared/topicListView"));

/* ------------------------------------------------------------
 * Helper Components
 * ------------------------------------------------------------ */

const NoTopicsImage = () => (
  <Box className="items-center justify-center overflow-hidden">
    <Image source={noTopics} contentFit="contain" style={{ width: 300, height: 300 }} />
    <Text className="text-center text-lg mt-5" style={{ color: Colors.main.textPrimary }}>
      {t("activity.no_topics")}
    </Text>
  </Box>
);

const NotFoundDataBySearch = () => (
  <Box className="flex-1 items-center justify-start overflow-hidden">
    <Image source={searchNotFoundData} style={{ width: 250, height: 250 }} contentFit="contain" />
    <Text className="text-center text-xl" style={{ color: Colors.main.textPrimary }}>
      {t("common.messages.not_found")}
    </Text>
  </Box>
);


/* ------------------------------------------------------------
 * Search Component
 * ------------------------------------------------------------ */

const SearchInTopics = ({ onSwitchTab, tab }: { onSwitchTab: () => void, tab: TopicTab }) => {
  const { searchTopics, loadUserTopics } = useLocalChangeTopicStore();
  const [search, setSearch] = useState("");
  const user = useUserState().user;

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim()) searchTopics(value);
      }, 300),
    [searchTopics],
  );

  useEffect(() => {
    if (!user?.id) return;

    if (search.trim() === "") {
      loadUserTopics(user.id.toString());
    } else {
      debouncedSearch(search);
    }

    return () => debouncedSearch.cancel();
  }, [search, user?.id, loadUserTopics, debouncedSearch]);

  return (
    <HStack className="items-center justify-between py-3">
      <Search search={search} onChange={setSearch} />
      <Button
        className="h-14 w-14"
        style={{ backgroundColor: Colors.main.textDisabled }}
        onPress={onSwitchTab}
      >
        <Icon as={tab === TopicTab.MY_TOPICS ? Wifi : User2} size="xl" color={Colors.main.textPrimary} />
      </Button>
    </HStack>
  );
};

/* ------------------------------------------------------------
 * My Topics Section
 * ------------------------------------------------------------ */

const MyTopicsSection = () => {
  const userTopics = useLocalChangeTopicStore().userTopics;

  const NoData = useMemo(
    () => (userTopics.length == 0 ? <NotFoundDataBySearch /> : <NoTopicsImage />),
    [userTopics],
  );

  if (userTopics.length === 0) return NoData;

  return (
    <Suspense fallback={<Loading />}>
      <TopicListView data={userTopics} />
    </Suspense>
  );
};

/* ------------------------------------------------------------
 * Main Activity Screen
 * ------------------------------------------------------------ */

enum TopicTab {
  MY_TOPICS,
  EXPLORE_TOPICS,
}

const Activity = () => {
  const [activeTab, setActiveTab] = useState<TopicTab>(TopicTab.MY_TOPICS);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HStack className="items-center justify-between gap-4">
        <Heading style={styles.title} size="2xl">
          {t("activity.title")}
        </Heading>
        <Button
          className="rounded-lg px-7"
          style={styles.addButton}
          onPress={() => router.push("/tabs/(tabs)/topics/createTopics")}
        >
          <ButtonText className="text-xl">{t("event.add_topic")}</ButtonText>
        </Button>
      </HStack>

      <SearchInTopics tab={activeTab} onSwitchTab={() => setActiveTab(activeTab === TopicTab.MY_TOPICS ? TopicTab.EXPLORE_TOPICS : TopicTab.MY_TOPICS)} />

      {/* Content */}
      <Box className="flex-1">
        <Suspense fallback={<Loading />}>
          {activeTab === TopicTab.MY_TOPICS ? (
            <MyTopicsSection />
          ) : (
            <TopicExploreList />
          )}
        </Suspense>
      </Box>
    </SafeAreaView>
  );
};

export default Activity;

/* ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------ */

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
