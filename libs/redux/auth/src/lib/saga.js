import { get } from 'lodash';
import { call, put, takeLatest } from 'redux-saga/effects';
import { loginApi } from './api';
import * as __ from './constants';

function* loginSaga({ payload }) {
  try {
    const { email, password } = payload;
    const response = yield call(loginApi, { email, password });

    if (200 === get(response, 'status')) {
      const token = get(response, 'data.token');
    }

    const data = get(response, 'data');
    yield put({ type: __.LOGIN_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: __.LOGIN_FAILED, payload: error });
  }
}

function* watchAuthSaga() {
  yield takeLatest(__.AUTHENTICATING, loginSaga);
}

export default {
  watchAuthSaga,
};
