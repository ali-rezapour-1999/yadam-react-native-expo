import React, { useCallback, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PriorityEnumItems } from '@/constants/enums/PriorityEnumItems';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { Checkbox } from '@/components/common/checkBox';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkStatus } from '@/hooks/networkStatus';
import { UserProfile } from '@/types/user-profile';

const StepTwo = () => {
  const { setStep, updateProfile, topPriority, description, age, weight, height, gender, sleepTime, exercise, stressFeeling, goal } = useWizardStore();
  const isConnected = useNetworkStatus();
  const [selected, setSelected] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      setStep(4);
    }, []),
  );

  const onSubmit = async () => {
    if (isConnected) {
      updateProfile({
        age: age > 0 ? age : null,
        gender: (gender as 'other' | 'male' | 'female') ?? 'other',
        height: height > 0 ? height : null,
        weight: weight > 0 ? weight : null,
        goals: goal,
        exercise: exercise,
        sleepQuality: sleepTime,
        stressLevel: stressFeeling,
        mainFocus: topPriority,
        description: description,
      } as UserProfile);
    }
    router.push('/tabs/(profile)');
  };


  return (
    <Box className="flex-1 px-5 py-3" style={{ backgroundColor: Colors.main.background }} >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box className='px-2'>
          <WizardStepper />
          <HeaderTitle title={t('priorities.title')} />
          <Heading size="lg" className="px-2 mt-4" style={{ color: Colors.main.textPrimary }}>
            {t('priorities.subtitle')}
          </Heading>
          <Text className="px-3" style={{ color: Colors.main.textPrimary }}>
            {t('priorities.description')}
          </Text>

          <VStack space="lg" className="mt-10">
            {PriorityEnumItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setSelected(item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: selected.includes(item.key) ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                <Checkbox checked={selected.includes(item.key)} onPress={() => setSelected(item.key)} />
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      <Button
        className="rounded-xl h-[50px] mb-4"
        style={{
          backgroundColor: selected === '' ? Colors.main.border : Colors.main.button,
        }}
        onPress={onSubmit}
        disabled={selected === ''}
      >
        <ButtonText>{t('button.ding_will_start_from_here')}</ButtonText>
      </Button>
    </Box>
  );
};

export default StepTwo;
