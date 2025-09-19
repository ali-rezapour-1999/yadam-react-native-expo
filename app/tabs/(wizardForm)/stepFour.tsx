import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { PriorityEnumItems } from '@/constants/PriorityEnumItems';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { Checkbox } from '@/components/common/checkBox';
import { useFocusEffect } from '@react-navigation/native';
import { useNetworkStatus } from '@/hooks/networkStatus';
import { useAppStore } from '@/store/appState';
import { UserProfile } from '@/types/userProfile';

const StepTwo = () => {
  const { setStep, updateProfile, topPriority, setTopPriority, description, age, weight, height, gender, sleepTime, extersize, stressedFeeling, goal } = useWizardStore();
  const { user } = useAppStore();
  const [selected, setSelected] = useState<string[]>(topPriority ?? []);
  const isConnected = useNetworkStatus();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const togglePriority = (key: string) => {
    setSelected((prevGoals) => {
      if (prevGoals.includes(key)) {
        return prevGoals.filter((item) => item !== key);
      } else {
        return [...prevGoals, key];
      }
    });
  };

  useEffect(() => {
    if (selected.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selected]);

  useFocusEffect(
    useCallback(() => {
      setStep(4);
    }, []),
  );

  const onSubmit = async () => {
    setTopPriority(selected);

    if (isConnected) {
      updateProfile({
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        age: age > 0 ? age : null,
        gender: (gender as 'other' | 'male' | 'female') ?? 'other',
        height: height > 0 ? height : null,
        weight: weight > 0 ? weight : null,
        goals: goal,
        activity_level: extersize,
        sleep_quality: sleepTime,
        stress_level: stressedFeeling,
        main_focus: selected.length > 0 ? selected : null,
        description: description,
      } as UserProfile);
      router.push('/tabs/(tabs)/profile');
    } else {
      router.push('/tabs/(tabs)/profile');
    }
  };

  const isCheckHandler = (key: string) => {
    togglePriority(key);
  };

  return (
    <KeyboardAvoidingView className="flex-1 px-5" style={{ backgroundColor: Colors.main.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
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
                onPress={isCheckHandler.bind(null, item.key)}
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
                <Checkbox checked={selected.includes(item.key)} onPress={isCheckHandler.bind(null, item.key)} />
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      <Box style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Button
          className="rounded-xl h-[50px]"
          style={{
            backgroundColor: isButtonDisabled ? Colors.main.border : Colors.main.button,
          }}
          onPress={onSubmit}
          disabled={isButtonDisabled}
        >
          <ButtonText>{t('button.cocheck_will_start_from_here')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default StepTwo;
