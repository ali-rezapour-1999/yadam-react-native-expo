import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { WizardStateType } from '@/types/wizard-form-type';
import { userProfileUpdate } from '@/api/authApi/userProfileUpdate';
import { useUserState } from './authState/userState';
import { ProfileResult, UserProfile } from '@/types/user-profile';

export const useWizardStore = create<WizardStateType>()(
  persist(
    (set, get) => ({
      // ====== STATE ======
      isLoading: false,
      step: 1,
      gender: '',
      age: 0,
      weight: 0,
      goal: [],
      height: 0,
      description: '',
      sleepTime: '',
      exercise: '',
      stressFeeling: '',
      topPriority: '',

      // ====== SETTERS ======
      setStep: (step: number) => set({ step }),
      setGoal: (goal: string[]) => set({ goal }),
      setLoading: (isLoading: boolean) => set({ isLoading }),

      setField: <K extends keyof WizardStateType>(field: K, value: WizardStateType[K],) => set({ [field]: value } as Partial<WizardStateType>),

      clear: () =>
        set({
          step: 1,
          gender: '',
          age: 0,
          weight: 0,
          goal: [],
          height: 0,
          description: '',
          sleepTime: '',
          exercise: '',
          stressFeeling: '',
          topPriority: '',
        }),

      // ====== ACTIONS ======
      updateProfile: async (data: UserProfile): Promise<ProfileResult> => {
        set({ isLoading: true });
        try {
          const token = useUserState.getState().token;
          if (!token) throw new Error('User token not found');

          const result = await userProfileUpdate(data, token);

          if (result.success) {
            const profile = result.data as UserProfile;
            get().applyProfile(profile);
          }

          return result;
        } finally {
          set({ isLoading: false });
        }
      },

      // ====== HELPERS ======
      applyProfile: (profile: UserProfile) =>
        set({
          gender: profile.gender ?? 'other',
          age: Number(profile.age ?? 0),
          weight: Number(profile.weight ?? 0),
          goal: profile.goals ?? [],
          height: Number(profile.height ?? 0),
          description: profile.description ?? '',
          sleepTime: profile.sleepQuality ?? '',
          exercise: profile.exercise ?? '',
          stressFeeling: profile.stressLevel ?? '',
          topPriority: profile.mainFocus ?? ''
        }),
    }),
    {
      name: 'wizard-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
