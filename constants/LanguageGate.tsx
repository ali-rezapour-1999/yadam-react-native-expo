import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/authState/authState';
import { Loading } from '@/components/common/loading';

export const LanguageGate = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { setLanguage, setCalender } = useAppStore();
  const router = useRouter();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('lang');
        if (lang) {
          setLanguage(lang as 'fa' | 'en');
          setCalender(lang === 'fa' ? 'jalali' : 'gregorian');
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
    if (!loading && shouldNavigate) {
      router.push('/language');
    }
  }, [loading, shouldNavigate]);

  if (loading) return <Loading />;

  return <>{children}</>;
};
