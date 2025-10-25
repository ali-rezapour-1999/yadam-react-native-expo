import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Image, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from '@/components/Themed';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/Colors';
import getStartImage from '@/assets/images/getStart.png';
import GoogleIcon from '@/assets/Icons/Google';
import MailIcon from '@/assets/Icons/Mail';

import { useGenerateNumericId } from '@/hooks/useGenerateId';
import { useUserState } from '@/store/authState/userState';
import { LanguageEnum } from '@/constants/enums/base';

const LOCAL_ID_KEY = 'localUserId';

const ActionButton = ({ label, onPress, icon, bgColor, textColor, }: {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  bgColor: string;
  textColor: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="rounded-xl p-4 mt-3 flex-row items-center justify-center gap-3"
    style={{
      backgroundColor: bgColor,
      shadowColor: Colors.main.primary,
      shadowOffset: { width: 0, height: 4 },
    }}
  >
    {icon}
    <Text className="text-lg font-extrabold" style={{ color: textColor }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const LanguageScreen = () => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'fa'>('en');
  const [localId, setLocalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation();
  const { setUserAndLanguage, user } = useUserState();

  const generateNumericId = useGenerateNumericId();

  useEffect(() => {
    let mounted = true;
    const initializeLocalData = async () => {
      setLoading(true);
      try {
        const storedId = await AsyncStorage.getItem(LOCAL_ID_KEY);

        if (storedId) {
          if (mounted) setLocalId(storedId);
        } else {
          const newId = typeof generateNumericId === 'function' ? generateNumericId : `${Date.now()}`;
          await AsyncStorage.setItem(LOCAL_ID_KEY, newId);
          if (mounted) setLocalId(newId);
        }
      } catch (error) {
        console.error('Error getting/creating localId :', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initializeLocalData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLanguageSelection = async (withEmail: boolean) => {
    if (!localId && !user?.id) return;

    try {
      await AsyncStorage.setItem('lang', selectedLang);
      await i18n.changeLanguage(selectedLang);

      const idToUse = user?.id || localId;
      if (!user?.id && idToUse) {
        setUserAndLanguage(idToUse, selectedLang);
      }

      router.push('/tabs/(tabs)');
    } catch (error) {
      console.error('Error selecting language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <View
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
              {languages.map(({ code, name, flag }) => {
                const isSelected = selectedLang === code;
                return (
                  <TouchableOpacity
                    key={code}
                    onPress={() => setSelectedLang(code as LanguageEnum)}
                    className="rounded-xl p-2 px-4 flex-row items-center justify-between"
                    style={{
                      backgroundColor: isSelected ? Colors.main.primary + '15' : 'transparent',
                      borderColor: isSelected ? Colors.main.primary : Colors.main.border,
                      borderWidth: 2,
                    }}
                  >
                    <VStack className="flex-row items-center gap-3">
                      <Text className="text-2xl">{flag}</Text>
                      <Text className="text-lg">{name}</Text>
                    </VStack>

                    <View
                      className="w-6 h-6 rounded-full border-2 items-center justify-center"
                      style={{ borderColor: isSelected ? Colors.main.primary : Colors.main.border }}
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
          {loading ? (
            <ActivityIndicator size="large" color={Colors.main.primary} style={{ marginTop: 20 }} />
          ) : (
            <>
              <ActionButton
                label="Continue"
                onPress={() => handleLanguageSelection(true)}
                bgColor={Colors.main.button}
                textColor={Colors.main.textPrimary}
              />

              <ActionButton
                label="Continue with Google"
                onPress={() => router.push('/tabs/(auth)/emailAuth')}
                icon={<GoogleIcon />}
                bgColor={Colors.main.textPrimary}
                textColor={Colors.main.primary}
              />

              <ActionButton
                label="Continue with Email"
                onPress={() => handleLanguageSelection(false)}
                icon={<MailIcon />}
                bgColor={Colors.main.textPrimary}
                textColor={Colors.main.primary}
              />
            </>
          )}
        </MotiView>
      </MotiView>
    </View>
  );
};

export default LanguageScreen;
