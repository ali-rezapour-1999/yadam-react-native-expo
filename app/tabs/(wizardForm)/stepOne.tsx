import SelectStepGender from '@/components/shared/forms/selectStepGender';
import { StepForm } from '@/components/shared/forms/auth/stepForm';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useWizardStore } from '@/store/wizardFormState';
import { WizardStateType } from '@/types/wizard-form-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useFocusEffect } from 'expo-router';
import { t } from 'i18next';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import WizardStepper from '@/components/common/wizardSteper';
import HeaderTitle from '@/components/common/headerTitle';
import { useAppStore } from '@/store/appState';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Themed';

const stepOneSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string(),
  height: z.string().min(1),
  weight: z.string().min(1),
  age: z.string().min(1),
  gender: z.string(),
  description: z.string(),
});

type stepOneSchemaType = z.infer<typeof stepOneSchema>;
const StepOne = () => {
  const { setStep, gender, age, weight, height, description, setField } = useWizardStore();
  const { user, setUserInformation } = useAppStore();
  const { control, handleSubmit } = useForm<stepOneSchemaType>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      firstname: user?.first_name ?? '',
      lastname: user?.last_name ?? '',
      height: height > 0 ? String(height) : '',
      weight: weight > 0 ? String(weight) : '',
      age: age > 0 ? String(age) : '',
      gender: gender ?? '',
      description: description ?? '',
    },
    mode: 'onChange',
  });

  useFocusEffect(
    useCallback(() => {
      setStep(1);
    }, []),
  );

  const onSubmit = (data: stepOneSchemaType) => {
    Object.entries(data).forEach(([key, value]) => {
      setField(key as keyof Omit<WizardStateType, 'setField'>, value);
    });
    setUserInformation({
      id: user?.id as string,
      first_name: data?.firstname,
      last_name: data?.lastname,
      language: user?.language ?? 'en',
      role: user?.role,
      level: user?.level,
      is_verified: user?.is_verified,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      email: user?.email,
    });
    setField('step', String(2));
    router.push('/tabs/(wizardForm)/stepTwo');
  };

  return (
    <SafeAreaView className="flex-1 px-4" style={{ backgroundColor: Colors.main.background }} >
      <WizardStepper />
      <HeaderTitle title={t('profile.base_information')} />
      <KeyboardAvoidingView className="flex-1" style={{ backgroundColor: Colors.main.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Controller
          render={({ field, fieldState }) => (
            <StepForm title={t('profile.first_name')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('common.placeholder.first_name_placeholder')} />
          )}
          name="firstname"
          control={control}
        />
        <Controller
          render={({ field, fieldState }) => (
            <StepForm title={t('profile.last_name')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('common.placeholder.last_name_placeholder')} />
          )}
          name="lastname"
          control={control}
        />

        <HStack className="justify-center gap-5 px-3">
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => (
                <StepForm title={t('profile.weight')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('common.placeholder.weight_placeholder')} />
              )}
              name="weight"
              control={control}
            />
          </Box>
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => (
                <StepForm title={t('profile.height')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('common.placeholder.height_placeholder')} />
              )}
              name="height"
              control={control}
            />
          </Box>
        </HStack>
        <HStack className="justify-center gap-5 px-3">
          <Box className="w-1/2">
            <Controller
              render={({ field, fieldState }) => (
                <StepForm title={t('profile.age')} value={field.value} onChange={field.onChange} error={fieldState.error} placeholder={t('common.placeholder.age_placeholder')} />
              )}
              name="age"
              control={control}
            />
          </Box>

          <Box className="w-1/2">
            <Controller render={({ field }) => <SelectStepGender selectedValue={field.value} setSelectedValue={field.onChange} />} name="gender" control={control} />
          </Box>
        </HStack>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <VStack>
              <Text style={{ color: Colors.main.textPrimary }} className="mt-5">
                {t('profile.description')}
              </Text>
              <Textarea
                className="my-1 w-full rounded-xl px-4 h-[130px]"
                style={{
                  backgroundColor: Colors.main.cardBackground,
                  borderWidth: 1,
                  borderColor: Colors.main.border,
                }}
                size="sm"
                isReadOnly={false}
                isInvalid={!!fieldState.error}
                isDisabled={false}
              >
                <TextareaInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder={t('common.placeholder.write_description_placeholder')}
                  className="h-10 items-start text-[12]"
                  style={{ textAlignVertical: 'top', color: Colors.main.textPrimary }}
                  placeholderTextColor={Colors.main.textSecondary}
                />
              </Textarea>
            </VStack>
          )}
        />
      </KeyboardAvoidingView>
      <Button
        className="rounded-xl h-[50px] my-5"
        style={{
          backgroundColor: Colors.main.button,
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <ButtonText style={{ color: Colors.main.textPrimary }}>{t('profile.continue_step')}</ButtonText>
      </Button>
    </SafeAreaView >
  );
};

export default StepOne;
