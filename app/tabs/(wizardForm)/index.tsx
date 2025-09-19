import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

const WizardForm = () => {
  const { t } = useTranslation();
  return (
    <Box className="flex-1 flex justify-between" style={{ direction: 'ltr' , backgroundColor : Colors.main.background }}>
      <Box
        className="h-1/2 rounded-b-[40] pb-5 flex justify-center px-10"
        style={{
          backgroundColor: Colors.main.cardBackground,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            android: { elevation: 4 },
          }),
        }}
      >
        <Heading className="text-white" size="3xl">
          {t('onboarding.getting_started')}
        </Heading>
        <Heading className="text-white mt-.5" size="xl">
          {t('onboarding.start_your_journey_with_cocheck')}
        </Heading>
        <Text className="text-background">{t('onboarding.intro_question_message')}</Text>
        <Text className="mt-14 text-background text-lg">{t('onboarding.takes_less_than_a_minute')}</Text>
        <Text className="text-background text-lg">{t('onboarding.our_goal')}</Text>
      </Box>
      <Box className="px-4 mb-10 space-2">
        <Button className="border-b-1 rounded-[15px] h-[55px] font-bold" onPress={() => router.push('/tabs/stepOne')}>
          <Text className="text-white text-2xl font-ibmpBold">{t('onboarding.Let_s_do_it')}</Text>
        </Button>
        <Button variant="link" className="border-b-1 mt-5" onPress={() => router.push('/tabs/(tabs)')}>
          <Text style={{color:Colors.main.textPrimary}} className="text-lg">{t('onboarding.skip')}</Text>
        </Button>
      </Box>
    </Box>
  );
};

export default WizardForm;
