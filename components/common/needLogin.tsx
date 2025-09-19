import React from 'react';
import userAccessImage from '@/assets/images/accessUser.png';
import { Image } from 'expo-image';
import { t } from 'i18next';
import { Colors } from '@/constants/Colors';
import { VStack } from '../ui/vstack';
import { Text } from '../Themed';
import { Link } from 'expo-router';

const NeedLogin = () => {
  return (
    <VStack className="flex-1 items-center justify-center">
      <Image source={userAccessImage} contentFit = "contain" style={{ width: 300, height: 300 }} />
      <Text>{t('event.need_to_auth')}</Text>
      <Link href={'/tabs/(auth)/'} className="text-center mt-5 rounded-xl py-4 px-14" style={{ backgroundColor: Colors.main.border }}>
        <Text>{t('auth.enter_your_account')}</Text>
      </Link>
    </VStack>
  );
};

export default NeedLogin;
