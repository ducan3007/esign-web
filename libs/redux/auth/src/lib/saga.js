import { get } from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import { loginApi } from './api';
import * as __ from './constants';
import action from './actions';

function* loginSaga({ payload }) {
  try {
    const { email, password, callBack } = payload;
    const response = yield call(loginApi, { email, password });

    if (200 === get(response, 'status')) {
      const token = get(response, 'data.token');
    }

    const data = get(response, 'data');
    yield put(action.loginSuccess(data));
    callBack();
  } catch (error) {
    console.log('error', error);
    yield put({ type: __.LOGIN_FAILED, payload: get(error, 'response.data') });
  }
}

function* signupSaga({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(loginApi, { email, password });

    if (200 === get(response, 'status')) {
      const token = get(response, 'data.token');
    }

    const data = get(response, 'data');
    yield put({ type: __.SIGNUP_SUCCESS, payload: data });
  } catch (error) {
    console.log('error', error);
    yield put({ type: __.SIGNUP_FAILED, payload: get(error, 'response.data') });
  }
}

function* watchAuthSaga() {
  yield takeLatest(__.AUTHENTICATING, loginSaga);
  yield takeLatest(__.SIGNUP, signupSaga);
}

export default {
  watchAuthSaga,
};
