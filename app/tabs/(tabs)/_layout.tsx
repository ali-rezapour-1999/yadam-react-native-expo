import { Tabs } from 'expo-router';
import HomeIcon from '@/assets/Icons/Home';
import TodoIcon from '@/assets/Icons/Todo';
import ActiveIcon from '@/assets/Icons/ActiveIcon';
import { CustomTabBar } from '@/components/common/buttonNavigation';
import { useSharedValue } from 'react-native-reanimated';

export default function TabLayout() {
  const scrollY = useSharedValue(0);
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar scrollY={scrollY} {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon focused={!focused} />,
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="tasks/index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused }) => <TodoIcon focused={!focused} />,
          animation: 'shift',
        }}
      />
      <Tabs.Screen
        name="topics/index"
        options={{
          title: 'Topics',
          tabBarIcon: ({ focused }) => <ActiveIcon focused={!focused} />,
          animation: 'shift',
        }}
      />
    </Tabs>
  );
}
