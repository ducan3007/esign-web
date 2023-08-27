import { get } from 'lodash'
import { call, put, takeLatest } from 'redux-saga/effects'
import { authorizeUserByToken, loginApi } from './api'
import * as __ from './constants'
import action from './actions'

function* loginSaga({ payload }) {
  try {
    const { email, password, callBack } = payload
    const response = yield call(loginApi, { email, password })

    if (200 === get(response, 'status')) {
      const token = get(response, 'data.token')
    }

    const data = get(response, 'data')
    yield put(action.loginSuccess({ access_token: data.access_token, ...data.user }))
    callBack()
  } catch (error) {
    console.log('error', error)
    yield put({ type: __.LOGIN_FAILED, payload: get(error, 'response.data') })
  }
}

function* signupSaga({ payload }) {
  try {
    const { email, password } = payload
    const response = yield call(loginApi, { email, password })

    if (200 === get(response, 'status')) {
      const token = get(response, 'data.token')
    }

    const data = get(response, 'data')
    yield put({ type: __.SIGNUP_SUCCESS, payload: data })
  } catch (error) {
    console.log('error', error)
    yield put({ type: __.SIGNUP_FAILED, payload: get(error, 'response.data') })
  }
}

function* authorizeUserSaga() {
  try {
    const token = window.localStorage.getItem('token')
    const response = yield call(authorizeUserByToken, { token })

    if (200 === get(response, 'status')) {
      const data = get(response, 'data')
      console.log('>> authorize data', data)
      yield put({ type: __.AUTHORIZE_SUCCESS, payload: data })
    }
  } catch (error) {
    console.log('error', error)
    if (get(error, 'response.status') === 401) {
      window.localStorage.removeItem('token')
      // redirect to login page
      window.location.href = '/login'
    }
  }
}

function* watchAuthSaga() {
  yield takeLatest(__.AUTHENTICATING, loginSaga)
  yield takeLatest(__.SIGNUP, signupSaga)
  yield takeLatest(__.AUTHORIZE_USER, authorizeUserSaga)
}

export default {
  watchAuthSaga,
}
