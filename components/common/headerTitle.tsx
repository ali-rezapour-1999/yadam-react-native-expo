import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BackIcon from '@/assets/Icons/Back';
import { useAppStore } from '@/store/appState';

import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';

interface HeaderTitleProps {
  title?: string;
  path?: string;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  center?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
  title,
  path,
  isLight = false,
  size = '2xl',
  center = false,
}) => {
  const { language } = useAppStore();

  const handleBackPress = () => {
    if (path) router.push(path as any);
    else router.back();
  };

  return (
    <Box style={styles.container}>
      <HStack style={styles.innerContainer}>
        <Button
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityLabel="Back"
        >
          <Box
            style={{
              transform: [{ rotate: language === 'fa' ? '180deg' : '0deg' }],
            }}
          >
            <BackIcon color={isLight ? Colors.main.background : Colors.main.textPrimary} />
          </Box>
        </Button>

        <Heading
          size={size}
          style={[
            styles.title,
            {
              color: isLight ? Colors.main.background : Colors.main.textPrimary,
              textAlign: center ? 'center' : 'left',
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Heading>
      </HStack>
    </Box>
  );
};

export default HeaderTitle;

/**
 * ------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main.background,
    width: '100%',
    paddingBottom: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  backButton: {
    height: 42,
    width: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.main.cardBackground,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    flex: 1,
    fontWeight: '600',
    marginLeft: 16,
    includeFontPadding: false,
  },
});
