import * as __ from './constants';
import { UserType } from '@esign-web/libs/utils';
import { baseApi } from '@esign-web/libs/utils';
import { Toast } from '@esign-web/libs/utils';

export const initialState = {
  loading: false,
  authenticating: false,
  error: null,
  data: null,

  isLoginSuccess: false,
  isLoginFail: false,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case __.AUTHENTICATING:
      return {
        ...state,
        loading: true,
        authenticating: true,
        error: null,
        data: null,
      };
    case __.LOGIN_SUCCESS:
      console.log('LOGIN_SUCCESS ', action.payload)
      localStorage.setItem('token', action.payload.access_token);
      baseApi.defaults.headers.common['Authorization'] = `Bearer ${action.payload.access_token}`;
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: null,
        data: action.payload,
        isLoginSuccess: true,
        isLoginFail: false,
      };
    case __.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: action.payload,
        data: null,
        isLoginSuccess: false,
        isLoginFail: true,
      };
    case __.LOGINGOUT:
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
      };
    case __.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: null,
        data: null,
      };
    case __.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: null,
        data: action.payload,
      };
    case __.REGISTER_FAILED:
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: action.payload,
        data: null,
      };
    case __.RESET_AUTH_STATE:
      return {
        ...state,
        loading: false,
        authenticating: false,
        error: null,
        data: null,
      };
    default:
      return state;
  }
};
