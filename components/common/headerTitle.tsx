import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BackIcon from '@/assets/Icons/Back';

import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';
import { useBaseStore } from '@/store/baseState/base';

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
  size = 'xl',
  center = false,
}) => {
  const language = useBaseStore().language;

  const handleBackPress = () => {
    if (path) router.push(path as any);
    else router.back();
  };

  return (
    <Box style={styles.container}>
      <HStack style={styles.innerContainer}>
        <Button
          onPress={handleBackPress}
          accessibilityLabel="Back"
          className='w-16 h-16'
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
              width: '80%',
            },
          ]}
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
    width: '100%',
    marginBottom: 14,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    includeFontPadding: false,
  },
});
