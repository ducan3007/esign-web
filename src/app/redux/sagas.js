import { sagas as authSaga } from '@esign-web/redux/auth'
import { sagas as documentSaga } from '@esign-web/redux/document'
import { sagas as signaturesSaga } from '@esign-web/redux/signatures'
import { sagas as walletSaga } from '@esign-web/redux/wallet'
import { sagas as certificateSaga } from '@esign-web/redux/certificate'
import { all, fork } from 'redux-saga/effects'

const rootSagas = {
  ...authSaga,
  ...documentSaga,
  ...signaturesSaga,
  ...walletSaga,
  ...certificateSaga,
}

export default function* rootSaga(getState) {
  yield all(
    Object.keys(rootSagas).map((sagaKey) => {
      return fork(rootSagas[sagaKey])
    })
  )
}
