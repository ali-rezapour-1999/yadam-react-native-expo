import React, { useEffect, useState, useMemo, useCallback } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t } from "i18next";
import { Controller } from "react-hook-form";
import { useLocalSearchParams } from "expo-router";
import { ArrowRightFromLine } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Text, View } from "@/components/Themed";
import { Colors } from "@/constants/Colors";
import { Icon } from "@/components/ui/icon";

import { TodoBasicFields } from "@/components/shared/forms/todoBaseField";
import TaskAdvancedFields from "@/components/shared/forms/taskAdvancedField";
import DaySelector from "@/components/common/daySelecter";
import TopicSelector from "@/components/shared/topicSelector";

import HeaderTitle from "@/components/common/headerTitle";
import { useBaseStore } from "@/store/baseState/base";
import { useUserState } from "@/store/authState/userState";
import { useLocalChangeTopicStore } from "@/store/topicState/localChange";
import { useTaskForm } from "@/hooks/useTaskForm";
import AppDrower from "@/components/common/appDrower";

const CreateTask: React.FC = () => {
  const selectedDate = useBaseStore((state) => state.selectedDate);
  const user = useUserState().user;
  const { userTopics, loadUserTopics } = useLocalChangeTopicStore();
  const { topicId: topicIdFromRoute } = useLocalSearchParams<{
    topicId?: string;
  }>();
  const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);

  useEffect(() => {
    if (user?.id) loadUserTopics(user.id);
  }, [user?.id, loadUserTopics]);

  const { form, onSubmit } = useTaskForm({ selectedDate, topicNumber: topicIdFromRoute });

  const { control, handleSubmit, formState: { errors }, watch } = form;

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const selectedCategoryId = watch("topicId");
  const selectedTopic = useMemo(() => userTopics.find((topic) => topic.id === selectedCategoryId), [selectedCategoryId, userTopics]);

  const handleTopicPress = useCallback(() => {
    if (userTopics.length > 0) setIsTopicModalVisible(true);
  }, [userTopics]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <HeaderTitle title={t("event.create_task")} />

          {/* Basic Task Info */}
          <View style={styles.card}>
            <TodoBasicFields
              control={control}
              errors={errors}
              startTime={startTime}
              endTime={endTime}
            />
          </View>

          {/* Topic Selector */}
          <Button
            style={[styles.selectorCard, { direction: "ltr" }]}
            onPress={handleTopicPress}
            disabled={userTopics.length === 0}
          >
            <Text style={styles.selectorValue}>
              {selectedTopic ? selectedTopic.title : userTopics.length === 0 ? t("activity.no_topics") : t("event.select_topics")}
            </Text>
            <Icon
              as={ArrowRightFromLine}
              size="md"
              color={Colors.main.textSecondary}
            />
          </Button>

          <Controller
            name="topicId"
            control={control}
            render={({ field }) => (
              <TopicSelector
                visible={isTopicModalVisible}
                onClose={() => setIsTopicModalVisible(false)}
                topics={userTopics}
                selectedTopicId={field.value}
                onSelectTopic={field.onChange}
              />
            )}
          />

          {/* Advanced Options */}
          <AppDrower title={t("event.options")} style={styles.AppDrower} trigger={<Text style={{ color: Colors.main.textPrimary }}>{t("event.options")}</Text>} triggerStyle={{ padding: 20 }}>
            <Controller
              name="reminderDays"
              control={control}
              render={({ field }) => <DaySelector field={field} selectDate={selectedDate} />}
            />
            <TaskAdvancedFields control={control} />
          </AppDrower>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        style={styles.fabButton}
        className="rounded-xl shadow-lg"
      >
        <ButtonText style={styles.fabText}>{t("common.button.add")}</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default CreateTask;

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.main.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.main.textSecondary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    marginBottom: 20,
  },
  selectorCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    height: 80,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorTitle: {
    fontSize: 15,
    color: Colors.main.textSecondary,
  },
  selectorValue: {
    fontSize: 17,
    color: Colors.main.textPrimary,
    fontWeight: "600",
  },
  AppDrower: {
    padding: 16,
    borderRadius: 16,
  },
  fabButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "90%",
    height: 58,
    backgroundColor: Colors.main.button,
    justifyContent: "center",
  },
  fabText: {
    fontSize: 18,
    color: Colors.main.textPrimary,
    textAlign: "center",
  },
});
