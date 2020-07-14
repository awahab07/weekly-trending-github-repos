import { config } from '../config';
import { IRepository } from '../models';

import axios from 'axios';
import moment from 'moment';
import { IApiListResponse } from '../models/IApiListResponse';
import { IRepositoryFilter } from '../shared';
import { MOCK_REPOS } from '../shared/testing';
import { getWeeklyRepos, persistence, starRepo, unStarRepo } from './github.api';

const getListResponseForRepos = (repos: Partial<IRepository>[]): IApiListResponse<IRepository> => ({
  incomplete_results: false,
  items: repos as IRepository[],
  total_count: 100,
});

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
      .mockImplementation(() => Promise.resolve({ data: getListResponseForRepos(MOCK_REPOS) }));
    getWeeklyRepos().then((repos) => {
      expect(getSpy).toHaveBeenCalledWith(url);
      expect(repos).toEqual(MOCK_REPOS);

      done();
    });
  });

  test('should reject promise when response is undefined', () => {
    const persistenceGetMock = jest.spyOn(persistence, 'get').mockReturnValue([3344, 4455]);
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: undefined }));
    expect(getWeeklyRepos([])).rejects.toBeTruthy();
    persistenceGetMock.mockRestore();
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
      .mockImplementation(() => Promise.resolve({ data: getListResponseForRepos(MOCK_REPOS) }));
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
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: getListResponseForRepos(allRepos) }));

    const starredFilter: IRepositoryFilter = { key: 'starred', operator: '=', value: 'true' };

    getWeeklyRepos([starredFilter]).then((repos) => {
      expect(repos.some((repo) => !repo.extras.starred)).toBeFalsy();

      persistenceGetMock.mockRestore();
      done();
    });
  });

  test('should mark extras.starred to true when repo is starred', (done: jest.DoneCallback) => {
    const starredRepos = [
      { ...MOCK_REPOS[0], id: 3344 },
      { ...MOCK_REPOS[0], id: 4455 },
    ];
    const allRepos = [...MOCK_REPOS, ...starredRepos];
    const persistenceGetMock = jest.spyOn(persistence, 'get').mockReturnValue([3344, 4455]);
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: getListResponseForRepos(allRepos) }));

    getWeeklyRepos([]).then((repos) => {
      const repoWithSattedTrue: IRepository = {
        ...MOCK_REPOS[0],
        extras: { starred: true },
      } as IRepository;
      expect(repos).toEqual(
        expect.arrayContaining([
          { ...repoWithSattedTrue, id: 3344 },
          { ...repoWithSattedTrue, id: 4455 },
        ])
      );

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
    jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({ data: getListResponseForRepos(allRepos) }));

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
