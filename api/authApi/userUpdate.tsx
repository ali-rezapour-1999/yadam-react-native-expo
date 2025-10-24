import { AuthResponseResult, User } from '@/types/auth-type';
import api from '../baseApi';

export const updateUserAction = async (data: User, token: string): Promise<AuthResponseResult> => {
  try {
    const response = await api.post('user/update/', data, { headers: { Authorization: `Bearer ${token}` } });
    console.log(response);
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        status: response.data.status,
        message: response.data.message,
        data: response.data.data.user,
        access_token: response.data.data.token,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
      data: response.data.user,
    };
  } catch (error: any) {

    console.log(error)
    if (error.response && error.response.data) {
      console.log(error)
      return {
        success: false,
        status: 500,
        message: 'خطا در ارتباط با سرور',
      };
    }
    return {
      success: false,
      status: 500,
      message: 'خطای ناشناخته در ارتباط با سرور',
    };
  }
};
