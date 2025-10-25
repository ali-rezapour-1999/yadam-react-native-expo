import { UserProfile } from './user-profile';
import { ProfileResult } from './user-profile';

export interface WizardStateType {
  // ====== STATE ======
  step: number;
  isLoading: boolean;

  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other' | '';
  description: string;

  goal: string[];
  exercise: string;
  sleepTime: string;

  stressFeeling: string;
  topPriority: string;

  // ====== ACTIONS ======
  setField: <K extends keyof Omit<WizardStateType, 'setField' | 'updateProfile' | 'clear'>>(field: K, value: WizardStateType[K]) => void;

  setStep: (step: number) => void;
  setGoal: (goal: string[]) => void;
  clear: () => void;
  setLoading: (isLoading: boolean) => void;

  updateProfile: (data: UserProfile) => Promise<ProfileResult>;

  applyProfile: (profile: UserProfile) => void;
}

