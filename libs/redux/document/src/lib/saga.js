import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { Toast } from '@esign-web/libs/utils';
import actions from './actions';
import api from './api';
import * as __ from './constants';
import get from 'lodash/get';

function* uploadDocumentSaga({ payload }) {
  try {
    const { id, file } = payload;
    console.log('file to update', file);
    const response = yield call(api.uploadDocument, { file, id });
    const data = get(response, 'data');
    console.log('data', data);
    yield put(actions.uploadDocumentSuccess({ id: payload.id, status: 'success' }));
  } catch (error) {
    const message = get(error, 'response.data.message');
    Toast({ message: message, type: 'error' });
    yield put(actions.uploadDocumentFailed({ id: payload.id, status: 'failed', error_message: message }));
  }
}

function* getDocumentAllSaga({ payload }) {
  try {
    const response = yield call(api.getDocumentAll, payload);
    const data = get(response, 'data');
    yield put({ type: __.DOCUMENT_GET_ALL_SUCCESS, payload: data });
  } catch (error) {}
}

function* watchDocumentSaga() {
  yield takeEvery(__.DOCUMENT_UPLOAD_FILES, uploadDocumentSaga);
  yield takeLatest(__.DOCUMENT_GET_ALL, getDocumentAllSaga);
}

export default {
  watchDocumentSaga,
};
