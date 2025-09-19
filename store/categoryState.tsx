import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'کاری', color: '#FF6B6B' },
  { id: '2', name: 'شخصی', color: '#4ECDC4' },
  { id: '3', name: 'مطالعه', color: '#45B7D1' },
  { id: '4', name: 'خرید', color: '#96CEB4' },
  { id: '5', name: 'ورزش', color: '#FFEAA7' },
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: defaultCategories,

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updatedCategory) => {
        set((state) => ({
          categories: state.categories.map((category) => (category.id === id ? { ...category, ...updatedCategory } : category)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },
    }),
    {
      name: 'category-storage',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
