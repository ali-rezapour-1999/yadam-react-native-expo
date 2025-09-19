import { topicStorage } from '@/storage/database';
import { Topic, TopicWithCount } from '@/types/database-type';
import { create } from 'zustand';

export interface TopicState {
  topic: Topic | null;
  topics: Topic[];
  publicTopics: Topic[];
  userTopics: TopicWithCount[];
  selectedTopic: Topic | null;

  isLoading: boolean;
  isEditDrawerOpen: boolean;

  setSelectedTopic: (topic: Topic | null) => void;
  setEditDrawerOpen: (open: boolean) => void;

  loadPublicTopics: () => Promise<void>;
  loadUserTopics: (userId: string) => Promise<void>;
  createTopic: (topic: Topic) => Promise<Topic>;
  updateTopic: (topic: Topic) => Promise<void>;
  getTopicById: (id: string) => Promise<Topic | null>;
  removeTopic: (id: string) => Promise<void>;
  updateTopicsAfterLogin: (newId: string, lastId: string) => Promise<void>;
  searchTopics: (search: string) => Promise<void>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topic: null,
  topics: [],
  publicTopics: [],
  userTopics: [],
  selectedTopic: null,
  isLoading: false,
  isEditDrawerOpen: false,

  setSelectedTopic: (topic: Topic | null) => {
    set({ selectedTopic: topic });
  },

  setEditDrawerOpen: (open: boolean) => {
    const state = get();
    set({
      isEditDrawerOpen: open,
      selectedTopic: open ? state.selectedTopic : null,
    });
  },

  loadPublicTopics: async () => {
    set({ isLoading: true });
    try {
      const topics = await topicStorage.getAllPublicTopics();
      set({ publicTopics: topics, isLoading: false });
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
  },

  loadUserTopics: async (userId: string) => {
    set({ isLoading: true });
    try {
      const userTopics = await topicStorage.getUserTopics(userId);
      set({ userTopics, isLoading: false });
    } catch (error) {
      console.error('Failed to load user topics:', error);
      set({ isLoading: false });
    }
  },

  createTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.createTopic(topic);
      await get().loadUserTopics(topic.userId as string);
      if (topic.isPublic) {
        await get().loadPublicTopics();
      }
      set({ isLoading: false });
      return topic;
    } catch (error) {
      console.error('Failed to create topic:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.updateTopic(topic);
      await get().loadUserTopics(topic.userId as string);
      if (topic.isPublic) {
        await get().loadPublicTopics();
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to update topic:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getTopicById: async (id: string): Promise<Topic | null> => {
    set({ isLoading: true, topic: null });
    try {
      const topic: Topic | null = await topicStorage.getTopicById(id);
      set({ topic, isLoading: false });
      return topic;
    } catch (error) {
      console.error('Failed to get topic by id:', error);
      set({ isLoading: false });
      return null;
    }
  },
  removeTopic: async (id: string) => {
    set({ isLoading: true });
    try {
      await topicStorage.removeTopic(id);
      await get().loadUserTopics(get().topic?.userId as string);
      if (get().topic?.isPublic) {
        await get().loadPublicTopics();
      }
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to remove topic:', error);
      set({ isLoading: false });
    }
  },
  updateTopicsAfterLogin: async (newId: string, lastId: string) => {
    try {
      await topicStorage.updateTopicAfterLogin(newId, lastId);
    } catch (error) {
      console.error('Failed to updateAfterLogin topic:', error);
    }
  },

  searchTopics: async (search: string) => {
    set({ isLoading: true });
    try {
      const userTopics = await topicStorage.searchTopics(get().topic?.userId as string, search);
      set({ userTopics, isLoading: false });
    } catch (error) {
      console.error('Failed to load user topics:', error);
      set({ isLoading: false });
    }
  },
}));
