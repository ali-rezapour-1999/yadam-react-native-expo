import React, { useEffect, useState } from 'react';
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
import { useUserState } from '@/store/authState/userState';
import { UsernameSchema } from '@/components/schema/userSchema';

const UsernameInput = () => {
  const { user, updateUser } = useUserState();
  const [showDrawer, setShowDrawer] = useState(false);
  type usernameSchema = z.infer<typeof UsernameSchema>;

  useEffect(() => {
    if (!user?.firstName || user.firstName.length === 0) {
      setShowDrawer(true);
    } else {
      setShowDrawer(false);
    }
  }, [user]);

  const { control, handleSubmit } = useForm<usernameSchema>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: { firstName: user?.firstName || '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: usernameSchema) => {
    await updateUser({
      id: user?.id as string,
      firstName: data?.firstName,
      lastName: data?.lastName,
      language: user?.language ?? 'en',
      role: user?.role,
      level: user?.level,
      isVerified: user?.isVerified,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
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
    <Drawer className="bg-black/60 border-0" isOpen={showDrawer} onClose={handlerCloseDrawer} size="sm" anchor="bottom" >
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.background }} className="rounded-t-[30px] h-[40%]">
        <DrawerHeader className='justify-center'>
          <Text className="text-[24px] text-center " style={{ color: Colors.main.textPrimary }}>
            {t('profile.enter_your_first_and_lastName')}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Controller
            name="firstName"
            control={control}
            render={({ field, formState }) => (
              <FormControl isInvalid={!!formState.errors} isRequired size="lg" className="mt-8">
                <Input
                  className="my-1 h-16 rounded-xl px-4"
                  style={{ backgroundColor: Colors.main.border }}
                >
                  <InputField type="text" placeholder={t('profile.firstName_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
                </Input>
              </FormControl>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, formState }) => (
              <FormControl isInvalid={!!formState.errors} isRequired size="lg" className="mt-8">
                <Input
                  className="my-1 h-16 rounded-xl px-4"
                  style={{ backgroundColor: Colors.main.border }}
                >
                  <InputField type="text" placeholder={t('profile.lastName_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
                </Input>
              </FormControl>
            )}
          />
        </DrawerBody>
        <DrawerFooter>
          <Button className="h-14 mb-3 rounded-xl w-full" onPress={handleSubmit(onSubmit)} style={{ backgroundColor: Colors.main.button }}>
            <ButtonText className="text-lg">{t('common.button.confirm')}</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UsernameInput;
