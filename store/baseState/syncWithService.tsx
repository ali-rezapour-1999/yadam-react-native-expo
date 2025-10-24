import { create } from 'zustand';
import { SyincWithServerStateType } from '@/types/base-type';
import { pushSyncDataWithServer } from '@/api/syncApi';
import { useUserState } from '../authState/userState';
import { useLocalChangeTaskStore } from '../taskState/localChange';
import { useLocalChangeTopicStore } from '../topicState/localChange';

export const useSyncWithServerState = create<SyincWithServerStateType>()((set) => ({
  isLoading: false,

  syncDataFromServer: async () => {
    set({ isLoading: true });

    const { user, token } = useUserState.getState();
    if (!user || !token) {
      set({ isLoading: false });
      return;
    }
    const taskState = useLocalChangeTaskStore.getState()
    const topicState = useLocalChangeTopicStore.getState()
    const listTask = await taskState.getAllTask();
    const listTopic = await topicState.getAllTopic();

    try {
      const res = await pushSyncDataWithServer({
        listTopic,
        listTask,
        token,
      });

      if (res.success) {
        res.data.topics.forEach((topic: any) => {
          topicState.createTopic(topic);
        });
        res.data.tasks.forEach((task: any) => {
          taskState.createTask(task);
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

