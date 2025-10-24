import { CalenderEnum, LanguageEnum } from "@/constants/enums/base";

export type BaseStateType = {

  isLoading: boolean;
  language: LanguageEnum;
  calender: CalenderEnum;
  selectedDate: string;
  today: string;
  hideScroll: boolean;
  setHideScroll: (hideScroll: boolean) => void;

  setSelectedDate: (date: string) => Promise<void>;
  setCalender: (val: CalenderEnum) => void;
  setLanguage: (lang: LanguageEnum) => void;
}


export type SyincWithServerStateType = {
  isLoading: boolean;
  syncDataFromServer: () => Promise<void>;
}
