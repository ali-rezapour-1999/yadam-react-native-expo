import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, I18nManager, TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { t } from "i18next";
import { useTaskForm } from "@/hooks/useTaskForm";
import { Box } from "@/components/ui/box";
import { TodoBasicFields } from "@/components/shared/forms/todoBaseField";
import TaskAdvancedFields from "@/components/shared/forms/taskAdvancedField";
import HeaderTitle from "@/components/common/headerTitle";
import { Text } from "@/components/Themed";
import { ChevronUpIcon, Icon } from "@/components/ui/icon";
import { Controller } from "react-hook-form";
import DaySelector from "@/components/common/daySelecter";
import TopicSelector from "@/components/shared/topicSelector";
import { CancelIcon } from "@/assets/Icons/Cancel";
import ModalOption from "@/components/common/modelOption";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBaseStore } from "@/store/baseState/base";
import { useLocalChangeTaskStore } from "@/store/taskState/localChange";
import { useUserState } from "@/store/authState/userState";
import { useLocalChangeTopicStore } from "@/store/topicState/localChange";

const EditTask: React.FC = () => {
  const selectedDate = useBaseStore().selectedDate;
  const task = useLocalChangeTaskStore().task;
  const user = useUserState().user;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userTopics, loadUserTopics } = useLocalChangeTopicStore();

  useEffect(() => {
    loadUserTopics(user?.id as string);
  }, [loadUserTopics]);

  const { form, onSubmit } = useTaskForm({ selectedDate, task });
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const selectedCategoryId = watch("topicId");

  const selectedTopic = userTopics.find(
    (topic) => topic.id === selectedCategoryId
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Box className="mt-5">
          <HeaderTitle
            title={t("todos.edit_event")}
            path={`/tabs/(tabs)/tasks/detail/${task?.id}`}
          />
        </Box>
        <Box style={styles.section}>
          <TodoBasicFields
            control={control}
            errors={errors}
            startTime={startTime}
            endTime={endTime}
          />
        </Box>

        <Box style={styles.section}>
          <TouchableOpacity
            style={[
              styles.sectionButton,
              { opacity: userTopics.length === 0 ? 0.7 : 1 },
            ]}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
            disabled={userTopics.length === 0}
          >
            <Box style={styles.sectionButtonContent}>
              <Text style={styles.sectionTitle}>{t("activity.title")}</Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { display: userTopics.length === 0 ? "flex" : "none" },
                ]}
              >
                {t("activity.no_topics")}
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { display: selectedTopic ? "flex" : "none" },
                ]}
              >
                {selectedTopic ? selectedTopic.title : ""}
              </Text>
            </Box>
            {userTopics.length === 0 && <CancelIcon color={"transparent"} />}
            {userTopics.length > 0 && (
              <Icon
                as={ChevronUpIcon}
                size="md"
                color={Colors.main.textSecondary}
              />
            )}
          </TouchableOpacity>
          <Controller
            name="topicId"
            control={control}
            render={({ field }) => (
              <TopicSelector
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                topics={userTopics}
                selectedTopicId={field.value}
                onSelectTopic={field.onChange}
              />
            )}
          />
        </Box>

        <Box style={styles.section}>
          <ModalOption title={t("event.options")} style={{ padding: 16 }}>
            <Controller
              name="reminderDays"
              control={control}
              render={({ field }) => <DaySelector field={field} />}
            />
            <TaskAdvancedFields control={control} />
          </ModalOption>
        </Box>
      </KeyboardAvoidingView>
      <Button
        onPress={handleSubmit(onSubmit)}
        style={styles.fabButton}
        className="rounded-xl shadow-lg"
      >
        <ButtonText style={styles.fabText}>
          {t("common.button.edit")}
        </ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default EditTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.background,
  },
  keyboardView: {
    paddingHorizontal: 18,
  },
  section: {
    marginBottom: 10,
  },
  sectionButton: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowRadius: 2,
  },
  sectionButtonContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.main.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.main.textSecondary,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.main.background,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowRadius: 8,
    height: 130,
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
