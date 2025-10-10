import React, { useState } from 'react';
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import { Button, ButtonText } from '@/components/ui/button';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { CodeForm } from '@/components/shared/forms/auth/codeForm';
import { useAppStore } from '@/store/appState';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import GoogleIcon from '@/assets/Icons/Google';
import { Heading } from '@/components/ui/heading';

const emailSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: t('auth.email_required') })
    .email({ message: t('auth.email_invalid') }),
});
const phoneSchema = z.object({
  identifier: z
    .string()
    .min(10, { message: t('auth.phone_required') })
    .regex(/^\+?\d{10,14}$/, { message: t('auth.phone_invalid') }),
});
const codeSchema = z.object({
  code: z.string().length(6, { message: t('auth.code_must_be_6') }),
});

export const DynamicLogin = () => {
  const { sendMassage, sendOtp, isSendCode, setIsSendCode, isLoading } = useAppStore();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [hasError, setHasError] = useState(false);

  const schema = authMethod === 'email' ? emailSchema : phoneSchema;
  const combinedSchema = schema.merge(codeSchema);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isSendCode ? combinedSchema : schema),
    defaultValues: isSendCode
      ? { identifier: '', code: '' }
      : { identifier: '' },
    mode: 'onChange',
  });

  const identifier = watch('identifier');
  const code = watch('code');


  const handleSend = async (data: any) => {
    try {
      const res = await sendMassage(data.identifier);
      if (res?.success) {
        reset({ identifier: data.identifier, code: '' });
        setIsSendCode(true);
      }
    } catch {
      setHasError(true);
    }
  };

  const handleVerify = async (data: any) => {
    try {
      const res = await sendOtp(identifier, data.code);
      if (res?.success) {
        reset();
        setIsSendCode(false);
        router.push('/tabs/(profile)');
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    }
  };

  const isFilled = identifier?.length > 0;
  const canSubmit = isFilled && (!isSendCode || (code?.length === 6 && !isLoading));

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ------------- TOP AREA (text + input) ------------- */}
      <View style={styles.topSection}>
        <Heading style={styles.title}>
          {t(isSendCode ? 'auth.we_send_code' : 'home.welcome_to_cocheck')}
        </Heading>
        <Text style={styles.subtitle}>
          {isSendCode ? t('auth.enter_code') : authMethod === 'email' ? t('auth.enter_email') : t('auth.enter_phone')}
        </Text>


        {!isSendCode ? (
          <Controller
            name="identifier"
            control={control}
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Enter your email"
                keyboardType={authMethod === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                placeholderTextColor={Colors.main.textSecondary}
                style={[
                  styles.input, { textAlign: 'left', writingDirection: 'ltr' },
                  errors.identifier && { borderColor: Colors.main.accent },
                ]}
              />
            )}
          />
        ) : (
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <CodeForm
                value={field.value as string}
                onChange={field.onChange}
                hasError={hasError}
              />
            )}
          />
        )}
      </View>

      {/* ------------- BOTTOM BUTTONS ------------- */}
      <View style={styles.bottomSection}>
        <Button
          onPress={handleSubmit(isSendCode ? handleVerify : handleSend)}
          disabled={!canSubmit}
          style={[
            styles.primaryBtn,
            { backgroundColor: canSubmit ? Colors.main.button : Colors.main.border },
          ]}
        >
          <ButtonText style={styles.primaryText}>
            {isSendCode ? t('event.approve') : t('auth.send_code')}
          </ButtonText>
        </Button>

        {isSendCode ? (
          <Button
            onPress={() => {
              reset();
              setIsSendCode(false);
            }}
            style={styles.secondaryBtn}
          >
            <ButtonText style={styles.secondaryText}>
              {t('auth.edit_email')}
            </ButtonText>
          </Button>
        ) : (
          <Button style={styles.googleBtn}>
            <HStack className="items-center gap-3 justify-center">
              <GoogleIcon />
              <ButtonText style={styles.googleText}>
                {t('auth.continue_with_google')}
              </ButtonText>
            </HStack>
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

/* -------------------------------- Styles -------------------------------- */
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  topSection: {
    width: '100%',
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    color: Colors.main.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.main.textSecondary,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.main.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
    fontSize: 18,
    color: Colors.main.textPrimary,
    backgroundColor: Colors.main.cardBackground + 30,
  },
  switchText: {
    fontSize: 15,
    color: Colors.main.textSecondary,
    opacity: 0.7,
  },
  activeSwitch: {
    color: Colors.main.primary,
    opacity: 1,
  },
  bottomSection: {
    width: '100%',
  },
  primaryBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryText: {
    fontSize: 17,
    color: Colors.main.textPrimary,
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.main.warning + 98,
    justifyContent: 'center',
  },
  secondaryText: {
    color: Colors.main.textPrimary,
    fontSize: 15,
  },
  googleBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.main.background,
    borderWidth: 1,
    borderColor: Colors.main.border,
    justifyContent: 'center',
  },
  googleText: {
    color: Colors.main.textPrimary,
    fontSize: 16,
  },
});
