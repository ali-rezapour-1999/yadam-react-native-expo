import React, { memo } from 'react';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { HStack } from '../ui/hstack';
import { Heading } from '../ui/heading';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { Link } from 'expo-router';
import UserImage from './userImage';
import { useAppStore } from '@/store/appState';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserHeaderTitle = memo(() => {
  const { user } = useAppStore();

  const displayName = user?.first_name && user?.first_name.length > 0 ? `${capitalizeWords(user.first_name)} ${capitalizeWords(user.last_name || '')}`.trim() : t('home.welcome_to_cocheck');
  return (
    <HStack className="mb-5 justify-between items-center px-5 mt-12">
      <VStack>
        <Heading className="font-bold" size="lg" style={{ color: Colors.main.textPrimary }}>
          {displayName}
        </Heading>
        <Text style={{ color: Colors.main.textSecondary }}>{t('home.make_day_productive')}</Text>
      </VStack>

      <Link href="/tabs/(profile)">
        <UserImage />
      </Link>
    </HStack>
  );
});

export default UserHeaderTitle;
