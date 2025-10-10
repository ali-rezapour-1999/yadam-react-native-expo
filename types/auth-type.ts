import { UserProfile } from './userProfile';

export type User = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_verified?: boolean;
  level?: string;
  role?: string;
  language: 'fa' | 'en';
  created_at?: string;
  updated_at?: string;
};

export type Result = {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  status?: number;
  data?: any;
};

export type ProfileResult = {
  success: boolean;
  message: string;
  status?: number;
  data?: UserProfile;
};

export type AuthStateType = {
  isLogin: boolean;
  isLoading: boolean;
  isSendCode: boolean;
  user: User | null;
  token: string | null;
  language: 'fa' | 'en';
  calender: 'jalali' | 'gregorian';
  hideScroll: boolean;
  addInTimeTodoDrawer: boolean;

  setIsSendCode: (val: boolean) => void;
  setHideTabBar: (val: boolean) => void;
  setCalender: (val: 'jalali' | 'gregorian') => void;
  setAddInTimeTodoDrawer: (val: boolean) => void;
  setLanguage: (lang: 'fa' | 'en') => void;
  setUserAndLanguage: (userid: string, lang: 'fa' | 'en') => void;
  setUserInformation: (user: User) => void;
  logout: () => void;

  sendMassage: (identifier: string) => Promise<Result>;
  sendOtp: (identifier: string, code: string) => Promise<Result>;
  googleLogin: () => Promise<Result>;
  updateUserInformation: (data: User) => Promise<Result>;
  logOut: () => Promise<void>;
  syncDataFromServer: () => Promise<void>;
};
