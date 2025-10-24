import { create } from 'zustand';
import { getListOfTopics } from '@/api/topicsApi/getPublicApi';
import { getTopicId } from '@/api/topicsApi/getTopicId';
import { mapTopicFromBackend } from '@/utils/topicConverter';
import { getTopicsByUserId } from '@/api/topicsApi/getTopicsByUserId';
import { ServerChangeTopicStateType } from '@/types/topics-type';
import { useUserState } from '../authState/userState';
import { useLocalChangeTopicStore } from './localChange';

export const useServerChangeTopicState = create<ServerChangeTopicStateType>((set) => ({
  isLoading: false,

  getTopicsByApi: async () => {
    set({ isLoading: true });
    try {
      const topics = await getListOfTopics(useUserState.getState().token as string);
      useLocalChangeTopicStore.getState().explorerTopics = topics.data;
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
    finally {
      set({ isLoading: false });
    }
  },

  getTopicByIdApi: async (id) => {
    set({ isLoading: true });
    try {
      const topic = await getTopicId(id);
      useLocalChangeTopicStore.getState().topic = mapTopicFromBackend(topic.data);
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
    finally {
      set({ isLoading: false });
    }
  },

  getTopicsByUserIdApi: async (id) => {
    set({ isLoading: true });
    try {

      const topics = await getTopicsByUserId(id, useUserState().token as string);
      useLocalChangeTopicStore.getState().userTopics = [...useLocalChangeTopicStore().userTopics, topics.data.map(mapTopicFromBackend)];
    } catch (error) {
      console.error('Failed to load public topics:', error);
      set({ isLoading: false });
    }
    finally {
      set({ isLoading: false });
    }
  },

}));
