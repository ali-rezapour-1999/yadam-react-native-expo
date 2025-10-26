import React from 'react';
import { Button, ButtonText } from '../ui/button';
import { Colors } from '@/constants/Colors';
import { t } from 'i18next';
import { Text } from '../Themed';
import { I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { router } from 'expo-router';
import { useBaseStore } from '@/store/baseState/base';
import { LanguageEnum } from '@/constants/enums/base';
import AppDrawer from './appDrower';

const SelectLanguage = () => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  const { i18n } = useTranslation();
  const { setLanguage, language } = useBaseStore();

  const selectLanguage = async (selectedLang: LanguageEnum) => {
    const isRTL = selectedLang == LanguageEnum.FA;
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
      <AppDrawer isOpen={showDrawer} onToggle={setShowDrawer} showHeaderButton={false} title={t('event.select_language')} style={{ padding: 16 }}>
        <Button
          style={{ backgroundColor: language === 'fa' ? Colors.main.border : Colors.main.button }}
          disabled={language === 'fa'}
          onPress={() => selectLanguage(LanguageEnum.FA)}
          className="rounded-lg mt-1 h-14"
        >
          <ButtonText style={{ color: Colors.main.textPrimary }} className="text-lg font-danaRegular">فارسی</ButtonText>
        </Button>

        <Button
          style={{ backgroundColor: language === 'en' ? Colors.main.border : Colors.main.button }}
          disabled={language === 'en'}
          onPress={() => selectLanguage(LanguageEnum.EN)}
          className="rounded-lg mt-3 h-14"
        >
          <ButtonText style={{ color: Colors.main.textPrimary }} className="text-lg">English</ButtonText>
        </Button>
      </AppDrawer >
    </>
  );
};

export default SelectLanguage;
