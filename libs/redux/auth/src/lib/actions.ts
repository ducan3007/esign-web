import * as __ from './constants';

export const login = (payload: { email: string; password: string }) => {
  return { type: __.AUTHENTICATING, payload };
};

export const loginSuccess = (payload: any) => {
  return { type: __.LOGIN_SUCCESS, payload };
};

export const loginFailed = (payload: any) => {
  return { type: __.LOGIN_FAILED, payload };
};

export const logout = () => {
  return { type: __.LOGINGOUT };
};
