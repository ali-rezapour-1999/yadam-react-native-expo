import EditIcon from '@/assets/Icons/EditIcon';
import HeaderTitle from '@/components/common/headerTitle';
import SelectLanguage from '@/components/common/selectLanguage';
import UserImage from '@/components/common/userImage';
import UsernameInput from '@/components/shared/forms/userNameInput';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/Colors';
import { useAppStore } from '@/store/appState';
import { useWizardStore } from '@/store/wizardFormState';
import { Link, router } from 'expo-router';
import { t } from 'i18next';
import { Info, Settings, Headset, ChevronRight, ChevronLeft, LogOutIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const profileItem = [
  { title: 'button.edit_account', icon: EditIcon, path: '/tabs/(wizardForm)/stepOne' },
  { title: 'profile.setting', icon: Settings, path: '/tabs/(wizardForm)' },
  { title: 'profile.about_cocheck', icon: Info, path: '/tabs/(profile)/aboutMe' },
];

const Profile = () => {
  const { user, language, isLogin } = useAppStore();
  const { description } = useWizardStore();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.main.background }}>
      {isLogin ? <UsernameInput /> : null}
      <HStack className="items-center justify-between my-6 px-7">
        <HeaderTitle title="" path="/tabs/(tabs)" width="1/2" />
        <HStack className="gap-2">
          {isLogin ?
            <Button className="h-14 w-14 rounded-xl" style={{ backgroundColor: Colors.main.accent }}>
              <LogOutIcon color={Colors.main.textPrimary} />
            </Button>
            : null
          }
        </HStack>
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
