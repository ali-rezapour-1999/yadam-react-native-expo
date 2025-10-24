import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { t } from 'i18next';
import { OneQuestion, ThreeQuestion, TwoQuestion } from '@/constants/enums/LifeStyleEnumItems';
import { Pressable, ScrollView } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { Checkbox } from '@/components/common/checkBox';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StepThree = () => {
  const { setStep, setField, sleepTime, stressFeeling, exercise } = useWizardStore();

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ questionOne?: string; questionTwo?: string; questionThree?: string; }>
    ({
      questionOne: sleepTime ?? '',
      questionTwo: stressFeeling ?? '',
      questionThree: exercise ?? '',
    });

  useEffect(() => {
    if (selectedOptions.questionOne && selectedOptions.questionTwo && selectedOptions.questionThree) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedOptions]);

  useFocusEffect(
    useCallback(() => {
      setStep(3);
    }, []),
  );

  const handleSelect = (question: 'questionOne' | 'questionTwo' | 'questionThree', key: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [question]: prev[question] === key ? undefined : key,
    }));
  };

  const onSubmit = () => {
    let hasError = false;
    const newErrorBox = { one: false, two: false, three: false };

    if (!selectedOptions.questionOne) {
      newErrorBox.one = true;
      hasError = true;
    }
    if (!selectedOptions.questionTwo) {
      newErrorBox.two = true;
      hasError = true;
    }
    if (!selectedOptions.questionThree) {
      newErrorBox.three = true;
      hasError = true;
    }

    if (!hasError) {
      setField('sleepTime', selectedOptions.questionOne || '');
      setField('exercise', selectedOptions.questionTwo || '');
      setField('stressFeeling', selectedOptions.questionThree || '');
      router.push('/tabs/(wizardForm)/stepFour');
    }
  };

  return (
    <SafeAreaView className="flex-1 px-5" style={{ backgroundColor: Colors.main.background }} >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Box className='px-2'>
          <WizardStepper />
          <HeaderTitle title={t('lifestyle.your_current_lifestyle')} />
          <Heading size="lg" className="px-3 mt-2" style={{ color: Colors.main.textPrimary }}>
            {t('lifestyle.quick_snapshot_subtitle')}
          </Heading>
          <Text className="px-3" style={{ color: Colors.main.textPrimary }}>
            {t('lifestyle.tell_us_about_current_state')}
          </Text>

          <VStack space="md" className="mt-8">
            <Text className="px-3 text-lg" style={{ color: Colors.main.textPrimary }}>
              {t('lifestyle.question_one.main')}
            </Text>
            {OneQuestion.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleSelect('questionOne', item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: selectedOptions.questionOne === item.key ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                {selectedOptions.questionOne === item.key ? <Checkbox checked={true} onPress={() => { }} /> : <Checkbox checked={false} onPress={() => handleSelect('questionOne', item.key)} />}
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>

          <VStack space="md" className="mt-8">
            <Text className="px-3 text-lg" style={{ color: Colors.main.textPrimary }}>
              {t('lifestyle.question_two.main')}
            </Text>
            {TwoQuestion.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleSelect('questionTwo', item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: selectedOptions.questionTwo === item.key ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                {selectedOptions.questionTwo === item.key ? <Checkbox checked={true} onPress={() => { }} /> : <Checkbox checked={false} onPress={() => handleSelect('questionTwo', item.key)} />}
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>

          <VStack space="md" className="mt-8">
            <Text className="px-3 text-lg" style={{ color: Colors.main.textPrimary }}>
              {t('lifestyle.question_three.main')}
            </Text>
            {ThreeQuestion.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleSelect('questionThree', item.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  backgroundColor: selectedOptions.questionThree === item.key ? Colors.main.primary + '20' : Colors.main.background,
                }}
              >
                {selectedOptions.questionThree === item.key ? <Checkbox checked={true} onPress={() => { }} /> : <Checkbox checked={false} onPress={() => handleSelect('questionThree', item.key)} />}
                <Text style={{ fontSize: 14, color: Colors.main.textPrimary }}>{t(item.label)}</Text>
              </Pressable>
            ))}
          </VStack>
        </Box>
      </ScrollView>

      <Button
        className="rounded-xl h-[50px] mb-4"
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

export default StepThree;
