import { sagas as authSaga } from '@esign-web/redux/auth';
import { all, fork } from 'redux-saga/effects';

const rootSagas = {
  ...authSaga,
};

export default function* rootSaga(getState) {
  yield all(
    Object.keys(rootSagas).map((sagaKey) => {
      return fork(rootSagas[sagaKey]);
    })
  );
}
