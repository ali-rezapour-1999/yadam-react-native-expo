import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { updateUserAction } from '@/api/authApi/userUpdate';
import { User, UserStateType } from '@/types/auth-type';
import { LanguageEnum } from '@/constants/enums/base';

export const useUserState = create<UserStateType>()(
  persist(
    (set, get) => ({
      isLogin: false,
      isLoading: false,
      user: null,
      token: null,

      setUser: (user: User) => set({ user }),

      setUserAndLanguage: (userid: string, lang: LanguageEnum) => {
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, id: userid, language: lang },
          });
        } else {
          set({
            user: { id: userid, language: lang },
          });
        }
      },

      updateUser: async (data: User) => {
        set({ isLoading: true });
        try {
          const result = await updateUserAction(data, get().token as string);
          if (result.success) {
            set({ user: result.data });
          }
          return result;
        } catch (error) {
          console.error('Update user error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await useUserState.setState({ token: null, user: {} as Pick<User, 'id' | 'language' | 'firstName'>, isLogin: false });
      },
    }),
    {
      name: 'user-config',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLogin: state.isLogin,
      }),
    },
  ),
);
