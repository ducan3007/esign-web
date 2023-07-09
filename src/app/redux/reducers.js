/* eslint-disable array-callback-return */
import { combineReducers } from 'redux';
import { reducers as auth } from '@esign-web/redux/auth';

const eSignReducers = {
  auth,
};

const reducers = combineReducers(eSignReducers);

export default reducers;

export const eSignNamespaces = Object.keys(eSignReducers);
