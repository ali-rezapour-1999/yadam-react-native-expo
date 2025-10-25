import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BaseStateType } from '@/types/base-type';
import { CalenderEnum, LanguageEnum } from '@/constants/enums/base';

const getCurrentDate = (): string => new Date().toISOString().split("T")[0];

export const useBaseStore = create<BaseStateType>()(
  persist(
    (set) => ({
      isLoading: false,
      language: LanguageEnum.FA,
      calender: CalenderEnum.JALALI,
      selectedDate: getCurrentDate(),
      hideScroll: false,
      today: getCurrentDate(),

      setHideScroll: (hideScroll) => set({ hideScroll }),
      setSelectedDate: async (date: string) => { set({ selectedDate: date }) },
      setCalender: (calender) => set({ calender }),
      setLanguage: (lang) => {
        set({
          language: lang,
          calender: lang == LanguageEnum.FA ? CalenderEnum.JALALI : CalenderEnum.GREGORIAN,
        });
      },
    }),

    {
      name: 'base-config',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        calender: state.calender,
      }),
    },
  ),
);
