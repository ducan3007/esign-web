import { get } from 'lodash'
import { call, put, takeLatest } from 'redux-saga/effects'
import { authorizeUserByToken, loginApi, registerApi } from './api'
import * as __ from './constants'
import action from './actions'
import { baseApi } from '@esign-web/libs/utils'

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
    const { email, password, confirmPassword, firstName, lastName } = payload
    const response = yield call(registerApi, { email, password, confirmPassword, firstName, lastName })

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
  let token = window.localStorage.getItem('token')
  let tokenFromUrl = new URLSearchParams(window.location.search).get('token')
  try {
    if (tokenFromUrl) {
      token = tokenFromUrl
      localStorage.setItem('signatureAutoSave', 'false')
    }
    const response = yield call(authorizeUserByToken, { token })
    if (200 === get(response, 'status')) {
      const data = get(response, 'data')
      console.log('>> authorize data', data)
      yield put({ type: __.AUTHORIZE_SUCCESS, payload: data })
    }
  } catch (error) {
    console.log('error', error)
    if (tokenFromUrl) {
      return (window.location.href = `/404`)
    } else if (get(error, 'response.status') === 401) {
      window.localStorage.removeItem('token')
      return (window.location.href = '/login')
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
