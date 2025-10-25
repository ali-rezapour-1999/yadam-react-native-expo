import { create } from 'zustand';
import { topicStorage } from '@/storage/database';
import { Topic } from '@/types/database-type';
import { LocalChangeTopicStateType } from '@/types/topics-type';
import { useUserState } from '../authState/userState';
import { getTopicsByUserId } from '@/api/topicsApi/getTopicsByUserId';

export const useLocalChangeTopicStore = create<LocalChangeTopicStateType>((set, get) => ({
  // ====== STATE ======
  topic: null,
  topics: [],
  publicTopics: [],
  userTopics: [],
  explorerTopics: [],
  selectedTopic: null,
  isLoading: false,
  isEditDrawerOpen: false,

  // ====== SETTERS ======
  setSelectedTopic: (topic: Topic | null) => set({ selectedTopic: topic }),

  // ====== LOADERS ======
  loadPublicTopics: async () => {
    set({ isLoading: true });
    try {
      const topics = await topicStorage.getAllPublicTopics();
      set({ publicTopics: topics });
    } catch (error) {
      console.error('❌ Failed to load public topics:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadUserTopics: async (userId: string) => {
    set({ isLoading: true });
    try {
      const userTopics = await topicStorage.getUserTopics(userId);
      set({ userTopics });
    } catch (error) {
      console.error('❌ Failed to load user topics:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== CRUD OPERATIONS ======
  createTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.createTopic(topic);
      await get().reloadTopics(topic);
      return topic;
    } catch (error) {
      console.error('❌ Failed to create topic:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTopic: async (topic: Topic) => {
    set({ isLoading: true });
    try {
      await topicStorage.updateTopic(topic);
      await get().reloadTopics(topic);
    } catch (error) {
      console.error('❌ Failed to update topic:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeTopic: async (id: string) => {
    set({ isLoading: true });
    try {
      const currentTopic = get().topic;
      await topicStorage.removeTopic(id);
      if (currentTopic?.userId) await get().loadUserTopics(currentTopic.userId);
      if (currentTopic?.isPublic) await get().loadPublicTopics();
    } catch (error) {
      console.error('❌ Failed to remove topic:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== GETTERS ======
  getTopicById: async (id: string): Promise<Topic | null> => {
    set({ isLoading: true, topic: null });
    try {
      const topic = await topicStorage.getTopicById(id);
      set({ topic });
      return topic;
    } catch (error) {
      console.error('❌ Failed to get topic by id:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllTopic: async (): Promise<Topic[]> => {
    try {
      const userId = useUserState.getState().user?.id as string;
      return await topicStorage.getAllUserTopicsByUserId(userId);
    } catch (error) {
      console.error('❌ Failed to load all topics:', error);
      return [];
    }
  },

  // ====== SEARCH ======
  searchTopics: async (search: string) => {
    set({ isLoading: true });
    try {
      const userId = useUserState.getState().user?.id as string;
      const token = useUserState.getState().token as string;

      const localTopics = await topicStorage.searchTopics(userId, search);
      const apiRes = await getTopicsByUserId(userId, token);

      const apiTopics = apiRes.success ? apiRes.data : [];
      const mergedTopics = [
        ...(Array.isArray(localTopics) ? localTopics : [localTopics]),
        ...apiTopics,
      ];

      set({ userTopics: mergedTopics });
    } catch (error) {
      console.error('❌ Failed to search topics:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ====== UTILITIES ======
  updateTopicsAfterLogin: async (newId: string, lastId: string) => {
    try {
      await topicStorage.updateTopicAfterLogin(newId, lastId);
    } catch (error) {
      console.error('❌ Failed to update topics after login:', error);
    }
  },

  reloadTopics: async (topic: Topic) => {
    await get().loadUserTopics(topic.userId as string);
    if (topic.isPublic) await get().loadPublicTopics();
  },
}));
