import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Dimensions, Vibration, Pressable } from "react-native";
import { PanGestureHandler, State, PanGestureHandlerGestureEvent, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolateColor, runOnJS } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { t } from "i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

/* ---------------------- Local Imports ---------------------- */
import HeaderTitle from "@/components/common/headerTitle";
import { Text } from "@/components/Themed";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { TaskStatus } from "@/constants/enums/TaskEnum";
import { Loading } from "@/components/common/loading";
import AppModal from "@/components/common/appModal";
import TrashIcon from "@/assets/Icons/TrushIcon";
import EditIcon from "@/assets/Icons/EditIcon";
import { useUserState } from "@/store/authState/userState";
import { useLocalChangeTaskStore } from "@/store/taskState/localChange";

/* ---------------------- Constants ---------------------- */
const { width: screenWidth } = Dimensions.get("window");
const SWIPE_THRESHOLD = screenWidth * 0.4;

/* ==========================================================
                        MAIN COMPONENT
========================================================== */
const TaskDetail = () => {
  const { id } = useLocalSearchParams();
  const user = useUserState().user;
  const { task, getTaskById, updateTask, isLoading, removeTask, getTodayAllTask } = useLocalChangeTaskStore();

  const [isOpen, setIsOpen] = useState(false);
  const translateX = useSharedValue(0);

  /* ---------------------- Lifecycle ---------------------- */
  useFocusEffect(
    useCallback(() => {
      if (id) getTaskById(id.toString());
    }, [id, getTaskById])
  );

  /* ---------------------- Handlers ---------------------- */
  const handleSwipeAction = async (action: TaskStatus) => {
    if (!task) return;
    await updateTask({ ...task, status: action });
    await getTaskById(task.id);
    router.push("/tabs/(tabs)/tasks");
  };

  const handleEdit = () => router.push(`/tabs/(tabs)/tasks/edit/${id}`);

  const removeHandler = () => {
    setIsOpen(false);
    removeTask(task?.id as string).then(() => getTodayAllTask());
    router.push("/tabs/(tabs)/tasks");
  };

  /* ---------------------- Gestures ---------------------- */
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state !== State.END) return;

    const swipeOptions = getSwipeOptions();
    const { translationX: translateXValue } = event.nativeEvent;

    if (translateXValue > SWIPE_THRESHOLD) {
      Vibration.vibrate(50);
      runOnJS(handleSwipeAction)(swipeOptions.right.action);
    } else if (translateXValue < -SWIPE_THRESHOLD) {
      Vibration.vibrate(50);
      runOnJS(handleSwipeAction)(swipeOptions.left.action);
    }

    translateX.value = withSpring(0);
  };

  /* ---------------------- UI Helpers ---------------------- */
  const StatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string; icon: string }
    > = {
      COMPLETED: {
        bg: Colors.main.primary,
        text: Colors.main.textPrimary,
        label: t("common.status_enum.completed"),
        icon: "✓",
      },
      CANCELLED: {
        bg: Colors.main.accent,
        text: Colors.main.textPrimary,
        label: t("common.status_enum.canceled"),
        icon: "✕",
      },
      PENDING: {
        bg: Colors.main.border,
        text: Colors.main.textPrimary,
        label: t("common.status_enum.pending"),
        icon: "⏳",
      },
    };

    const config = statusConfig[status] ?? statusConfig["PENDING"];

    return (
      <Box style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusText, { color: config.text }]}>
          {config.icon} {config.label}
        </Text>
      </Box>
    );
  };

  const getSwipeOptions = () => {
    switch (task?.status) {
      case TaskStatus.COMPLETED:
        return {
          left: {
            label: t("common.status_enum.canceled"),
            icon: "✕",
            color: Colors.main.accent,
            action: TaskStatus.CANCELLED,
          },
          right: {
            label: t("common.status_enum.pending"),
            icon: "⏳",
            color: Colors.main.textSecondary,
            action: TaskStatus.PENDING,
          },
        };
      case TaskStatus.CANCELLED:
        return {
          left: {
            label: t("common.status_enum.pending"),
            icon: "⏳",
            color: Colors.main.textSecondary,
            action: TaskStatus.PENDING,
          },
          right: {
            label: t("common.status_enum.completed"),
            icon: "✓",
            color: Colors.main.primary,
            action: TaskStatus.COMPLETED,
          },
        };
      default:
        return {
          left: {
            label: t("common.status_enum.canceled"),
            icon: "✕",
            color: Colors.main.accent,
            action: TaskStatus.CANCELLED,
          },
          right: {
            label: t("common.status_enum.completed"),
            icon: "✓",
            color: Colors.main.primary,
            action: TaskStatus.COMPLETED,
          },
        };
    }
  };

  /* ---------------------- Animation ---------------------- */
  const swipeOptions = getSwipeOptions();

  const animatedSwipeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor: interpolateColor(
      translateX.value,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [
        swipeOptions.left.color,
        Colors.main.cardBackground,
        swipeOptions.right.color,
      ]
    ),
  }));

  /* ---------------------- Render ---------------------- */
  if (isLoading || isEmpty(task)) {
    return (
      <Box style={styles.screenContainer}>
        <Loading />
      </Box>
    );
  }

  const isOwned = user?.id == task.userId;

  return (
    <SafeAreaView style={styles.screenContainer}>
      <GestureHandlerRootView style={styles.screenContainer}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <VStack space="xl">
            {/* ---------- Header ---------- */}
            <HStack className="w-full items-center justify-between px-2">
              <Box className="w-4/5 flex-1">
                <HeaderTitle size="lg" />
              </Box>
              {isOwned && (
                <AppModal
                  title={`${t("common.button.delete")} ${task.title}`}
                  buttonContent={<TrashIcon size={48} />}
                  buttonStyle={{ backgroundColor: "transparent", width: 45 }}
                  modalContentStyle={{ height: 280 }}
                  modalBodyStyle={{ paddingHorizontal: 20 }}
                  onChangeVisible={() => setIsOpen(!isOpen)}
                  visible={isOpen}
                >
                  <Text style={styles.modalText}>
                    {t("common.messages.delete_item")}
                  </Text>

                  <Button
                    onPress={removeHandler}
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

            {/* ---------- Title ---------- */}
            <Box style={styles.timeCard}>
              <Text className="text-lg">
                {get(task, "title", t("task_detail.no_title"))}
              </Text>
            </Box>

            {/* ---------- Status & Info ---------- */}
            <Box style={styles.mainCard}>
              <VStack space="lg">
                <HStack className="justify-between items-center">
                  <Text style={styles.sectionTitle}>
                    {t("task_detail.status")}
                  </Text>
                  {StatusBadge(task.status)}
                </HStack>

                <Box style={styles.divider} />

                <VStack space="md">
                  <HStack className="justify-between items-center">
                    <Text style={styles.label}>
                      {t("task_detail.category")}
                    </Text>
                    <Text style={styles.value}>
                      {task.topicsTitle || t("task_detail.no_category")}
                    </Text>
                  </HStack>

                  {task.goalId && (
                    <HStack className="justify-between items-center">
                      <Text style={styles.label}>{t("task_detail.goal")}</Text>
                      <Text style={styles.value}>{task.goalId}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>

            {/* ---------- Date & Time ---------- */}
            <HStack className="justify-between gap-2">
              {[
                { label: t("task_detail.start_date"), value: task.date },
                { label: t("task_detail.start_time"), value: task.startTime },
                { label: t("task_detail.end_time"), value: task.endTime },
              ].map((item, index) => (
                <Box key={index} style={styles.timeCard} className="px-9">
                  <Text style={styles.timeLabel}>{item.label}</Text>
                  <Text style={styles.timeValue}>{item.value || "-"}</Text>
                </Box>
              ))}
            </HStack>

            {/* ---------- Description ---------- */}
            {task.description && (
              <Box style={styles.descriptionCard}>
                <Text style={styles.sectionTitle}>
                  {t("common.form.description")}
                </Text>
                <Box style={styles.descriptionContent}>
                  <Text style={styles.descriptionText}>{task.description}</Text>
                </Box>
              </Box>
            )}
          </VStack>
        </ScrollView>

        {/* ---------- Bottom Actions ---------- */}
        <Box style={styles.swipeAreaContainer}>
          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <LinearGradient
              colors={[Colors.main.accent, Colors.main.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.editButton}
            >
              <EditIcon size={22} color={Colors.main.textPrimary} />
              <Text style={styles.editButtonText}>
                {t("task_detail.need_edit")}
              </Text>
            </LinearGradient>
          </Pressable>

          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View style={[styles.swipeHandle, animatedSwipeStyle]}>
              <HStack style={styles.handleInner}>
                <Text style={styles.handleText}>
                  {swipeOptions.left.icon} {swipeOptions.left.label}
                </Text>
                <Text>{`<< ${t("event.swip")} >>`}</Text>
                <Text style={styles.handleText}>
                  {swipeOptions.right.label} {swipeOptions.right.icon}
                </Text>
              </HStack>
            </Animated.View>
          </PanGestureHandler>
        </Box>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default TaskDetail;

/* ==========================================================
                        STYLES
========================================================== */
const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.main.background },
  scrollContent: { padding: 20, paddingBottom: 160 },
  modalText: {
    color: Colors.main.textPrimary,
    fontSize: 18,
    textAlign: "center",
  },
  mainCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: Colors.main.background,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  timeCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.main.background,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  descriptionCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: Colors.main.background,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
  },
  sectionTitle: { fontSize: 18, color: Colors.main.textPrimary },
  label: { fontSize: 14, fontWeight: "600", color: Colors.main.textSecondary },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.main.textPrimary,
    textAlign: "right",
    maxWidth: "60%",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 90,
  },
  statusText: { fontSize: 13 },
  timeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.main.textSecondary,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.main.textPrimary,
  },
  descriptionContent: {
    backgroundColor: Colors.main.background + "80",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  descriptionText: { fontSize: 14, color: Colors.main.textPrimary },
  divider: {
    height: 1,
    backgroundColor: Colors.main.textSecondary + "20",
    marginVertical: 8,
  },

  /* ----- Bottom Area ----- */
  swipeAreaContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    flexDirection: "row",
    width: screenWidth - 40,
    height: 55,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 6,
  },
  editButtonText: { fontSize: 16, color: Colors.main.textPrimary },
  swipeHandle: {
    height: 65,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth - 40,
  },
  handleInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    direction: "ltr",
  },
  handleText: { fontSize: 15, color: Colors.main.textPrimary },
});
