import EditIcon from '@/assets/Icons/EditIcon';
import AppModal from '@/components/common/appModal';
import HeaderTitle from '@/components/common/headerTitle';
import SelectLanguage from '@/components/common/selectLanguage';
import UserImage from '@/components/common/userImage';
import UsernameInput from '@/components/shared/forms/userNameInput';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { LanguageEnum } from '@/constants/enums/base';
import { useUserState } from '@/store/authState/userState';
import { useBaseStore } from '@/store/baseState/base';
import { useWizardStore } from '@/store/wizardFormState';
import { Link, router, useFocusEffect } from 'expo-router';
import { t } from 'i18next';
import { Info, Settings, Headset, ChevronRight, ChevronLeft, LogOutIcon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

const profileItem = [
  { title: 'profile.edit_account', icon: EditIcon, path: '/tabs/(wizardForm)/stepOne' },
  { title: 'profile.setting', icon: Settings, path: '/tabs/(wizardForm)' },
  { title: 'profile.about_ding', icon: Info, path: '/tabs/(profile)/aboutMe' },
];

const Profile = () => {
  const { user, isLogin, logout } = useUserState()
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const language = useBaseStore().language
  const { description } = useWizardStore();
  const [isOpen, setIsOpen] = useState(false);

  useFocusEffect(useCallback(() => {
    setShowDrawer(user?.firstName?.length === 0);
  }, [user?.firstName]))

  const logoutHandler = async () => {
    await logout().then(() => {
      setIsOpen(false);
      router.push('/tabs/(tabs)');
    });
  };

  return (
    <View className="flex-1 pt-12" style={{ backgroundColor: Colors.main.background }}>
      {isLogin ? <UsernameInput showDrawer={showDrawer} setShowDrawer={setShowDrawer} /> : null}

      <HStack className="w-full items-center justify-between px-5">
        <Box className="w-4/5 flex-1">
          <HeaderTitle size="lg" path="/tabs/(tabs)" />
        </Box>

        {isLogin ?
          <AppModal title={t("event.logout")} onChangeVisible={setIsOpen} visible={isOpen} buttonContent={<Icon as={LogOutIcon} size={24} color={Colors.main.background} />}
            buttonStyle={{ backgroundColor: Colors.main.accent, width: 50, height: 50 }}
            modalContentStyle={{ borderColor: Colors.main.border, borderWidth: 1, width: "90%" }} modalBodyStyle={{ paddingHorizontal: 10 }}>
            <VStack className='gap-3 justify-between'>
              <Text className="text-center text-2xl ">{t("profile.logout_message")}</Text>
              <Button className="w-full h-12 rounded-lg mt-3" style={{ backgroundColor: Colors.main.accent }} onPress={logoutHandler}>
                <ButtonText>
                  {t("event.logout")}
                </ButtonText>
              </Button>
              <Button className="w-full h-12 rounded-lg" style={{ backgroundColor: Colors.main.border }} onPress={() => setIsOpen(false)}>
                <ButtonText>
                  {t("common.button.cancel")}
                </ButtonText>
              </Button>
            </VStack>
          </AppModal>
          : null
        }
      </HStack>

      <Box className="flex-1 rounded-t-[50px] pt-4 px-6" style={{ backgroundColor: Colors.main.border + 80 }}>
        <HStack className="mt-5 gap-4 items-center" style={{ flexDirection: isLogin ? 'row' : 'column' }}>
          <UserImage width={70} height={70} />
          {isLogin ? (
            <VStack>
              <Heading style={{ color: Colors.main.textPrimary }}>{user?.firstName ?? t("profile.set_your_name")}
                {user?.lastName ?? ''}
              </Heading>
              <Text className="text-lg" style={{ color: Colors.main.textPrimary }}>
                {user?.email || t("profile.set_your_email")}
              </Text>
            </VStack>
          ) : (
            <Link href="/tabs/(auth)" className="w-full py-2 text-center rounded-xl mb-4" style={{ backgroundColor: Colors.main.button }}>
              <Text className="text-xl">{t('auth.enter_your_account')}</Text>
            </Link>
          )}
        </HStack>
        {isLogin ? (
          <VStack className='mb-4'>
            <Text className="p-4 mt-5 rounded-xl max-h-40 text-md" style={{ color: Colors.main.textPrimary, backgroundColor: Colors.main.background }}>
              {description.length > 0 ? description : t('profile.no_description')}
            </Text>
          </VStack>
        ) : null}
        <SelectLanguage />
        <VStack className="gap-2 items-center mt-4">
          {profileItem.map((item) => (
            <Button
              onPress={() => router.push(item.path as any)}
              key={item.title}
              className="w-full h-20 rounded-2xl justify-between bg-transparent mt-3 border-[1px]"
              style={{ borderColor: Colors.main.border }}
            >
              <HStack className="gap-5">
                <item.icon size={28} color={Colors.main.textPrimary} />
                <Text className="text-xl" style={{ color: Colors.main.textPrimary }}>
                  {t(item.title)}
                </Text>
              </HStack>
              {language == LanguageEnum.FA ? <ChevronLeft size={24} color={Colors.main.textPrimary} /> : <ChevronRight size={24} color={Colors.main.textPrimary} />}
            </Button>
          ))}

        </VStack>
      </Box>
      <Box style={{ backgroundColor: Colors.main.border + 80 }} className="h-20 items-center flex-col">
        <HStack className="gap-3">
          <Headset size={32} color={Colors.main.textPrimary} />
          <Text className="text-2xl" style={{ color: Colors.main.textPrimary }}>
            {t('profile.help_text')}
          </Text>
        </HStack>
        <Center>
          <Text className="text-sm" style={{ color: Colors.main.textPrimary }}>
            version 0.0.1
          </Text>
        </Center>
      </Box>
    </View >
  );
};

export default Profile;
