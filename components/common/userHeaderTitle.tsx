import React, { memo } from 'react';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { HStack } from '../ui/hstack';
import { Heading } from '../ui/heading';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { Link } from 'expo-router';
import UserImage from './userImage';
import { useUserState } from '@/store/authState/userState';

const capitalizeWords = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserHeaderTitle = memo(() => {
  const user = useUserState().user;

  const displayName = user?.firstName && user?.firstName.length > 0 ? `${capitalizeWords(user.firstName)} ${capitalizeWords(user.firstName || '')}`.trim() : t('home.welcome_to_ding');
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
