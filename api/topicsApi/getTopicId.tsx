import api from "../baseApi";

export const getTopicId = async (id: string) => {
  try {
    const response = await api.get(`/topics/${id}/get_topic`);
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
      message: response.data.error,
      data: response.data.user,
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

