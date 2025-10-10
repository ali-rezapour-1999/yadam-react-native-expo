import React from 'react';
import { Button, ButtonText } from '../ui/button';
import { useAppStore } from '@/store/appState';
import { Colors } from '@/constants/Colors';
import { Drawer, DrawerBackdrop, DrawerContent, DrawerBody, DrawerHeader } from '@/components/ui/drawer';
import { t } from 'i18next';
import { Text } from '../Themed';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { router } from 'expo-router';

const SelectLanguage = () => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const { i18n } = useTranslation();
  const { setLanguage, language } = useAppStore();

  const selectLanguage = async (selectedLang: 'en' | 'fa') => {
    const isRTL = selectedLang === 'fa';
    await AsyncStorage.setItem('lang', selectedLang);
    await i18n.changeLanguage(selectedLang);
    setLanguage(selectedLang);

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }

    if (Updates.reloadAsync) {
      try {
        await Updates.reloadAsync();
      } catch (e) {
        console.warn('reloadAsync failed:', e);
      }
    }
    setShowDrawer(false);
    router.push('/tabs/(profile)');
  };

  return (
    <>
      <Button
        onPress={() => {
          setShowDrawer(true);
        }}
        className="rounded-lg h-12 w-full"
        style={{ backgroundColor: Colors.main.textPrimary }}
      >
        <ButtonText className="text-lg" style={{ color: Colors.main.button }} >
          {language === 'fa' ? 'فارسی' : 'English'}
        </ButtonText>
      </Button>
      <Drawer
        className="bg-black/60 border-0"
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
        size="sm"
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent style={{ backgroundColor: Colors.main.background }} className="rounded-t-2xl">
          <DrawerHeader>
            <Text className="text-2xl text-center w-full">{t('event.select_language')}</Text>
          </DrawerHeader>
          <DrawerBody>
            <Button
              style={{ backgroundColor: language === 'fa' ? Colors.main.border : Colors.main.button }}
              disabled={language === 'fa'}
              onPress={() => selectLanguage('fa')}
              className="rounded-lg mt-1 h-14"
            >
              <ButtonText style={{ color: Colors.main.textPrimary }} className="text-lg font-danaRegular">فارسی</ButtonText>
            </Button>

            <Button
              style={{ backgroundColor: language === 'en' ? Colors.main.border : Colors.main.button }}
              disabled={language === 'en'}
              onPress={() => selectLanguage('en')}
              className="rounded-lg mt-3 h-14"
            >
              <ButtonText style={{ color: Colors.main.textPrimary }} className="text-lg">English</ButtonText>
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SelectLanguage;
