import { IRepository } from '../../../models';
import { MOCK_FETCH_DATA_ERROR, MOCK_REPOS } from '../../../shared/testing';
import { actions, initialState, reducer } from './reducer';

describe('Repository reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(initialState);
  });

  describe('fetching repositories', () => {
    it('should set loading to true', () => {
      expect(reducer(undefined, actions.getRepositories({ filters: [] }))).toEqual({
        ...initialState,
        loading: true,
      });
    });

    it('should handle actions.getRepositoriesSuccess', () => {
      expect(
        reducer(
          initialState,
          actions.getRepositoriesSuccess({ repositories: MOCK_REPOS as IRepository[] })
        )
      ).toEqual({
        repositories: MOCK_REPOS,
        loading: false,
        error: null,
      });
    });

    it('should set error on actions.getRepositoriesFailure', () => {
      expect(reducer(initialState, actions.getRepositoriesFailure(MOCK_FETCH_DATA_ERROR))).toEqual({
        repositories: [],
        loading: false,
        error: MOCK_FETCH_DATA_ERROR,
      });
    });
  });

  describe('starring repository', () => {
    const fetchedState = { ...initialState, repositories: MOCK_REPOS as IRepository[] };

    it('should set loading to true when starring a repository', () => {
      expect(
        reducer(
          fetchedState,
          actions.updateRepositoryStarred({
            repository: MOCK_REPOS[0] as IRepository,
            star: true,
          })
        )
      ).toEqual({
        ...fetchedState,
        loading: true,
      });
    });

    it('should handle actions.updateRepositoryStarredSuccess', () => {
      expect(
        reducer(
          fetchedState,
          actions.updateRepositoryStarredSuccess({ repository: MOCK_REPOS[0] as IRepository })
        )
      ).toEqual({
        repositories: MOCK_REPOS,
        loading: false,
        error: null,
      });
    });

    it('should set error on actions.updateRepositoryStarredFailure', () => {
      expect(
        reducer(
          fetchedState,
          actions.updateRepositoryStarredFailure({
            repository: MOCK_REPOS[0] as IRepository,
            error: MOCK_FETCH_DATA_ERROR,
          })
        )
      ).toEqual({
        repositories: MOCK_REPOS,
        loading: false,
        error: MOCK_FETCH_DATA_ERROR,
      });
    });
  });
});
