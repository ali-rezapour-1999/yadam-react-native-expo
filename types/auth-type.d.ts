import { LanguageEnum } from '@/enums/base';
import { UserProfile } from './user-profile';

export type User = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isVerified?: boolean;
  level?: string;
  role?: string;
  language: 'fa' | 'en';
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponseResult = {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  status?: number;
  data?: any;
};

export type AuthStateType = {
  isLogin: boolean;
  isLoading: boolean;
  isSendCode: boolean;

  setIsSendCode: (val: boolean) => void;
  sendMassage: (identifier: string) => Promise<Result>;
  sendOtp: (identifier: string, code: string) => Promise<Result>;
  googleLogin: () => Promise<Result>;
  logout: () => Promise<void>;
};

export type UserStateType = {
  isLoading: boolean;
  user: User | null;
  token: string | null;

  setUserAndLanguage: (userid: string, language: LanguageEnum) => void;
  setUser: (user: User) => void;

  updateUser: (data: User) => Promise<Result>;
};

