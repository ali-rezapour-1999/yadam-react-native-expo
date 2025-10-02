import React from 'react';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import BackIcon from '@/assets/Icons/Back';
import { Platform } from 'react-native';
import { useAppStore } from '@/store/appState';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';

interface HeaderTitleProps {
  title?: string;
  path?: any;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  width?: string;
}

const HeaderTitle = ({ title, path, isLight = false, size = '2xl', width = '[87%]' }: HeaderTitleProps) => {
  const { language } = useAppStore();

  const handleBackPress = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <HStack className={`gap-4 fixed top-0 w-${width}`}>
      <Button
        className="rounded-xl h-12 w-12"
        onPress={handleBackPress}
        style={{
          backgroundColor: Colors.main.button,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            },
            android: {
              elevation: 3,
            },
          }),
        }}
      >
        <Box
          style={{
            transform: [{ rotate: language === 'fa' ? '180deg' : '0deg' }],
          }}
        >
          <BackIcon color={Colors.main.textPrimary} />
        </Box>
      </Button>
      <Heading style={{ color: isLight ? Colors.main.background : Colors.main.textPrimary, flex: 1, flexWrap: 'wrap' }} size={size}>
        {title}
      </Heading>
    </HStack>
  );
};

export default HeaderTitle;
