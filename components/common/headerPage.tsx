import React from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BellIcon from '@/assets/Icons/BellIcon';
import { HStack } from '../ui/hstack';
import { Heading } from '../ui/heading';
import { Button } from '../ui/button';

const HeaderPage = ({ title }: { title: string }) => {
  return (
    <HStack className="justify-between">
      <Heading style={{ color: Colors.main.primaryDark, fontSize: 26 }}>{title}</Heading>
      <Button style={{ backgroundColor: Colors.main.button, elevation: 4 }} className="flex items-center justify-center w-12 h-12 rounded-lg" onPress={() => router.push('/tabs/(tabs)')}>
        <BellIcon />
      </Button>
    </HStack>
  );
};

export default HeaderPage;
