import React, { useState, useEffect, useRef } from 'react';
import AppDrawer from './appDrower';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Colors } from '@/constants/Colors';
import VoiceToTextScreen, { VoiceToTextRef } from './speechToText'; // 👈 با ref
import { t } from 'i18next';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from './noInternetConnection';
import { Loading } from './loading';
import { useServerChangeTaskStore } from '@/store/taskState/serverChange';
import { useUserState } from '@/store/authState/userState';
import lockImage from '@/assets/images/lockImage.png';
import { Center } from '../ui/center';
import { Image } from 'expo-image';
import { router } from 'expo-router';

type Props = {
  visible: boolean;
  onClose: () => void;
}

const CreateTaskByVoice = ({ visible, onClose }: Props) => {
  const [message, setMessage] = useState('');
  const connection = useNetworkStatus();
  const isLoading = useServerChangeTaskStore((state) => state.isLoading);
  const createTaskByAi = useServerChangeTaskStore((state) => state.createTaskByAi);
  const token = useUserState((state) => state.token);
  const voiceRef = useRef<VoiceToTextRef>(null);

  useEffect(() => {
    setMessage('');
    if (visible && voiceRef.current) {
      const timer = setTimeout(() => {
        voiceRef.current?.startRecording();
      }, 700);
      return () => clearTimeout(timer);
    } else if (!visible && voiceRef.current) {
      voiceRef.current.stopRecording();
    }
  }, [visible]);

  if (!connection) return <NoInternetConnection />;

  return (
    <AppDrawer
      isOpen={visible}
      onToggle={onClose}
      showHeader={false}
      showHeaderButton={false}
      triggerStyle={{ display: 'none' }}
      style={{ padding: 20 }}
    >
      {token ? (
        <>
          <Textarea
            className="w-full rounded-xl h-[150px] mb-4"
            style={{
              backgroundColor: Colors.main.background,
              borderWidth: 1,
              borderColor: Colors.main.border,
            }}
            size="md"
          >
            <TextareaInput
              value={message}
              onChangeText={setMessage}
              placeholder={t('common.placeholder.description_task')}
              placeholderTextColor={Colors.main.textSecondary}
              style={{
                textAlignVertical: 'top',
                color: Colors.main.textPrimary,
                padding: 12,
              }}
              multiline
              numberOfLines={6}
            />
          </Textarea>

          <HStack className="gap-3">
            <VoiceToTextScreen
              ref={voiceRef}
              onResult={(text) => setMessage(text)}
              buttonStyle={{ backgroundColor: Colors.main.primary, height: 48 }}
            />

            <Button
              disabled={isLoading || message.length === 0}
              style={{
                backgroundColor: message.length === 0 ? Colors.main.border : Colors.main.primary,
                height: 48,
                flex: 2,
              }}
              className="rounded-lg"
              onPress={() => createTaskByAi(message)}
            >
              {isLoading ? (
                <Loading style={{ backgroundColor: 'transparent' }} />
              ) : (
                <ButtonText style={{ color: Colors.main.textPrimary }}>
                  {t('event.create_task')}
                </ButtonText>
              )}
            </Button>
          </HStack>
        </>
      ) : (
        <Center className="gap-4 py-6">
          <Image
            source={lockImage}
            style={{ height: 120, width: '100%' }}
            contentFit="contain"
          />
          <Button
            style={{
              backgroundColor: Colors.main.primary,
              height: 48,
              width: '100%',
            }}
            onPress={() => router.push('/tabs/(auth)/emailAuth')}
            className="rounded-lg"
          >
            <ButtonText className="text-lg">
              {t('event.need_to_login')}
            </ButtonText>
          </Button>
        </Center>
      )}
    </AppDrawer>
  );
};

export default CreateTaskByVoice;
