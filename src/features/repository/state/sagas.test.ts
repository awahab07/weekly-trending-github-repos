import { Action } from '@reduxjs/toolkit';
import { runSaga } from 'redux-saga';
import * as githubApi from '../../../api/github.api';
import { IRepository } from '../../../models';
import { MOCK_FETCH_DATA_ERROR, MOCK_REPOS, MOCK_UPDATE_DATA_ERROR } from '../../../shared/testing';

import { actions } from './reducer';

import { fetchRepositories, updateRepository } from './sagas';

describe('fetchRepositories', () => {
  it('should call api and dispatch success action', async () => {
    const getWeeklyReposSpy = jest
      .spyOn(githubApi, 'getWeeklyRepos')
      .mockImplementation(() => Promise.resolve(MOCK_REPOS as any));

    const dispatched: Action[] = [];

    await runSaga(
      {
        dispatch: (action: Action) => dispatched.push(action),
      },
      fetchRepositories,
      actions.getRepositories({ filters: [] })
    );

    expect(getWeeklyReposSpy).toHaveBeenCalledTimes(1);
    expect(getWeeklyReposSpy).toHaveBeenCalledWith([]);
    expect(dispatched).toEqual([
      actions.getRepositoriesSuccess({ repositories: MOCK_REPOS as any }),
    ]);
    getWeeklyReposSpy.mockClear();
  });

  it('should call api and dispatch error action', async () => {
    const getWeeklyReposSpy = jest
      .spyOn(githubApi, 'getWeeklyRepos')
      .mockImplementation(() => Promise.reject({ message: MOCK_FETCH_DATA_ERROR }));

    const dispatched: Action[] = [];

    await runSaga(
      {
        dispatch: (action: Action) => dispatched.push(action),
      },
      fetchRepositories,
      actions.getRepositories({ filters: [] })
    );

    expect(getWeeklyReposSpy).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([actions.getRepositoriesFailure(MOCK_FETCH_DATA_ERROR)]);
    getWeeklyReposSpy.mockClear();
  });
});

describe('updateRepository', () => {
  const testRepo = MOCK_REPOS[0] as IRepository;

  it('should call api.starRepo and dispatch success action', async () => {
    const starRepoSpy = jest
      .spyOn(githubApi, 'starRepo')
      .mockImplementation(() => Promise.resolve(true));

    const dispatched: Action[] = [];

    await runSaga(
      {
        dispatch: (action: Action) => dispatched.push(action),
      },
      updateRepository,
      actions.updateRepositoryStarred({ repository: testRepo, star: true, filters: [] })
    );

    expect(starRepoSpy).toHaveBeenCalledTimes(1);
    expect(starRepoSpy).toHaveBeenCalledWith(testRepo);
    expect(dispatched).toEqual([
      actions.updateRepositoryStarredSuccess({ repository: testRepo }),
      actions.getRepositories({ filters: [] }),
    ]);
    starRepoSpy.mockClear();
  });

  it('should call api.unStarRepo and dispatch success action', async () => {
    const unStarRepoSpy = jest
      .spyOn(githubApi, 'unStarRepo')
      .mockImplementation(() => Promise.resolve(MOCK_REPOS as any));

    const dispatched: Action[] = [];

    await runSaga(
      {
        dispatch: (action: Action) => dispatched.push(action),
      },
      updateRepository,
      actions.updateRepositoryStarred({ repository: testRepo, star: false, filters: [] })
    );

    expect(unStarRepoSpy).toHaveBeenCalledTimes(1);
    expect(unStarRepoSpy).toHaveBeenCalledWith(testRepo);
    expect(dispatched).toEqual([actions.updateRepositoryStarredSuccess({ repository: testRepo }), actions.getRepositories({ filters: [] })]);
    unStarRepoSpy.mockClear();
  });

  it('should call api.starRepo and dispatch error action', async () => {
    const starRepoSpy = jest
      .spyOn(githubApi, 'starRepo')
      .mockImplementation(() => Promise.reject({ message: MOCK_UPDATE_DATA_ERROR }));

    const dispatched: Action[] = [];

    await runSaga(
      {
        dispatch: (action: Action) => dispatched.push(action),
      },
      updateRepository,
      actions.updateRepositoryStarred({ repository: testRepo, star: true, filters: [] })
    );

    expect(starRepoSpy).toHaveBeenCalledTimes(1);
    expect(dispatched).toEqual([
      actions.updateRepositoryStarredFailure({
        repository: testRepo,
        error: MOCK_UPDATE_DATA_ERROR,
      }),
    ]);
    starRepoSpy.mockClear();
  });
});
