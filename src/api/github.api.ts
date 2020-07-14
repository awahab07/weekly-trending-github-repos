import { config } from '../config';
import { IRepository } from '../models';
import { IApiListResponse } from '../models/IApiListResponse';
import { IRepositoryFilter, Persistence } from '../shared';

import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

axios.defaults.headers['Accept'] = 'application/vnd.github.v3+json';

export const LOCAL_STORAGE_STARS_KEY = 'GITHUB-STARRED-REPOS';
export const persistence = new Persistence(window);

const starUnStarRepo = (starredIds: number[]) => (repo: IRepository): IRepository => ({
  ...repo,
  extras: { starred: starredIds.includes(repo.id) },
});

export const getWeeklyRepos = (filters?: IRepositoryFilter[]): Promise<IRepository[]> => {
  const weekBack = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const weekFilter: IRepositoryFilter = { key: 'created', operator: '>', value: weekBack };

  const starredFilter = filters?.find((filter) => filter.key === 'starred');
  const queryFilters = filters?.filter((filter) => filter.key !== 'starred');

  const filtersQueryString = [weekFilter, ...(queryFilters ?? [])]
    .map((f) => `${f.key}:${f.operator === '=' ? '' : f.operator}${f.value}`)
    .join('+');
  const url =
    config.github.baseUrl + `/search/repositories?q=${filtersQueryString}&sort=stars&order=desc`;

  return axios
    .get<IApiListResponse<IRepository>>(url)
    .then((res): IRepository[] => res.data.items)
    .then((repos: IRepository[]) =>
      repos.map(starUnStarRepo(persistence.get(LOCAL_STORAGE_STARS_KEY) ?? []))
    )
    .then((repos: IRepository[]) => {
      if (starredFilter !== undefined) {
        const starredFilterPredicate = (r: IRepository) =>
          starredFilter.value === 'false' ? !r.extras.starred : r.extras.starred;

        return repos.filter(starredFilterPredicate);
      }

      return repos;
    });
};

export const starRepo = (repo: IRepository): Promise<boolean> => {
  return new Promise((resolve) => {
    const starredRepoIds: number[] = persistence.get(LOCAL_STORAGE_STARS_KEY) ?? [];

    if (!starredRepoIds.includes(repo.id)) {
      persistence.set(LOCAL_STORAGE_STARS_KEY, [...starredRepoIds, repo.id]);
    }

    resolve(true);
  });
};

export const unStarRepo = (repo: IRepository): Promise<boolean> => {
  return new Promise((resolve) => {
    const starredRepoIds: number[] = persistence.get(LOCAL_STORAGE_STARS_KEY) ?? [];

    if (starredRepoIds.includes(repo.id)) {
      persistence.set(
        LOCAL_STORAGE_STARS_KEY,
        starredRepoIds.filter((id) => id !== repo.id)
      );
    }

    resolve(true);
  });
};
