import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { Toast } from '@esign-web/libs/utils'
import actions from './actions'
import { GET_CERTIFICATE_ALL } from 'libs/redux/certificate/src/lib/constants'
import api from './api'
import * as __ from './constants'
import { keyBy } from 'lodash'
import get from 'lodash/get'

function* uploadDocumentSaga({ payload }) {
  try {
    const { id, file, upload_type, width, height } = payload
    console.log('file to update', file)
    const response = yield call(api.uploadDocument, { file, id, upload_type, width, height })
    const data = get(response, 'data')
    console.log('data', data)
    yield put(actions.uploadDocumentSuccess({ id: payload.id, status: 'success' }))
    if ('certificate' === upload_type) {
      yield put({
        type: GET_CERTIFICATE_ALL,
        payload: {
          limit: 100,
          offset: 0,
        },
      })
    } else {
      yield put(actions.documentGetAll())
    }
  } catch (error) {
    const message = get(error, 'response.data.message')
    Toast({ message: message, type: 'error' })
    yield put(actions.uploadDocumentFailed({ id: payload.id, status: 'failed', error_message: message }))
  }
}

function* getDocumentAllSaga({ payload }) {
  try {
    const response = yield call(api.getDocuments, payload)
    const data = get(response, 'data')
    let documents = get(data, 'documents')
    documents = keyBy(documents, 'id')
    data.documents = documents
    data.total = get(data, 'total', 0)
    yield put({ type: __.DOCUMENT_GET_ALL_SUCCESS, payload: data })
  } catch (error) {}
}

function* cloneDocumentSaga({ payload }) {
  try {
    const { documentId, setLoading } = payload
    const response = yield call(api.cloneDocument, { documentId: documentId })
    setLoading(false)
    yield put({ type: __.DOCUMENT_GET_ALL })
  } catch (error) {
    const message = get(error, 'response.data.message')
    Toast({ message: 'Clone Document Failed !', type: 'error' })
  }
}

function* getDocumentDetailSaga({ payload }) {
  try {
    const { documentId } = payload
    const response = yield call(api.getDocumentDetail, { documentId: documentId })
    const data = get(response, 'data')
    yield put({ type: __.DOCUMENT_GET_DETAIL, payload: data })
  } catch (error) {
    Toast({ message: 'Get Document Detail Failed !', type: 'error' })
  }
}

function* watchDocumentSaga() {
  yield takeEvery(__.DOCUMENT_UPLOAD_FILES, uploadDocumentSaga)
  yield takeLatest(__.DOCUMENT_GET_ALL, getDocumentAllSaga)
  yield takeEvery(__.DOCUMENT_CREATE_CLONE, cloneDocumentSaga)
  yield takeLatest(__.DOCUMENT_GET_DETAIL, getDocumentDetailSaga)
}

export default {
  watchDocumentSaga,
}
