import * as ACTION from './constants';

const initialState = {
  loading: false,
  error: null,
  data: null,

  isLoginSuccess: false,
  isLoginFail: false,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ACTION.AUTHENTICATING:
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
      };
    case ACTION.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
        isLoginSuccess: true,
        isLoginFail: false,
      };
    case ACTION.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
        isLoginSuccess: false,
        isLoginFail: true,
      };
    case ACTION.LOGINGOUT:
      return {
        ...state,
        loading: true,
        error: null,
        data: null,
      };
    case ACTION.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: null,
      };
    case ACTION.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      };
    case ACTION.REGISTER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        data: null,
      };
    default:
      return state;
  }
};
