import { topicStorage } from '@/storage/database';
import { Topic, TopicWithCount } from '@/types/database-type';
import { create } from 'zustand';
import { getListOfTopics } from '@/api/topicsApi/getPublicApi';
import { getTopicId } from '@/api/topicsApi/getTopicId';
import { mapTopicFromBackend } from '@/utils/topicConverter';
import { getTopicsByUserId } from '@/api/topicsApi/getTopicsByUserId';
import { useAppStore } from '@/store/appState';

export interface TopicState {
  topic: Topic | null;
  topics: Topic[];
  publicTopics: Topic[];
  userTopics: TopicWithCount[];
  selectedTopic: Topic | null;
  explorerTopics: Topic[];

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
  getAllTopic: () => Promise<Topic[]>;

  //api
  getTopicsByApi: () => Promise<void>;
  getTopicByIdApi: (id: string) => Promise<void>;
  getTopicsByUserIdApi: (userId: string) => Promise<void>;
}


export const useTopicStore = create<TopicState>((set, get) => ({
  topic: null,
  topics: [],
  publicTopics: [],
  userTopics: [],
  selectedTopic: null,
  isLoading: false,
  isEditDrawerOpen: false,
  explorerTopics: [],

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
      set({
        userTopics: userTopics,
        isLoading: false,
      });
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

  getAllTopic: async (): Promise<Topic[]> => {
    try {
      return await topicStorage.getAllUserTopicsByUserId(useAppStore.getState().user?.id as string);
    } catch (error) {
      console.error('Failed to load topics:', error);
      return [];
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
      const localTopics = await topicStorage.searchTopics(
        get().topic?.userId as string,
        search
      );

      const apiRes = await getTopicsByUserId(
        useAppStore.getState().user?.id as string,
        useAppStore.getState().token as string
      );

      const apiTopics = apiRes.success
        ? apiRes.data.map(mapTopicFromBackend)
        : [];

      const mergedTopics = [
        ...(Array.isArray(localTopics) ? localTopics : [localTopics]),
        ...apiTopics,
      ];

      set({
        userTopics: mergedTopics,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load user topics:", error);
      set({ isLoading: false });
    }
  },

  getTopicsByApi: async () => {
    set({ isLoading: true });
    try {
      const topics = await getListOfTopics(useAppStore.getState().user?.id as string);
      set({ explorerTopics: topics.data, isLoading: false });
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
  },

  getTopicByIdApi: async (id) => {
    set({ isLoading: true });
    try {
      const topic = await getTopicId(id);
      set({ topic: mapTopicFromBackend(topic.data), isLoading: false });
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
  },

  getTopicsByUserIdApi: async (id) => {
    set({ isLoading: true });
    try {
      const topics = await getTopicsByUserId(id, useAppStore().token as string);
      set({ userTopics: [...get().userTopics, topics.data.map(mapTopicFromBackend)], isLoading: false });
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
  },

}));
