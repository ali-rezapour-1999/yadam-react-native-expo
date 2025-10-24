import { create } from 'zustand';
import { SyincWithServerStateType } from '@/types/base-type';
import { useAuthState } from '../authState/authState';
import { pushSyncDataWithServer } from '@/api/syncApi';
import { mapTopicFromBackend } from '@/utils/topicConverter';
import { mapTaskFromBackend } from '@/utils/taskConverter';

export const useSyncWithServerState = create<SyincWithServerStateType>()((set) => ({
  isLoading: false,

  syncDataFromServer: async () => {
    set({ isLoading: true });

    const { user, token } = useAuthState.getState();
    if (!user || !token) {
      set({ isLoading: false });
      return;
    }
    const todoStore = require('./todoState').useTodoStore.getState();
    const topicStore = require('./topcisState').useTopicStore.getState();
    const listTask = await todoStore.getAllTask();
    const listTopic = await topicStore.getAllTopic();

    try {
      const res = await pushSyncDataWithServer({
        listTopic,
        listTask,
        token,
      });

      if (res.success) {
        res.data.topics.forEach((topic: any) => {
          topicStore.createTopic(mapTopicFromBackend(topic));
        });
        res.data.tasks.forEach((task: any) => {
          todoStore.createTask(mapTaskFromBackend(task));
        });
      }
    } catch (error) {
      console.warn('Sync error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}),
)

