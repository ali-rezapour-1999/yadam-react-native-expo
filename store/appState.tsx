import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthStateType, Result, User } from '@/types/auth-type';
import { googleLoginAction, sendMassageAction, sendOtpAction } from '@/api/authApi';
import { updateUserInformationAction } from '@/api/authApi/userInforamtionUpdate';
import { pushSyncDataWithServer } from '@/api/syncApi';
import { useTodoStore } from './todoState';
import { useTopicStore } from './topcisState';
import { mapTopicFromBackend } from '@/utils/topicConverter';
import { mapTaskFromBackend } from '@/utils/taskConverter';


export const useAppStore = create<AuthStateType>()(
  persist(
    (set, get) => ({
      isLogin: false,
      isLoading: false,
      language: 'en',
      user: null,
      token: null,
      hideTabBar: false,
      addInTimeTodoDrawer: false,
      isSendCode: false,
      calender: 'jalali',

      setIsSendCode: (isSendCode) => set({ isSendCode }),
      setHideTabBar: (bool) => set({ hideTabBar: bool }),
      setCalender: (calender) => set({ calender }),
      setAddInTimeTodoDrawer: (bool) => set({ addInTimeTodoDrawer: bool }),

      setUserInformation: (user: User) => set({ user }),

      setLanguage: (lang) => {
        const state = get();
        if (state.user) {
          set({
            language: lang,
            calender: lang === 'fa' ? 'jalali' : 'gregorian',
            user: { ...state.user, language: lang },
          });
        } else {
          set({ language: lang, calender: lang === 'fa' ? 'jalali' : 'gregorian' });
        }
      },

      setUserAndLanguage: (userid: string, lang: 'fa' | 'en') => {
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, id: userid, language: lang, },
            calender: lang === 'fa' ? 'jalali' : 'gregorian',
            language: lang,
          });
        } else {
          set({
            user: { id: userid, language: lang },
            language: lang,
            calender: lang === 'fa' ? 'jalali' : 'gregorian',
          });
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isLogin: false,
          isSendCode: false,
        }),

      googleLogin: async (): Promise<Result> => {
        set({ isLoading: true });
        const result = await googleLoginAction();
        if (result.success && result.data && result.access_token) {
          set({
            isLogin: true,
            user: result.data,
            token: result.access_token,
          });
        }
        set({ isLoading: false });
        return result;
      },

      sendMassage: async (identifier: string): Promise<Result> => {
        set({ isLoading: true });
        const result = await sendMassageAction(identifier);
        if (result.success) {
          set({ isSendCode: true });
        }
        set({ isLoading: false });
        return result;
      },

      sendOtp: async (identifier: string, code: string): Promise<Result> => {
        set({ isLoading: true });
        const result = await sendOtpAction(identifier, code);
        if (result.success && result.data && result.access_token) {
          set({
            isLogin: true,
            user: result.data,
            token: result.access_token,
            language: result.data.language,
          });
        }
        set({ isLoading: false });
        return result;
      },

      updateUserInformation: async (data: User) => {
        set({ isLoading: true });
        const result = await updateUserInformationAction(data, get().token as string);
        if (result.success) {
          set({
            user: result.data,
          });
        }
        set({ isLoading: false });
        return result;
      },

      syncDataFromServer: async () => {
        set({ isLoading: true })
        if (get().user != null && get().token != null) {
          const listTask = await useTodoStore.getState().getAllTask();
          const listTopic = await useTopicStore.getState().getAllTopic();
          await pushSyncDataWithServer({ listTopic: listTopic, listTask: listTask, token: get().token as string }).then((res) => {
            console.log(res.data)
            if (res.success) {
              res.data.topics.forEach((topic: any) => {
                useTopicStore.getState().createTopic(mapTopicFromBackend(topic));
              });
              res.data.tasks.forEach((task: any) => {
                useTodoStore.getState().createTask(mapTaskFromBackend(task));
              });
            }
            set({ isLoading: false });
          })
        };
      },

      logOut: async () => {
        set({
          user: {} as Pick<User, 'id' | 'username' | 'last_name' | "first_name" | 'language'>,
          token: null,
          isLogin: false,
        });
      },
    }),

    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLogin: state.isLogin,
        language: state.language,
        calender: state.calender,
      }),
    },
  ),

);
