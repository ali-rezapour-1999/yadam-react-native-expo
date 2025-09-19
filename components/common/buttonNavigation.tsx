import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '../ui/pressable';
import { Colors } from '@/constants/Colors';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView, motify } from 'moti';
import { interpolateColor, useSharedValue, withTiming } from 'react-native-reanimated';
import AddButton from './addButton';
import { Box } from '../ui/box';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

type TabBarIcon = React.ComponentType<TabBarIconProps>;

const MotiPressable = motify(Pressable)();

const ANIMATION_DURATION = 150;
const TAB_HEIGHT = 60;

const TabButton = React.memo<{
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  IconComponent?: TabBarIcon;
}>(({ route, isFocused, onPress, IconComponent }) => {
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withTiming(isFocused ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [isFocused, animatedValue]);

  const animatedStyle = useMemo(
    () => ({
      color: interpolateColor(animatedValue.value, [0, 1], [Colors.main.primaryLight, Colors.main.primary]),
    }),
    [animatedValue],
  );

  return (
    <MotiPressable key={route.key} onPress={onPress} style={styles.tabButton} animate={{ scale: isFocused ? 1.1 : 1 }} transition={{ type: 'timing', duration: ANIMATION_DURATION }}>
      {IconComponent && <IconComponent focused={isFocused} color={animatedStyle.color} size={28} />}
    </MotiPressable>
  );
});

TabButton.displayName = 'TabButton';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const visibleRoutes = useMemo(
    () =>
      state.routes.filter(
        (route) =>
          route.name !== 'addTodoAi' &&
          route.name !== 'tasks/createTask' &&
          route.name !== 'tasks/detail/[id]' &&
          route.name !== 'tasks/edit/[id]' &&
          route.name !== 'topics/createTopics' &&
          route.name !== 'topics/edit/[id]' &&
          route.name !== 'topics/detail/[id]',
      ),
    [state.routes],
  );
  const hideTabBar = useMemo(
    () =>
      state.routes[state.index].name === 'tasks/detail/[id]' ||
      state.routes[state.index].name === 'tasks/createTask' ||
      state.routes[state.index].name === 'tasks/edit/[id]' ||
      state.routes[state.index].name === 'topics/createTopics' ||
      state.routes[state.index].name === 'topics/detail/[id]' ||
      state.routes[state.index].name === 'topics/edit/[id]',
    [state.routes, state.index],
  );

  const handleTabPress = useCallback(
    (routeName: string, isFocused: boolean) => {
      if (!isFocused) {
        navigation.navigate(routeName);
      }
    },
    [navigation],
  );

  const containerStyle = useMemo(
    () => ({
      bottom: insets.bottom + 14,
      backgroundColor: Colors.main.cardBackground,
      borderRadius: 16,
    }),
    [insets.bottom],
  );

  const addButtonStyle = useMemo(
    () => ({
      zIndex: 1000,
    }),
    [insets.bottom],
  );

  return (
    <Box className="relative" style={{ backgroundColor: Colors.main.background, direction: 'ltr' }}>
      <MotiView
        style={[styles.container, containerStyle, { display: hideTabBar ? 'none' : 'flex', direction: 'ltr' }]}
        animate={{ translateY: 0 }}
        from={{ translateY: 100 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <View style={styles.tabContainer}>
          {visibleRoutes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === state.routes.indexOf(route);
            const IconComponent = options.tabBarIcon;

            return <TabButton key={route.key} route={route} index={index} isFocused={isFocused} onPress={() => handleTabPress(route.name, isFocused)} IconComponent={IconComponent} />;
          })}
        </View>

        <Box style={[addButtonStyle, { display: hideTabBar ? 'none' : 'flex', marginRight: -10 }]}>
          <AddButton />
        </Box>
      </MotiView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: TAB_HEIGHT,
    marginHorizontal: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
    paddingHorizontal: 10,
    flex: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: TAB_HEIGHT,
  },
});
