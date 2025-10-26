import React, { useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { MotiView, motify } from "moti";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Colors } from "@/constants/Colors";
import { Pressable } from "../ui/pressable";
import { Box } from "../ui/box";
import AddButton from "./addButton";
import { useBaseStore } from "@/store/baseState/base";

const ANIMATION_DURATION = 150;
const TAB_HEIGHT = 60;

const MotiPressable = motify(Pressable)();

/* ---------------------- Tab Button Component ---------------------- */
const TabButton = React.memo(({ route, isFocused, onPress, IconComponent, }: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  IconComponent?: React.ComponentType<{ focused: boolean; color: string; size: number }>;
}) => {
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withTiming(isFocused ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [isFocused]);

  const animatedColor = useDerivedValue(() => {
    return interpolateColor(
      animatedValue.value,
      [0, 1],
      [Colors.main.primaryLight, Colors.main.primary]
    );
  });


  return (
    <MotiPressable
      key={route.key}
      onPress={onPress}
      style={styles.tabButton}
      animate={{ scale: isFocused ? 1.1 : 1 }}
      transition={{ type: "timing", duration: ANIMATION_DURATION }}
    >
      {IconComponent && (
        <Animated.View style={{ transform: [{ scale: isFocused ? 1.1 : 1 }] }}>
          <IconComponent focused={isFocused} color={animatedColor.value} size={20} />
        </Animated.View>
      )}
    </MotiPressable>
  );
}
);

TabButton.displayName = "TabButton";

/* ---------------------- Main Custom TabBar ---------------------- */
export const CustomTabBar: React.FC<BottomTabBarProps & { scrollY?: any }> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const hideScroll = useBaseStore().hideScroll;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(hideScroll ? 100 : 0, { duration: 150 }) },
    ],
    opacity: withTiming(hideScroll ? 0 : 1, { duration: 150 }),
  }));

  const visibleRoutes = useMemo(
    () =>
      state.routes.filter(
        (route) =>
          ![
            "tasks/createTask",
            "tasks/detail/[id]",
            "tasks/edit/[id]",
            "topics/createTopics",
            "topics/edit/[id]",
            "topics/detail/[id]",
          ].includes(route.name)
      ),
    [state.routes]
  );

  const hideTabBar = useMemo(
    () =>
      [
        "tasks/detail/[id]",
        "tasks/createTask",
        "tasks/edit/[id]",
        "topics/createTopics",
        "topics/detail/[id]",
        "topics/edit/[id]",
      ].includes(state.routes[state.index].name),
    [state.routes, state.index]
  );

  const handleTabPress = useCallback(
    (routeName: string, isFocused: boolean) => {
      if (!isFocused) navigation.navigate(routeName);
    },
    [navigation]
  );

  const containerStyle = useMemo(
    () => ({
      bottom: insets.bottom + 5,
      backgroundColor: Colors.main.cardBackground,
      borderRadius: 16,
    }),
    [insets.bottom]
  );

  return (
    <Box
      className="relative"
      style={{
        backgroundColor: Colors.main.background,
        direction: "ltr",
        display: hideTabBar ? "none" : "flex",
      }}
    >
      <MotiView
        style={[styles.container, containerStyle, animatedStyle]}
        transition={{ type: "timing", duration: 200 }}
      >
        <View style={styles.tabContainer}>
          {visibleRoutes.map((route) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === state.routes.indexOf(route);
            const IconComponent = options.tabBarIcon;

            return (
              <TabButton
                key={route.key}
                route={route}
                isFocused={isFocused}
                onPress={() => handleTabPress(route.name, isFocused)}
                IconComponent={IconComponent}
              />
            );
          })}
          <AddButton />
        </View>
      </MotiView>
    </Box>
  );
};

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: TAB_HEIGHT,
    marginHorizontal: 50,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    gap: 14,
    paddingLeft: 30,
  },
  tabButton: {
    height: TAB_HEIGHT,
    justifyContent: "center",
  },
});
