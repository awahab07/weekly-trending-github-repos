import { config } from '../config';
import { IRepository } from '../models';

import axios from 'axios';
import moment from 'moment';
import { IRepositoryFilter } from '../shared';
import { MOCK_REPOS } from '../shared/testing';
import { getWeeklyRepos, persistence, starRepo, unStarRepo } from './github.api';

describe('Github Api', () => {
  const freezeTimeStamp = +new Date();
  let dateMock: jest.MockInstance<any, any>;
  jest.mock('../shared/utils/Persistence', () => undefined);

  beforeEach(() => {
    jest.mock('axios', () => ({}));
    dateMock = jest.spyOn(Date, 'now').mockImplementation(() => freezeTimeStamp);
  });

  afterEach(() => {
    dateMock.mockRestore();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should call github api when asked for weekly repos', (done: jest.DoneCallback) => {
    const weekBack = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const url =
      config.github.baseUrl + `/search/repositories?q=created:>${weekBack}&sort=stars&order=desc`;
    const getSpy = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: MOCK_REPOS }));
    getWeeklyRepos().then((repos) => {
      expect(getSpy).toHaveBeenCalledWith(url);
      expect(repos).toEqual(MOCK_REPOS);

      done();
    });
  });

  test('should be able to apply language filter', (done: jest.DoneCallback) => {
    const languageFilter: IRepositoryFilter = {
      key: 'language',
      operator: '=',
      value: 'javascript',
    };
    const languageQueryStringParam = `+${languageFilter.key}:${languageFilter.value}`;

    const getSpy = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: MOCK_REPOS }));
    getWeeklyRepos([languageFilter]).then((repos) => {
      expect(getSpy).toHaveBeenCalledWith(expect.stringContaining(languageQueryStringParam));

      done();
    });
  });

  test('should only return starred repos when star filter is true', (done: jest.DoneCallback) => {
    const starredRepos = [
      { ...MOCK_REPOS[0], id: 3344 },
      { ...MOCK_REPOS[0], id: 4455 },
    ];
    const allRepos = [...MOCK_REPOS, ...starredRepos];
    const persistenceGetMock = jest.spyOn(persistence, 'get').mockReturnValue([3344, 4455]);
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: allRepos }));

    const starredFilter: IRepositoryFilter = { key: 'starred', operator: '=', value: 'true' };

    getWeeklyRepos([starredFilter]).then((repos) => {
      expect(repos).toEqual(starredRepos);

      persistenceGetMock.mockRestore();
      done();
    });
  });

  test('should only return non-starred repos when star filter is false', (done: jest.DoneCallback) => {
    const starredRepos = [
      { ...MOCK_REPOS[0], id: 3344 },
      { ...MOCK_REPOS[0], id: 4455 },
    ];
    const allRepos = [...MOCK_REPOS, ...starredRepos];
    const persistenceGetMock = jest.spyOn(persistence, 'get').mockReturnValue([3344, 4455]);
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: allRepos }));

    const starredFilter: IRepositoryFilter = { key: 'starred', operator: '=', value: 'false' };

    getWeeklyRepos([starredFilter]).then((repos) => {
      expect(repos).toEqual(MOCK_REPOS);

      persistenceGetMock.mockRestore();
      done();
    });
  });

  test('rejects in case of Network Error', () => {
    const errorMessage = 'Network Error';
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject(new Error(errorMessage)));
    expect(getWeeklyRepos()).rejects.toThrow(errorMessage);
  });

  test('should be able to star a repo', (done: jest.DoneCallback) => {
    starRepo(MOCK_REPOS[0] as IRepository).then((whetherStarred) => {
      expect(whetherStarred).toBeTruthy();
      done();
    });
  });

  test('should be able to unStar a repo', (done: jest.DoneCallback) => {
    unStarRepo(MOCK_REPOS[0] as IRepository).then((whetherUnStarred) => {
      expect(whetherUnStarred).toBeTruthy();
      done();
    });
  });
});
