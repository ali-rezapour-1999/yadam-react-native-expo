import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useAppStore } from '@/store/appState';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import SendIcon from '@/assets/Icons/Send';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import GoogleIcon from '@/assets/Icons/Google';
import { t } from 'i18next';
import { CodeForm } from '@/components/shared/forms/auth/codeForm';
import { Loading } from '@/components/common/loading';
import { AuthForm } from '@/components/shared/forms/auth/authForm';
import HeaderTitle from '@/components/common/headerTitle';
import { Colors } from '@/constants/Colors';
import emailAuth from '@/assets/images/email_auth.png';
import { Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Center } from '@/components/ui/center';
import { useFocusEffect } from '@react-navigation/native';

const emailSchema = z.object({
  identifier: z.string().min(1, { message: 'auth.email_required' }).email({ message: 'auth.email_invalid' }),
});

const codeSchema = z.object({
  code: z
    .string()
    .min(6, { message: 'code must be 6 digits' })
    .max(6, { message: 'code must be 6 digits' })
    .regex(/^\d{6}$/, { message: t('auth.code_must_contain_only_numbers') }),
});

const schemas = {
  email: emailSchema,
} as const;

interface GenericAuthProps {
  authType: 'email';
}

const GenericAuth: React.FC<GenericAuthProps> = ({ authType }) => {
  const { sendMassage, sendOtp, isSendCode, setIsSendCode, isLoading } = useAppStore();
  const [hasError, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsSendCode(false);
    }, [setIsSendCode]),
  );
  const authConfigs = {
    email: {
      type: 'email',
      title: t('auth.login_email'),
      placeholder: t('auth.email_placeholder'),
    },
  } as const;

  const identifierSchema = schemas[authType];

  const config = authConfigs[authType];
  const combinedSchema = identifierSchema.merge(codeSchema);
  const currentSchema = isSendCode ? combinedSchema : identifierSchema;

  type IdentifierFormValues = z.infer<typeof identifierSchema>;
  type CodeFormValues = z.infer<typeof combinedSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<IdentifierFormValues | CodeFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: { identifier: '', code: '' },
    mode: 'onChange',
  });

  const identifierValue = watch('identifier');
  const codeValue = watch('code');

  const verifyCode = useCallback(
    async (identifier: string, code: string) => {
      try {
        const result = await sendOtp(identifier, code);
        if (!result.success && result.status === 400) {
          setError(true);
        }
        return result;
      } catch (error: any) {
        console.error('Verify code error:', error);
        return { success: false, message: t('something_went_wrong') };
      }
    },
    [sendOtp],
  );

  const onSubmit = async (data: IdentifierFormValues | CodeFormValues) => {
    try {
      if (!isSendCode) {
        await sendMassage(data.identifier);
      } else {
        const result = await verifyCode(data.identifier, (data as CodeFormValues).code);
        if (result.success) {
          setIsSendCode(false);
          router.push("/tabs/(profile)");
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleResendCode = useCallback(async () => {
    try {
      if (identifierValue) {
        await sendMassage(identifierValue);
      }
    } catch (error) {
      console.error('Resend code error:', error);
    }
  }, [identifierValue, sendMassage]);

  const isIdentifierValid = !!identifierValue && !errors.identifier;
  const isCodeValid = !isSendCode || (!!codeValue && codeValue.length === 6);
  const canSubmit = isIdentifierValid && isCodeValid && !isLoading;

  return (
    <VStack className="flex-1" style={{ backgroundColor: Colors.main.background }}>
      <Box className="relative pt-6 pb-8 px-6">
        <HeaderTitle title={t('auth.back_to_home')} path="../(tabs)/" />
        <VStack className="items-center mt-8">
          <Center>
            <Image source={emailAuth} style={{ width: 340, height: 340 }} />
            <Text className="text-center text-base leading-relaxed px-4">{!isSendCode ? (t('auth.enter_email') as string) : (t('auth.enter_code') as string)}</Text>
          </Center>
        </VStack>
      </Box>

      <KeyboardAvoidingView
        className="flex-1 px-5 rounded-3xl"
        style={{ backgroundColor: Colors.main.cardBackground, flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <VStack>
          <VStack className="mt-2">
            {!isSendCode && (
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <AuthForm
                    value={field.value}
                    placeholder={t(config.placeholder)}
                    onChange={(value) => {
                      field.onChange(value);
                      trigger('identifier');
                    }}
                    error={errors.identifier?.message}
                  />
                )}
              />
            )}

            {isSendCode && (
              <Box className="mt-4">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <CodeForm
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value.length === 6) {
                          trigger('code');
                        }
                      }}
                      error={errors.root?.message}
                      onResendCode={handleResendCode}
                      hasError={hasError}
                    />
                  )}
                />
              </Box>
            )}
          </VStack>

          <VStack className="mt-4">
            <Button
              isDisabled={!canSubmit}
              className="h-14 rounded-xl mb-6 relative overflow-hidden"
              style={{
                backgroundColor: canSubmit ? Colors.main.button : Colors.main.textPrimary + 20,
                opacity: canSubmit ? 1 : 0.6,
              }}
              onPress={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <Loading style={{ backgroundColor: 'transparent', marginTop: 14 }} />
              ) : (
                <HStack className="items-center gap-2">
                  {!isSendCode && <ButtonIcon as={SendIcon} />}
                  <ButtonText className="text-white text-lg font-semibold" style={{ color: canSubmit ? '#ffffff' : Colors.main.textSecondary }}>
                    {!isSendCode ? t('auth.send_code') : t('auth.approve_code')}
                  </ButtonText>
                </HStack>
              )}
            </Button>

            {isSendCode ? (
              <Button
                className="h-14 rounded-xl mb-6 overflow-hidden"
                style={{
                  backgroundColor: Colors.main.textPrimary,
                }}
                onPress={() => setIsSendCode(false)}
              >
                <ButtonText className="text-lg" style={{ color: Colors.main.background }}>
                  {t('auth.edit_email')}
                </ButtonText>
              </Button>
            ) : null}

            {isSendCode ? null : (
              <>
                <HStack className="items-center mb-6">
                  <Box className="flex-1 h-px bg-gray-200" />
                  <Text className="mx-4 text-gray-500 text-sm font-medium">{t('auth.or')}</Text>
                  <Box className="flex-1 h-px bg-gray-200" />
                </HStack>
                <Button className="h-14 mb-4 rounded-xl" style={{ backgroundColor: Colors.main.background }}>
                  <HStack className="items-center gap-3 ">
                    <GoogleIcon />
                    <ButtonText className="text-lg">{t('auth.continue_with_google')}</ButtonText>
                  </HStack>
                </Button>
              </>
            )}

            <Text className="text-center leading-relaxed">{t('auth.policy_approve')}</Text>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </VStack>
  );
};

export default GenericAuth;
