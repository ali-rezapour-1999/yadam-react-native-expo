import { WizardStateType } from '@/types/wizard-form-type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { userProfileUpdate } from '@/api/authApi/userProfileUpdate';
import { useAppStore } from '@/store/appState';
import { UserProfile } from '@/types/userProfile';
import { ProfileResult } from '@/types/auth-type';

export const useWizardStore = create<WizardStateType>()(
  persist(
    (set) => ({
      isLoading: false,
      step: 1,
      gender: '',
      age: 0,
      weight: 0,
      goal: [],
      height: 0,
      description: '',
      sleepTime: '',
      extersize: '',
      stressedFeeling: '',
      topPriority: [],
      setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => set({ [field]: value }),
      setStep: (step: number) => set({ step }),
      setGoal: (goal: string[]) => set({ goal }),
      setTopPriority: (topPriority: string[]) => set({ topPriority }),
      clear: () => set({ step: 1, gender: '', age: 0, weight: 0, goal: [], height: 0, description: '', sleepTime: '', extersize: '', stressedFeeling: '', topPriority: [] }),
      setLoading: (isLoading: boolean) => set({ isLoading }),

      updateProfile: async (data: UserProfile): Promise<ProfileResult> => {
        set({ isLoading: true });
        try {
          const token = useAppStore.getState().token;
          if (!token) throw new Error('User token not found');

          const result = await userProfileUpdate(data, token);

          if (result.success) {
            const profile = result.data as UserProfile;
            set({
              gender: profile.gender ?? 'other',
              age: Number(profile.age ?? 0),
              weight: Number(profile.weight ?? 0),
              goal: profile.goals ?? [],
              height: Number(profile.height ?? 0),
              description: profile.description ?? '',
              sleepTime: profile.sleep_quality ?? '',
              extersize: profile.activity_level ?? '',
              stressedFeeling: profile.stress_level ?? '',
              topPriority: profile.main_focus ? [profile.main_focus] : [],
            });
          }
          return result;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'wizard-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
