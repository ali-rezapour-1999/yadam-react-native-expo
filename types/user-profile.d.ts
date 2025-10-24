export type UserProfile = {
  age: number | null;
  gender: 'other' | 'male' | 'female';
  height: number | null;
  weight: number | null;
  goals: string[];
  exercise: string;
  sleepQuality: string;
  stressLevel: string;
  mainFocus: string | null;
  description: string;
};


export type ProfileResult = {
  success: boolean;
  message: string;
  status?: number;
  data?: UserProfile;
};

