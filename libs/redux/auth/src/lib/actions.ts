import * as _ from './constants';

const fn = <T>(type: string, payload: T) => {
  return { type, payload };
};

export default {
  login:          (payload: any) => fn(_.AUTHENTICATING, payload),
  loginSuccess:   (payload: any) => fn(_.LOGIN_SUCCESS, payload),
  loginFailed:    (payload: any) => fn(_.LOGIN_FAILED, payload),
  signup:         (payload: any) => fn(_.SIGNUP, payload),
  signupSuccess:  (payload: any) => fn(_.REGISTER_SUCCESS, payload),
  signupFailed:   (payload: any) => fn(_.REGISTER_FAILED, payload),
  logout:         () => fn(_.LOGINGOUT, null),
  logoutSuccess:  () => fn(_.LOGOUT_SUCCESS, null),
  resetAuthState: () => fn(_.RESET_AUTH_STATE, null),
};
