import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { Toast } from '@esign-web/libs/utils'
import actions from './actions'
import api from './api'
import * as __ from './constants'
import { keyBy } from 'lodash'
import get from 'lodash/get'

function* getCertificateAllSaga({ payload }) {
  try {
    let res = yield call(api.getAllCert, payload)
    let data = get(res, 'data')
    let certificates = get(data, 'cert')
    certificates = keyBy(certificates, 'id')
    data.certificates = certificates
    data.total = get(data, 'total', 0)
    yield put({ type: __.GET_CERTIFICATE_ALL_SUCCESS, payload: data })
  } catch (error) {}
}

function* watchCertSaga() {
  yield takeLatest(__.GET_CERTIFICATE_ALL, getCertificateAllSaga)
}

export default {
  watchCertSaga,
}
