import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, ButtonText } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Loading } from '@/components/common/loading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import lockImage from '@/assets/images/lockImage.png';
import { Image } from 'expo-image';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody } from '@/components/ui/drawer';

interface Props {
  onSubmit: (description?: string) => void;
  isLoading?: boolean;
  visible?: boolean;
  onClose?: () => void;
  token?: string | null | undefined;
  onRequireLogin: () => void;
}

export const GenerateTaskByAi: React.FC<Props> = ({
  onSubmit,
  isLoading,
  visible,
  onClose,
  token,
  onRequireLogin
}) => {
  const { control, handleSubmit, reset } = useForm<{ description?: string }>({
    defaultValues: { description: '' },
  });

  const handleFormSubmit = (data: { description?: string }) => {
    onSubmit(data.description);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  return (
    <Drawer
      isOpen={visible || false}
      onClose={handleClose}
      className="bg-black/80 border-0"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent
        style={{ backgroundColor: Colors.main.cardBackground }}
        className="rounded-t-[24px] border-0 h-max"
      >
        <DrawerBody className="px-4 py-6">
          {token ? (
            <VStack className="gap-4">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    className="w-full rounded-xl h-[150px]"
                    style={{
                      backgroundColor: Colors.main.background,
                      borderWidth: 1,
                      borderColor: Colors.main.border,
                    }}
                    size="md"
                  >
                    <TextareaInput
                      value={field.value}
                      onChangeText={field.onChange}
                      placeholder={t('common.placeholder.write_description_placeholder')}
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
                )}
              />

              <HStack className="gap-3 justify-end">
                <Button
                  onPress={handleClose}
                  variant="outline"
                  style={{
                    borderColor: Colors.main.border,
                    backgroundColor: 'transparent',
                    height: 48,
                    flex: 1,
                  }}
                  className="rounded-lg"
                >
                  <ButtonText style={{ color: Colors.main.textSecondary }}>
                    {t('common.button.cancel')}
                  </ButtonText>
                </Button>

                <Button
                  onPress={handleSubmit(handleFormSubmit)}
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
                      {t('event.generate_by_ai')}
                    </ButtonText>
                  )}
                </Button>
              </HStack>
            </VStack>
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
                onPress={onRequireLogin}
                className="rounded-lg"
              >
                <ButtonText className="text-lg">
                  {t('event.need_to_login')}
                </ButtonText>
              </Button>
            </Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
