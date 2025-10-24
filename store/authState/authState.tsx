import { create } from 'zustand';
import { googleLoginAction, sendMassageAction, sendOtpAction } from '@/api/authApi';
import { AuthStateType, AuthResponseResult } from '@/types/auth-type';
import { useUserState } from './userState';


export const useAuthState = create<AuthStateType>()(
  (set) => ({
    isLoading: false,
    isSendCode: false,

    setIsSendCode: (isSendCode) => set({ isSendCode }),

    googleLogin: async (): Promise<AuthResponseResult | null> => {
      set({ isLoading: true });
      try {
        const result = await googleLoginAction();
        if (result.success && result.data && result.access_token) {
          useUserState.setState({ token: result.access_token, user: result.data, isLogin: result.success });
        }
        return result;
      }
      catch (error) {
        console.error('Google login error:', error);
        throw error;
      }
      finally {
        set({ isLoading: false });
        return null;
      }
    },

    sendMassage: async (identifier: string): Promise<AuthResponseResult | null> => {
      set({ isLoading: true });
      try {
        const result = await sendMassageAction(identifier);
        if (result.success) {
          set({ isSendCode: true });
        }
      } catch (error) {
        console.error('Send massage error:', error);
        throw error;
      } finally {
        set({ isLoading: false });
        return null;
      }
    },

    sendOtp: async (identifier: string, code: string): Promise<boolean | null> => {
      set({ isLoading: true });
      const result = await sendOtpAction(identifier, code);
      try {
        if (result.success && result.data) {
          useUserState.setState({ token: result.access_token, user: result.data, isLogin: result.success });
          return result.success;
        }
        return false
      } catch (error) {
        console.error('Send otp error:', error);
        throw error;
      }
      finally {
        set({ isLoading: false });
      }
    },
  }),
);
