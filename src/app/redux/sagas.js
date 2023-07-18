import { sagas as authSaga } from '@esign-web/redux/auth';
import { sagas as documentSaga } from '@esign-web/redux/document';
import { all, fork } from 'redux-saga/effects';

const rootSagas = {
  ...authSaga,
  ...documentSaga
};

export default function* rootSaga(getState) {
  yield all(
    Object.keys(rootSagas).map((sagaKey) => {
      return fork(rootSagas[sagaKey]);
    })
  );
}
