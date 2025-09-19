export type UserProfile = {
  id: string;
  user: string;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: 'other' | 'male' | 'female';
  height: number | null;
  weight: number | null;
  goals: string[];
  activity_level: string;
  sleep_quality: string;
  stress_level: string;
  eating_habits: string;
  main_focus: string | null;
  description: string;
};
