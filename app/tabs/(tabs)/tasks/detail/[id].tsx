import HeaderTitle from '@/components/common/headerTitle';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useTodoStore } from '@/store/todoState';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { t } from 'i18next';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Dimensions, Vibration, Pressable } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolateColor, runOnJS } from 'react-native-reanimated';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { TaskStatus } from '@/constants/TaskEnum';
import { Button } from '@/components/ui/button';
import TrashIcon from '@/assets/Icons/TrushIcon';
import EditIcon from '@/assets/Icons/EditIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { Loading } from '@/components/common/loading';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.4;

const TaskDetail = () => {
  const { id } = useLocalSearchParams();
  const { task, getTaskById, updateTask, isLoading, removeTask, getTodayAllTask } = useTodoStore();
  const translateX = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        getTaskById(id.toString());
      }
    }, [id, getTaskById]),
  );

  const handleSwipeAction = async (action: TaskStatus) => {
    if (!task) return;

    await updateTask({ ...task, status: action });
    await getTaskById(task.id);
    router.push('/tabs/(tabs)/tasks');
  };

  const handleEdit = () => {
    router.push(`/tabs/(tabs)/tasks/edit/${id}`);
  };

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
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
    }
  };

  const removeHandler = () => {
    removeTask(task?.id as string).then(() => getTodayAllTask());
    router.push('/tabs/(tabs)/tasks');
  };

  const StatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
      COMPLETED: {
        bg: Colors.main.primary,
        text: Colors.main.textPrimary,
        label: t('status_enum.completed'),
        icon: '✓',
      },
      CANCELLED: {
        bg: Colors.main.accent,
        text: Colors.main.textPrimary,
        label: t('status_enum.canceled'),
        icon: '✕',
      },
      PENDING: {
        bg: Colors.main.border,
        text: Colors.main.textPrimary,
        label: t('status_enum.pending'),
        icon: '⏳',
      },
    };

    const config = statusConfig[status] ?? statusConfig['PENDING'];

    return (
      <Box style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusText, { color: config.text }]}>
          {config.icon} {config.label}
        </Text>
      </Box>
    );
  };

  const taskStatus = get(task, 'status', 'PENDING');

  const getSwipeOptions = () => {
    switch (taskStatus) {
      case TaskStatus.COMPLETED:
        return {
          left: { label: t('status_enum.canceled'), icon: '✕', color: Colors.main.accent, action: TaskStatus.CANCELLED },
          right: { label: t('status_enum.pending'), icon: '⏳', color: Colors.main.textSecondary, action: TaskStatus.PENDING },
        };
      case TaskStatus.CANCELLED:
        return {
          left: { label: t('status_enum.pending'), icon: '⏳', color: Colors.main.textSecondary, action: TaskStatus.PENDING },
          right: { label: t('status_enum.completed'), icon: '✓', color: Colors.main.primary, action: TaskStatus.COMPLETED },
        };
      default:
        return {
          left: { label: t('status_enum.canceled'), icon: '✕', color: Colors.main.accent, action: TaskStatus.CANCELLED },
          right: { label: t('status_enum.completed'), icon: '✓', color: Colors.main.primary, action: TaskStatus.COMPLETED },
        };
    }
  };

  const swipeOptions = getSwipeOptions();

  const animatedSwipeStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(translateX.value, [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD], [swipeOptions.left.color, Colors.main.cardBackground, swipeOptions.right.color]);
    return {
      transform: [{ translateX: translateX.value }],
      backgroundColor: bg,
    };
  });

  if (isLoading || isEmpty(task)) {
    return (
      <Box style={styles.screenContainer}>
        <Loading />
      </Box>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <GestureHandlerRootView style={styles.screenContainer}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <VStack space="xl">
            <HStack className="w-full items-center justify-between px-2">
              <Box className="w-4/5 flex-1">
                <HeaderTitle size="lg" />
              </Box>
              <Button className="flex items-center justify-center w-12 h-12 rounded-lg bg-transparent" onPress={removeHandler}>
                <TrashIcon size={50} />
              </Button>
            </HStack>

            <Box style={[styles.timeCard, { flex: 1 }]}>
              <Text className="text-lg">{get(task, 'title', t('task_detail.no_title'))}</Text>
            </Box>
            <Box style={styles.mainCard}>
              <VStack space="lg">
                <HStack className="justify-between items-center">
                  <Text style={styles.sectionTitle}>{t('task_detail.status')}</Text>
                  {StatusBadge(taskStatus)}
                </HStack>

                <Box style={styles.divider} />

                <VStack space="md">
                  <HStack className="justify-between items-center">
                    <Text style={styles.label}>{t('task_detail.category')}</Text>
                    <Text style={styles.value}>{get(task, 'topicsTitle', '') !== '' ? get(task, 'topicsTitle', '') : t('task_detail.no_category')}</Text>
                  </HStack>

                  {get(task, 'goalId', '') === '' ? null : (
                    <HStack className="justify-between items-center">
                      <Text style={styles.label}>{t('task_detail.goal')}</Text>
                      <Text style={styles.value}>{get(task, 'goalId', '') !== '' ? get(task, 'goalId', '') : t('task_detail.no_goal')}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>

            <HStack className="justify-between gap-2">
              <Box style={[styles.timeCard, { flex: 1 }]}>
                <Text style={styles.timeLabel}>{t('task_detail.start_date')}</Text>
                <Text style={styles.timeValue}>{get(task, 'date', '-')}</Text>
              </Box>

              <Box style={[styles.timeCard, { flex: 1 }]}>
                <Text style={styles.timeLabel}>{t('task_detail.start_time')}</Text>
                <Text style={styles.timeValue}>{get(task, 'startTime', '-')}</Text>
              </Box>

              <Box style={[styles.timeCard, { flex: 1 }]}>
                <Text style={styles.timeLabel}>{t('task_detail.end_time')}</Text>
                <Text style={styles.timeValue}>{get(task, 'endTime', '-')}</Text>
              </Box>
            </HStack>

            {get(task, 'description', '') === '' ? null : (
              <Box style={styles.descriptionCard}>
                <Text style={styles.sectionTitle}>{t('task_detail.description')}</Text>
                <Box style={styles.descriptionContent}>
                  <Text style={styles.descriptionText}>{get(task, 'description')}</Text>
                </Box>
              </Box>
            )}
          </VStack>
        </ScrollView>

        <Box style={styles.swipeAreaContainer}>
          <Pressable onPress={handleEdit} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
            <LinearGradient colors={[Colors.main.accent, Colors.main.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.editButton}>
              <EditIcon size={22} color="#fff" />
              <Text style={styles.editButtonText}>{t('task_detail.need_edit')}</Text>
            </LinearGradient>
          </Pressable>
          <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <Animated.View style={[styles.swipeHandle, animatedSwipeStyle]}>
              <HStack style={styles.handleInner}>
                <Text style={[styles.handleText, { color: '#fff' }]}>
                  {swipeOptions.left.icon} {swipeOptions.left.label}
                </Text>
                <Text>
                  {'<< '}
                  {t('event.swip')}
                  {' >>'}
                </Text>
                <Text style={[styles.handleText, { color: '#fff' }]}>
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

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.main.background },
  scrollContent: { padding: 20, paddingBottom: 160 },
  mainCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  timeCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionCard: {
    backgroundColor: Colors.main.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, color: Colors.main.textPrimary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.main.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: Colors.main.textPrimary, textAlign: 'right', maxWidth: '60%' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minWidth: 90 },
  statusText: { fontSize: 13 },
  timeLabel: { fontSize: 11, fontWeight: '600', color: Colors.main.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  timeValue: { fontSize: 15, fontWeight: '700', color: Colors.main.textPrimary },
  descriptionContent: { backgroundColor: Colors.main.background + '80', padding: 16, borderRadius: 12, marginTop: 12 },
  descriptionText: { fontSize: 14, color: Colors.main.textPrimary },
  divider: { height: 1, backgroundColor: Colors.main.textSecondary + '20', marginVertical: 8 },

  swipeAreaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: { display: 'flex', flexDirection: 'row', width: screenWidth - 40, height: 55, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12, gap: 6 },
  editButtonText: { fontSize: 16, color: '#fff' },
  swipeHandle: { height: 65, borderRadius: 30, alignItems: 'center', justifyContent: 'center', width: screenWidth - 40 },
  handleInner: { flexDirection: 'row', justifyContent: 'space-between', width: '85%', direction: 'ltr' },
  handleText: { fontSize: 15 },
});
