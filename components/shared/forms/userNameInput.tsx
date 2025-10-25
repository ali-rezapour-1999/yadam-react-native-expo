import React from 'react';
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
import { LanguageEnum } from '@/constants/enums/base';

interface UsernameInputProps {
  showDrawer: boolean;
  setShowDrawer: (val: boolean) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({ showDrawer, setShowDrawer }) => {
  const { user, updateUser } = useUserState();
  type usernameSchema = z.infer<typeof UsernameSchema>;

  const { control, handleSubmit } = useForm<usernameSchema>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: { firstName: user?.firstName || '' },
    mode: 'onChange',
  });

  const onSubmit = async (data: usernameSchema) => {
    await updateUser({
      id: user?.id as string,
      firstName: data?.firstName,
      lastName: data?.lastName ?? '',
      language: user?.language ?? LanguageEnum.FA,
      role: user?.role,
      isVerified: user?.isVerified,
      email: user?.email,
    }).then(() => router.replace('/tabs/(profile)'));
  };

  return (
    <Drawer className="bg-black/60 border-0" isOpen={showDrawer} onClose={setShowDrawer} size="sm" anchor="bottom" >
      <DrawerBackdrop />
      <DrawerContent style={{ backgroundColor: Colors.main.background }} className="rounded-t-[30px] h-2/5">
        <DrawerHeader className='justify-start px-3'>
          <Text className="text-xl text-end " style={{ color: Colors.main.textPrimary }}>
            {t('profile.enter_your_first_and_last_name')}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Controller
            name="firstName"
            control={control}
            render={({ field, formState }) => (
              <FormControl isInvalid={!!formState.errors} isRequired size="lg" className="mt-3">
                <Input className="h-16 rounded-xl px-4 border-0" style={{ backgroundColor: Colors.main.border }} >
                  <InputField type="text" placeholder={t('common.placeholder.first_name_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
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
                  className="h-16 rounded-xl px-4 border-0"
                  style={{ backgroundColor: Colors.main.border }}
                >
                  <InputField type="text" placeholder={t('common.placeholder.last_name_placeholder')} value={field.value} onChangeText={field.onChange} className="text-xl" />
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
