import api from "../baseApi";

export const getSyncDataWithServer = async ({ id, token }: { id: string, token: string }) => {
  try {
    const response = await api.get(`/sync-data/sync_tasks_and_topics`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: 500,
        message: error,
      };
    }
    return {
      success: false,
      status: 500,
      message: 'خطای ناشناخته در ارتباط با سرور',
    };
  }
};


export const pushSyncDataWithServer = async ({ listTopic, listTask, token, }: { listTopic: any[]; listTask: any[]; token: string; }) => {
  try {
    const response = await api.post(`/sync-data/sync_push_changes/`, { topics: listTopic, tasks: listTask },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data,
      };
    }
    return {
      success: false,
      status: 500,
      message: "خطای ناشناخته در ارتباط با سرور",
    };
  }
};

