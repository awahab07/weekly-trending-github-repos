import { all, fork } from 'redux-saga/effects';
import { repositoryListener } from '../features/repository';

export const rootSaga = function* root(): Generator {
  yield all([fork(repositoryListener)]);
};
