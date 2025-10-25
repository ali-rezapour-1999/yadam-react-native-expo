import { ProfileResult, UserProfile } from '@/types/user-profile';
import Api from '../baseApi';

export const userProfileUpdate = async (data: UserProfile, token: string): Promise<ProfileResult> => {
  try {
    const response = await Api.patch('user/update', data, { headers: { Authorization: `Bearer ${token}` } });
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
      data: response.data.data,
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
