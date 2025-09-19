import { UserProfile } from './userProfile';

export interface WizardStateType {
  step: number;
  isLoading: boolean;

  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other' | '';
  description: string;

  goal: string[];
  extersize: string;
  sleepTime: string;

  stressedFeeling: string;
  topPriority: string[];

  setField: (field: keyof Omit<WizardStateType, 'setField'>, value: string) => void;
  setStep: (step: number) => void;
  setGoal: (goal: string[]) => void;
  setTopPriority: (topPriority: string[]) => void;
  clear: () => void;
  setLoading: (isLoading: boolean) => void;
  updateProfile: (data: UserProfile) => void;
}
