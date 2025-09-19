import { memo, useMemo, useCallback, useState } from 'react';
import { MotiView } from 'moti';
import { Platform, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, AddIcon, GlobeIcon } from '@/components/ui/icon';
import { usePathname, useRouter } from 'expo-router';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text } from '../Themed';
import { Box } from '../ui/box';
import { Plus } from 'lucide-react-native';
import { useAppStore } from '@/store/appState';

const BUTTON_SIZE = 64;
interface MenuItemProps {
  onPress: () => void;
  icon: React.ComponentType<any>;
  text: string;
  animationProps: {
    from: { opacity: number; translateY: number };
    animate: { opacity: number; translateY: number };
    transition: { type: 'spring'; damping: number; stiffness: number };
  };
  style?: ViewStyle;
  isRTL?: boolean;
}
interface ShadowStyles {
  shadow: ViewStyle;
}

const shadowStyles = StyleSheet.create<ShadowStyles>({
  shadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    android: { elevation: 2, shadowColor: '#000' },
    default: {},
  }),
});

const MenuItem: React.FC<MenuItemProps> = memo(({ onPress, icon, text, animationProps, style, isRTL }) => (
  <MotiView
    {...animationProps}
    style={[
      styles.menuItem,
      shadowStyles.shadow,
      style,
      isRTL
        ? { left: 0, right: undefined, flexDirection: 'row-reverse' }
        : { right: 0, left: undefined, flexDirection: 'row' },
    ]}
  >
    <Pressable onPress={onPress} style={styles.menuItemPressable}>
      <Icon as={icon} size="md" color={Colors.main.info} style={styles.iconMargin} />
      <Text style={styles.menuItemText}>{text}</Text>
    </Pressable>
  </MotiView>
));


MenuItem.displayName = 'MenuItem';

const AddButton: React.FC = memo(() => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const language = useAppStore.getState().language

  const isHidden = useMemo(() => path === '/tabs/(profile)', [path]);

  const containerStyle = useMemo(() => [styles.container, isHidden && styles.hidden], [isHidden]);

  const gradientButtonStyle = useMemo(() => [styles.gradientButton, shadowStyles.shadow], []);

  const gradientColors = useMemo(() => [Colors.main.button, Colors.main.lightBlue] as const, []);
  const gradientColorsIsOpen = useMemo(() => [Colors.main.button, Colors.main.accent] as const, []);
  const gradientStart = useMemo(() => ({ x: 0, y: 0 }), []);
  const gradientEnd = useMemo(() => ({ x: 1, y: 1 }), []);

  const firstMenuAnimation = {
    from: { opacity: 0, translateY: 0 },
    animate: { opacity: 1, translateY: -65 },
    transition: { type: 'spring', damping: 30, stiffness: 400 } as const,
  };

  const secondMenuAnimation = {
    from: { opacity: 0, translateY: 0 },
    animate: { opacity: 1, translateY: -130 },
    transition: { type: 'spring', damping: 30, stiffness: 400 } as const,
  };

  const addTaskText = useMemo(() => t('button.add_task'), []);
  const addByAiText = useMemo(() => t('activity.create_topics'), []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleAddTask = useCallback(() => {
    handleClose();
    router.push('/tabs/(tabs)/tasks/createTask');
  }, [handleClose]);

  const handleAddByAi = useCallback(() => {
    router.push('/tabs/(tabs)/topics/createTopics');
    handleClose();
  }, [router, handleClose]);

  if (isHidden) {
    return null;
  }


  return (
    <Box style={containerStyle}>
      {isOpen && (
        <Box style={styles.overlay}>
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
        </Box>
      )}

      <Pressable onPress={toggleOpen}>
        <LinearGradient colors={!isOpen ? gradientColors : gradientColorsIsOpen} start={gradientStart} end={gradientEnd} style={gradientButtonStyle}>
          <MotiView
            animate={{
              rotate: isOpen ? '45deg' : '0deg',
            }}
            transition={{
              type: 'timing',
              duration: 200,
            }}
          >
            <Plus color={Colors.main.textPrimary} />
          </MotiView>
        </LinearGradient>
      </Pressable>

      {isOpen && (
        <>
          <MenuItem onPress={handleAddTask} icon={AddIcon} text={addTaskText} animationProps={firstMenuAnimation} style={styles.menuItemStyle} isRTL={language == 'fa' ? true : false} />
          <MenuItem onPress={handleAddByAi} icon={GlobeIcon} text={addByAiText} animationProps={secondMenuAnimation} style={styles.menuItemStyle} isRTL={language == 'fa' ? true : false} />
        </>
      )}
    </Box>
  );
});

AddButton.displayName = 'AddButton';

export default AddButton;

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 1001,
  },
  hidden: {
    display: 'none',
  },
  overlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 1000,
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gradientButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002,
  },
  menuItem: {
    position: 'absolute',
    zIndex: 1002,
    flexDirection: 'row',
  },
  menuItemPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.main.cardBackground,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: 180,
    justifyContent: 'flex-start',
    borderRadius: 12,
  },
  menuItemText: {
    color: Colors.main.textPrimary,
    fontSize: 15,
  },
  iconMargin: {
    marginHorizontal: 8,
  },
  menuItemStyle: {
    width: 180,
    alignItems: 'center',
  },
});
