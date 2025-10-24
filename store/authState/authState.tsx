import { create } from 'zustand';
import { googleLoginAction, sendMassageAction, sendOtpAction } from '@/api/authApi';
import { AuthStateType, AuthResponseResult, User } from '@/types/auth-type';
import { useUserState } from './userState';


export const useAuthState = create<AuthStateType>()(
  (set) => ({
    isLogin: false,
    isLoading: false,
    isSendCode: false,

    setIsSendCode: (isSendCode) => set({ isSendCode }),

    googleLogin: async (): Promise<AuthResponseResult | null> => {
      set({ isLoading: true });
      try {
        const result = await googleLoginAction();
        if (result.success && result.data && result.access_token) {
          set({ isLogin: true });
          useUserState.setState({ token: result.access_token, user: result.data });
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
        return result;
      } catch (error) {
        console.error('Send massage error:', error);
        throw error;
      } finally {
        set({ isLoading: false });
        return null;
      }
    },

    sendOtp: async (identifier: string, code: string): Promise<AuthResponseResult | null> => {
      set({ isLoading: true });
      const result = await sendOtpAction(identifier, code);
      try {
        if (result.success && result.data) {
          set({ isLogin: true });
          useUserState.setState({ token: result.data.access_token, user: result.data.user });
        }
      } catch (error) {
        console.error('Send otp error:', error);
        throw error;
      }
      finally {
        set({ isLoading: false });
        return null;
      }
    },

    logOut: async () => {
      useUserState.setState({ token: null, user: {} as Pick<User, 'id' | 'language'> });
      set({ isLogin: false, });
    },
  }),

);
