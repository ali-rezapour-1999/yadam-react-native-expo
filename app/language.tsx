import { Text, View } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { MotiView } from 'moti';
import { I18nManager, Image, TouchableOpacity } from 'react-native';
import * as Updates from 'expo-updates';
import getStartImage from '@/assets/images/getStart.png';
import { useAppStore } from '@/store/appState';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import GoogleIcon from '@/assets/Icons/Google';
import MailIcon from '@/assets/Icons/Mail';

const Language = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fa'>('en');
  const { i18n } = useTranslation();
  const { setUserAndLanguage, user } = useAppStore();
  const id = new Date().toTimeString();

  const selectLanguage = async (withEmail: boolean) => {
    const isRTL = selectedLang === 'fa';
    await AsyncStorage.setItem('lang', selectedLang);
    await i18n.changeLanguage(selectedLang);
    if (!user?.id) setUserAndLanguage(id, selectedLang);
    if (Updates.reloadAsync) {
      await Updates.reloadAsync();
    }
    if (withEmail && user?.id && user?.language) {
      router.push('/');
    } else {
      router.push('/tabs/(auth)/emailAuth');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <View
      className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        flex: 1,
        backgroundColor: Colors.main.background,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      {/* Header Section */}
      <MotiView from={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 800, delay: 200 }} className="items-center mb-8">
        <Text className="text-3xl font-bold text-center mb-2" style={{ color: Colors.main.textPrimary, marginBottom: 8 }}>
          Welcome!
        </Text>
        <Text className="text-base text-center opacity-70" style={{ color: Colors.main.textSecondary }}>
          Choose your language and create your profile
        </Text>
      </MotiView>

      <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 1000, delay: 400 }} className="items-center mb-12">
        <Image source={getStartImage} className="h-80 w-80" />
      </MotiView>

      <MotiView from={{ opacity: 0, translateY: 50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 600 }} className="flex-1 justify-center">
        <Box>
          <View className="mb-4">
            <Text className="px-3 mb-3" style={{ color: Colors.main.textPrimary }}>
              Select Language
            </Text>
            <View className="gap-3">
              {languages.map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <MotiView key={lang.code} from={{ scale: 1 }} transition={{ type: 'spring', duration: 200 }}>
                    <TouchableOpacity
                      onPress={() => setSelectedLang(lang.code as 'en' | 'fa')}
                      className="rounded-xl p-2 px-4 border-2 flex-row items-center justify-between"
                      style={{
                        backgroundColor: isSelected ? Colors.main.primary + '15' : 'transparent',
                        borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                      }}
                    >
                      <VStack className="flex-row items-center gap-3 ">
                        <Text className="text-2xl">{lang.flag}</Text>
                        <Text className="text-lg">{lang.name}</Text>
                      </VStack>

                      <View
                        className="w-6 h-6 rounded-full border-2 items-center justify-center"
                        style={{
                          borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                        }}
                      >
                        {isSelected && (
                          <MotiView
                            from={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 300 }}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: Colors.main.primary }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  </MotiView>
                );
              })}
            </View>
          </View>
        </Box>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400, delay: 800 }}>
          <TouchableOpacity
            onPress={() => selectLanguage(true)}
            className="rounded-xl p-4 items-center shadow-lg"
            style={{
              backgroundColor: Colors.main.button,
              shadowColor: Colors.main.primary,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text className="text-lg" style={{ color: Colors.main.textPrimary, fontWeight: '800' }}>
              Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/tabs/(auth)/emailAuth')}
            className="rounded-xl p-4 hadow-lg mt-3 flex flex-row items-center justify-center gap-3"
            style={{
              backgroundColor: Colors.main.textPrimary,
              shadowColor: Colors.main.primary,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <GoogleIcon />
            <Text className="text-lg" style={{ color: Colors.main.primary, fontWeight: '800' }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selectLanguage(false)}
            className="rounded-xl p-4 hadow-lg mt-3 flex flex-row items-center justify-center gap-3"
            style={{
              backgroundColor: Colors.main.textPrimary,
            }}
          >
            <MailIcon />
            <Text className="text-lg" style={{ color: Colors.main.primary, fontWeight: '800' }}>
              Continue with Email
            </Text>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
    </View>
  );
};

export default Language;
