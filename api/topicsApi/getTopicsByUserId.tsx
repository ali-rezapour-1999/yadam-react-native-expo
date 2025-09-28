import api from '../baseApi';
import { Result } from '@/types/auth-type';

export const getTopicsByUserId = async (userId: string, token: string): Promise<Result> => {

  try {
    const response = await api.get(`/topics/${userId}/get_topics_by_user`, { headers: { Authorization: `Bearer ${token}` } });
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

}
