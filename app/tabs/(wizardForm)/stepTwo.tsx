import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { GoalEnumItems } from '@/constants/GoalEnumItems';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { Checkbox } from '@/components/common/checkBox';

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
    <KeyboardAvoidingView className="flex-1 px-5" style={{ backgroundColor: Colors.main.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box>
          <WizardStepper />
          <HeaderTitle title={t('goal.your_goal')} />
          <Heading size="lg" className="px-3 mt-4" style={{ color: Colors.main.textPrimary }}>
            {t('goal.what_do_you_want_from_cocheck')}
          </Heading>
          <Text className="px-3 text-sm" style={{ color: Colors.main.textPrimary }}>
            {t('goal.main_goal_guidance_text')}
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

      <Box style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
        <Button
          className="rounded-xl h-[50px]"
          style={{
            backgroundColor: isButtonDisabled ? Colors.main.border : Colors.main.button,
          }}
          onPress={onSubmit}
          disabled={isButtonDisabled}
        >
          <ButtonText>{t('profile.continue_step')}</ButtonText>
        </Button>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default StepTwo;
