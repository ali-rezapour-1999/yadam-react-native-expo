import { Result } from '@/types/base-type';
import api from '../baseApi';

export const sendMassageAction = async (email: string): Promise<Result> => {
  try {
    const response = await api.post('user/otp-request/', { email });
    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        status: response.data.status,
        message: response.data.message,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: error.status,
        message: error.message,
      };
    }
    return {
      success: false,
      status: error.status,
      message: error.message,
    };
  }
};

export const sendOtpAction = async (email: string, otp: string): Promise<Result> => {
  try {
    const response = await api.post('user/verify-otp/', { email, otp });
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
    };
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        success: false,
        status: error.status,
        message: error.error,
      };
    }
    return {
      success: false,
      status: 500,
      message: 'خطای ناشناخته در ارتباط با سرور',
    };
  }
};

export const googleLoginAction = async (): Promise<Result> => {
  try {
    const response = await api.post('auth/google-callback/');
    if (response.status === 200) {
      return {
        success: true,
        status: response.data.status,
        message: response.data.message,
        data: response.data.user,
      };
    }
    return {
      success: false,
      status: response.status,
      message: response.data.error,
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
