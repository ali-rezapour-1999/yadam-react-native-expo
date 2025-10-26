import React, { useState } from 'react';
import AppDrawer from './appDrower';
import { Textarea, TextareaInput } from '../ui/textarea';
import { Colors } from '@/constants/Colors';
import VoiceToTextScreen from './speechToText';
import { t } from 'i18next';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { useNetworkStatus } from '@/hooks/networkStatus';
import NoInternetConnection from './noInternetConnection';
import { Loading } from './loading';
import { useServerChangeTaskStore } from '@/store/taskState/serverChange';

type Props = {
  visible: boolean;
  onClose: () => void;
}

const CreateTaskByVoice = ({ visible, onClose }: Props) => {
  const [message, setMessage] = useState('');
  const connection = useNetworkStatus();
  const isLoading = useServerChangeTaskStore((state) => state.isLoading);

  if (!connection) return <NoInternetConnection />;

  return <AppDrawer isOpen={visible} onToggle={onClose} showHeader={false} showHeaderButton={false} triggerStyle={{ display: 'none' }} style={{ padding: 20 }}>
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
      <VoiceToTextScreen onResult={(text) => setMessage(text)} buttonStyle={{ backgroundColor: Colors.main.primary, height: 48 }} />

      <Button
        disabled={isLoading}
        style={{
          backgroundColor: Colors.main.primary,
          height: 48,
          flex: 2,
        }}
        className="rounded-lg"
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
  </AppDrawer >
}

export default CreateTaskByVoice;
