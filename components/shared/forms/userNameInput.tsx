import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody, DrawerHeader, DrawerFooter } from '@/components/ui/drawer';
import { t } from 'i18next';
import { Text } from '@/components/Themed';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { router } from 'expo-router';

const usernameSchema = z.object({
  first_name: z.string().min(1, { message: 'auth.first_name_needed' }),
  last_name: z.string().optional(),
});

const UsernameInput = () => {
  const { user, updateUserInformation } = useAppStore();
  const [showDrawer, setShowDrawer] = useState(false);
  type usernameSchema = z.infer<typeof usernameSchema>;

  useEffect(() => {
    if (!user?.first_name || user.first_name.length === 0) {
      setShowDrawer(true);
    } else {
      setShowDrawer(false);
    }
  }, [user]);

  const { control, handleSubmit } = useForm<usernameSchema>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { first_name: user?.first_name || '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: usernameSchema) => {
    await updateUserInformation({
      id: user?.id as string,
      first_name: data?.first_name,
      last_name: data?.last_name,
      language: user?.language ?? 'en',
      role: user?.role,
      level: user?.level,
      is_verified: user?.is_verified,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      email: user?.email,
    }).then(() => router.replace('/tabs/(profile)'));
  };

  const handlerCloseDrawer = () => {
    if (showDrawer) {
      router.replace('/tabs/(tabs)');
    }
    setShowDrawer(false);
  };

  return (
    <Drawer className="bg-black/60 border-0" isOpen={showDrawer} onClose={handlerCloseDrawer} size="md" anchor="bottom">
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.background }} className="rounded-t-[30px]">
        <DrawerHeader>
          <Text className="text-[24px]" style={{ color: Colors.main.textPrimary }}>
            {t('profile.enter_your_first_and_last_name')}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Controller
            name="first_name"
            control={control}
            render={({ field, formState }) => (
              <FormControl isInvalid={!!formState.errors} isRequired size="lg" className="mt-8">
                <Input
                  className="my-1 h-16 rounded-xl px-4"
                  style={{
                    backgroundColor: Colors.main.textPrimary,
                  }}
                >
                  <InputField type="text" placeholder={t('profile.first_name_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
                </Input>
              </FormControl>
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field, formState }) => (
              <FormControl isInvalid={!!formState.errors} isRequired size="lg" className="mt-8">
                <Input
                  className="my-1 h-16 rounded-xl px-4"
                  style={{
                    backgroundColor: Colors.main.textPrimary,
                  }}
                >
                  <InputField type="text" placeholder={t('profile.last_name_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
                </Input>
              </FormControl>
            )}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button className="h-14 mb-3 rounded-xl w-full" onPress={handleSubmit(onSubmit)} style={{ backgroundColor: Colors.main.button }}>
            <ButtonText className="text-lg">{t('event.approve')}</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UsernameInput;
