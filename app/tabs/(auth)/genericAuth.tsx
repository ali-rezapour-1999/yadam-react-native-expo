import React, { useState } from 'react';
import { TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import { Button, ButtonText } from '@/components/ui/button';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { CodeForm } from '@/components/shared/forms/auth/codeForm';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import GoogleIcon from '@/assets/Icons/Google';
import { Heading } from '@/components/ui/heading';
import { useAuthState } from '@/store/authState/authState';
import { CodeSchema, EmailSchema, PhoneSchema } from '@/components/schema/authSchema';
import { Box } from '@/components/ui/box';

const DynamicLogin = () => {
  const { sendMassage, sendOtp, isSendCode, setIsSendCode, isLoading } = useAuthState();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String>('');

  const schema = authMethod === 'email' ? EmailSchema : PhoneSchema;
  const combinedSchema = schema.merge(CodeSchema);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isSendCode ? combinedSchema : schema),
    defaultValues: isSendCode ? { identifier: '', code: '' } : { identifier: '' },
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
      else {
        setErrorMessage(res.message);
      }
    } catch {
      setHasError(true);
    }
  };

  const handleVerify = async (data: any) => {
    try {
      const res = await sendOtp(identifier, data.code);
      if (res) {
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
      <View style={styles.topSection}>
        <Heading style={styles.title}>
          {t(isSendCode ? 'auth.we_send_code' : 'home.welcome_to_ding')}
        </Heading>

        {!isSendCode ? (
          <Controller
            name="identifier"
            key="identifier"
            control={control}
            render={({ field }) => (
              <Box>
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
                    errorMessage.length > 0 && { borderColor: Colors.main.accent },
                  ]}

                />
                <Text className="text-xs" style={{ color: Colors.main.accent }}>{errorMessage}</Text>
              </Box>
            )}
          />
        ) : (
          <Controller
            name="code"
            key="code"
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
            {isSendCode ? t('common.button.confirm') : t('auth.send_code')}
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
              {t('event.edit_email')}
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

export default DynamicLogin;

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
    backgroundColor: Colors.main.cardBackground,
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
    backgroundColor: Colors.main.textDisabled,
    justifyContent: 'center',
  },
  secondaryText: {
    color: Colors.main.background,
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

