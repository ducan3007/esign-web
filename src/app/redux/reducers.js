/* eslint-disable array-callback-return */
import { combineReducers } from 'redux'
import { reducers as auth } from '@esign-web/redux/auth'
import { reducers as document } from '@esign-web/redux/document'
import { reducers as signatures } from '@esign-web/redux/signatures'
import { reducers as wallet } from '@esign-web/redux/wallet'
import { reducers as certificate } from '@esign-web/redux/certificate'

const eSignReducers = {
  auth,
  document,
  signatures,
  wallet,
  certificate,
}

const reducers = combineReducers(eSignReducers)

export default reducers

export const eSignNamespaces = Object.keys(eSignReducers)
