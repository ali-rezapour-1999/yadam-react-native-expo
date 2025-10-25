import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Loading } from '@/components/common/loading';
import { useBaseStore } from '@/store/baseState/base';
import { CalenderEnum, LanguageEnum } from './enums/base';
import { useUserState } from '@/store/authState/userState';

export const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const user = useUserState((s) => s.user);
  const { setLanguage, setCalender } = useBaseStore();
  const router = useRouter();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('lang');
        if (lang) {
          setLanguage(lang as LanguageEnum);
          setCalender(lang === LanguageEnum.FA ? CalenderEnum.JALALI : CalenderEnum.GREGORIAN);
        } else {
          setShouldNavigate(true);
        }
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
        setShouldNavigate(true);
      } finally {
        setLoading(false);
      }
    };
    checkLanguage();
  }, []);

  useEffect(() => {
    if (!loading && (shouldNavigate || !user?.id)) {
      router.push('/language');
    }
  }, [loading, shouldNavigate, user?.id, router]);

  if (loading) return <Loading />;

  return <>{children}</>;
};
