import EditIcon from '@/assets/Icons/EditIcon';
import AppModal from '@/components/common/appModal';
import { Loading } from '@/components/common/loading';
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
import { useAppStore } from '@/store/appState';
import { useWizardStore } from '@/store/wizardFormState';
import { Link, router } from 'expo-router';
import { t } from 'i18next';
import { Info, Settings, Headset, ChevronRight, ChevronLeft, LogOutIcon, HomeIcon, FolderSync } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const profileItem = [
  { title: 'profile.edit_account', icon: EditIcon, path: '/tabs/(wizardForm)/stepOne' },
  { title: 'profile.setting', icon: Settings, path: '/tabs/(wizardForm)' },
  { title: 'profile.about_yadam', icon: Info, path: '/tabs/(profile)/aboutMe' },
];

const Profile = () => {
  const { user, language, isLogin, logout, syncDataFromServer, isLoading } = useAppStore();
  const { description } = useWizardStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    router.push('/tabs/(profile)');
  };

  const syncDataHandler = async () => {
    await syncDataFromServer().then(() => setIsSyncOpen(false));
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.main.background }}>
      {isLogin ? <UsernameInput /> : null}
      <HStack className="mx-auto my-6 w-[90%]" style={{ justifyContent: 'space-between', alignItems: 'center', direction: 'ltr' }}>
        <Button style={{ backgroundColor: Colors.main.button, width: 50, height: 50 }} onPress={() => router.push('/tabs/(tabs)')} className="rounded-xl">
          <HomeIcon color={Colors.main.textPrimary} size={25} />
        </Button>

        {
          isLogin ?
            <AppModal title={t("todos.sync_data")} buttonContent={<Icon as={FolderSync} size="2xl" color={Colors.main.textPrimary} />} buttonStyle={{ backgroundColor: Colors.main.lightBlue, height: 50, width: 50 }} onChangeVisible={() => setIsSyncOpen(!isSyncOpen)} modalBodyStyle={{ paddingHorizontal: 20 }} visible={isSyncOpen}>
              <Text style={{ color: Colors.main.textPrimary, fontSize: 18, textAlign: 'center' }}>{t('todos.sync_data_description')}</Text>
              <Button onPress={syncDataHandler} style={{ backgroundColor: Colors.main.button }} className='rounded-md mt-5'>
                {isLoading ? <Loading /> : <ButtonText style={{ color: Colors.main.textPrimary, fontSize: 14 }}>{t('common.button.confirm')}</ButtonText>}
              </Button>
            </AppModal>
            : null

        }
      </HStack>

      <Box className="flex-1 rounded-t-[50px] pt-4 px-6" style={{ backgroundColor: Colors.main.border + 80 }}>
        <HStack className="mt-5 gap-4 items-center" style={{ direction: 'ltr', flexDirection: isLogin ? 'row' : 'column' }}>
          <UserImage width={70} height={70} />
          {isLogin ? (
            <VStack>
              <Heading style={{ color: Colors.main.textPrimary }}>{user?.first_name + ' ' + user?.last_name || 'Set your username'}</Heading>
              <Text className="text-lg" style={{ color: Colors.main.textPrimary }}>
                {user?.email || 'Set your Email'}
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
              {language === 'fa' ? <ChevronLeft size={24} color={Colors.main.textPrimary} /> : <ChevronRight size={24} color={Colors.main.textPrimary} />}
            </Button>
          ))}

          {isLogin ?
            <AppModal title={t("event.logout")} onChangeVisible={setIsOpen} visible={isOpen} buttonContent={
              <>
                <Text className="text-xl" style={{ color: Colors.main.textPrimary }}>
                  {t('event.logout')}
                </Text>
                <Icon as={LogOutIcon} size={28} color={Colors.main.textPrimary} />
              </>
            } buttonStyle={{ height: 50, backgroundColor: Colors.main.accent, marginTop: 50 }} modalContentStyle={{ borderColor: Colors.main.border, borderWidth: 1, height: 240, width: "90%" }} modalBodyStyle={{ paddingHorizontal: 10 }}>
              <VStack className='gap-5 justify-between'>
                <Text className="text-center text-2xl ">{t("profile.logout_message")}</Text>
                <Button className="w-full h-12 rounded-xl mt-3" style={{ backgroundColor: Colors.main.accent }} onPress={logoutHandler}>
                  <ButtonText>
                    <Text>{t("event.logout")}</Text>
                  </ButtonText>
                </Button>
              </VStack>
            </AppModal>
            : null
          }
        </VStack>
      </Box>
      <Button style={{ backgroundColor: Colors.main.border + 80 }} className="h-24 flex-col">
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
      </Button>
    </SafeAreaView>
  );
};
export default Profile;
