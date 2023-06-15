import { baseApi } from '@esign-web/libs/utils';

export const loginApi = (payload: { email: string; password: string }) => {
  return baseApi.post('/auth/login', payload);
};

export const registerApi = (payload: { email: string; password: string; name: string; confirmPassword: string }) => {
  return baseApi.post('/auth/register', payload);
};
