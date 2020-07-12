import { config } from '../config';
import { IRepository } from '../models/IRepository';
import { Persistence } from '../utils/Persistence';

import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

axios.defaults.headers['Accept'] = 'application/vnd.github.v3+json';

export const LOCAL_STORAGE_STARS_KEY = 'GITHUB-STARRED-REPOS';
export const persistence = new Persistence(window);
export interface IRepoFilter {
  key: string;
  operator: '>' | '<' | '=';
  value: string;
}

export const getWeeklyRepos = (filters?: IRepoFilter[]): Promise<IRepository[]> => {
  const weekBack = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const weekFilter: IRepoFilter = { key: 'created', operator: '>', value: weekBack };
  const filtersQueryString = [weekFilter, ...(filters ?? [])]
    .map((f) => `${f.key}:${f.operator === '=' ? '' : f.operator}${f.value}`)
    .join('+');
  const url =
    config.github.baseUrl + `/search/repositories?q=${filtersQueryString}&sort=stars&order=desc`;

  return axios
    .get<IRepository[]>(url)
    .then((res: AxiosResponse<IRepository[]>): IRepository[] => res.data);
};

export const getWeeklyStarredRepos = (filters?: IRepoFilter[]): Promise<IRepository[]> => {
  return getWeeklyRepos(filters).then((repos) => {
    const starredRepoIds: number[] = persistence.get(LOCAL_STORAGE_STARS_KEY) ?? [];
    return repos.filter((repo) => starredRepoIds.includes(repo.id));
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
