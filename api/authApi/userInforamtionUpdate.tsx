import Api from '../baseApi';
import { AuthResult, User } from '@/types/auth-type';

export const updateUserInformationAction = async (data: User, token: string): Promise<AuthResult> => {
  try {
    const response = await Api.patch('auth/user-update/', data, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 200) {
      return {
        success: true,
        status: response.status,
        message: response.data.message,
        user: response.data.user,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
      user: response.data.user,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
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
