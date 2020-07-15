import { Action } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import * as githubApi from '../../../api/github.api';
import { IRepository } from '../../../models';
import { actions } from './reducer';

export function* fetchRepositories(action: Action): Generator {
  try {
    if (actions.getRepositories.match(action)) {
      const fetchedRepos = yield call(githubApi.getWeeklyRepos, action.payload.filters);
      yield put(actions.getRepositoriesSuccess({ repositories: fetchedRepos as IRepository[] }));
    }
  } catch (e) {
    yield put(actions.getRepositoriesFailure(e.message));
  }
}

export function* updateRepository(action: Action): Generator {
  if (actions.updateRepositoryStarred.match(action)) {
    const repo = action.payload.repository as IRepository;

    try {
      const methodToCall = action.payload.star ? githubApi.starRepo : githubApi.unStarRepo;
      yield call(methodToCall, repo);
      yield put(actions.updateRepositoryStarredSuccess({ repository: repo }));
      yield put(actions.getRepositories({ filters: action.payload.filters }));
    } catch (e) {
      yield put(actions.updateRepositoryStarredFailure({ repository: repo, error: e.message }));
    }
  }
}

export function* listener(): Generator {
  yield takeLatest(actions.getRepositories.type, fetchRepositories);
  yield takeLatest(actions.updateRepositoryStarred.type, updateRepository);
}
