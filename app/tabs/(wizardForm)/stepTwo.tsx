import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/Themed';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { GoalEnumItems } from '@/constants/GoalEnumItems';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { Checkbox } from '@/components/common/checkBox';
import { SafeAreaView } from 'react-native-safe-area-context';

const StepTwo = () => {
  const { setStep } = useWizardStore();
  const { setGoal, goal } = useWizardStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(goal ?? []);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const toggleGoal = (key: string) => {
    setSelectedGoals((prevGoals) => {
      if (prevGoals.includes(key)) {
        return prevGoals.filter((item) => item !== key);
      } else {
        return [...prevGoals, key];
      }
    });
  };

  useEffect(() => {
    if (selectedGoals.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedGoals]);

  useFocusEffect(
    useCallback(() => {
      setStep(2);
    }, []),
  );

  const onSubmit = () => {
    setGoal(selectedGoals);
    router.push('/tabs/(wizardForm)/stepThree');
  };
  const isCheckHandler = (key: string) => {
    toggleGoal(key);
  };

  return (

    <SafeAreaView className="flex-1 px-5" style={{ backgroundColor: Colors.main.background, position: 'relative' }} >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box className='px-2'>
          <WizardStepper />
          <HeaderTitle title={t('onboarding.goal.what_do_you_want_from_cocheck')} />
          <Text className="px-3 mt-3 text-md" style={{ color: Colors.main.textPrimary }}>
            {t('onboarding.goal.main_goal_guidance_text')}
          </Text>

          <VStack space="lg" className="mt-8">
            {GoalEnumItems.map((item) => (
              <Pressable
                key={item.key}
                onPress={isCheckHandler.bind(null, item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 12,
                  backgroundColor: selectedGoals.includes(item.key) ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                <Checkbox checked={selectedGoals.includes(item.key)} onPress={isCheckHandler.bind(null, item.key)} />
                <Text style={{ fontSize: 17, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>
      <Button
        className="rounded-xl h-[50px] mb-7"
        style={{
          backgroundColor: isButtonDisabled ? Colors.main.border : Colors.main.button,
        }}
        onPress={onSubmit}
        disabled={isButtonDisabled}
      >
        <ButtonText>{t('profile.continue_step')}</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default StepTwo;
