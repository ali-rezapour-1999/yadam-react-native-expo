import { Text, View } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { MotiView } from 'moti';
import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import getStartImage from '@/assets/images/getStart.png';
import { useAppStore } from '@/store/appState';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import GoogleIcon from '@/assets/Icons/Google';
import MailIcon from '@/assets/Icons/Mail';
import * as Update from 'expo-updates';
import { useGenerateNumericId } from '@/hooks/useGenerateId';

const Language = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fa'>('en');
  const [localId, setLocalId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState(true);
  const { i18n } = useTranslation();
  const { setUserAndLanguage, user } = useAppStore();

  useEffect(() => {
    const getOrCreateId = async () => {
      try {
        const storedId = await AsyncStorage.getItem('localUserId');
        if (storedId) {
          setLocalId(storedId);
        } else {
          const newId = useGenerateNumericId();
          await AsyncStorage.setItem('localUserId', newId);
          setLocalId(newId);
        }
      } catch (err) {
        console.error('Error getting or creating localId', err);
      } finally {
        setLoadingId(false);
      }
    };
    getOrCreateId();
  }, []);

  const selectLanguage = async (withEmail: boolean) => {
    if (!localId && !user?.id) return;

    try {
      await AsyncStorage.setItem('lang', selectedLang);
      await i18n.changeLanguage(selectedLang);

      const idToUse = user?.id || localId;
      if (!user?.id && idToUse) setUserAndLanguage(idToUse, selectedLang);

      if (withEmail && user?.id && user?.language) {
        await Update.reloadAsync();
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error selecting language:', err);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <View
      className="flex-1"
      style={{
        flex: 1,
        backgroundColor: Colors.main.background,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
      }}
    >
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 200 }}
        className="items-center mb-8"
      >
        <Text className="text-3xl font-bold text-center mb-2" style={{ color: Colors.main.textPrimary }}>
          Welcome!
        </Text>
        <Text className="text-base text-center opacity-70" style={{ color: Colors.main.textSecondary }}>
          Choose your language and create your profile
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 1000, delay: 400 }}
        className="items-center mb-12"
      >
        <Image source={getStartImage} className="h-80 w-80" />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 600, delay: 600 }}
        className="flex-1 justify-center"
      >
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
                      className="rounded-xl p-2 px-4 flex-row items-center justify-between"
                      style={{
                        backgroundColor: isSelected ? Colors.main.primary + '15' : 'transparent',
                        borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                        borderWidth: 2,
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

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 800 }}
        >
          {loadingId ? (
            <ActivityIndicator size="large" color={Colors.main.primary} style={{ marginTop: 20 }} />
          ) : (
            <>
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
                className="rounded-xl p-4 mt-3 flex-row items-center justify-center gap-3"
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
                className="rounded-xl p-4 mt-3 flex-row items-center justify-center gap-3"
                style={{
                  backgroundColor: Colors.main.textPrimary,
                }}
              >
                <MailIcon />
                <Text className="text-lg" style={{ color: Colors.main.primary, fontWeight: '800' }}>
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </>
          )}
        </MotiView>
      </MotiView>
    </View>
  );
};

export default Language;
