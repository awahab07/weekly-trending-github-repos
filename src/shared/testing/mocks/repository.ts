import { IOwner, IRepository } from '../../../models';
import { MOCK_OWNER } from './owner';

export const MOCK_REPOS: Partial<IRepository>[] = [
  {
    url: 'https://test-url.com',
    name: 'Test-Repo-Name',
    description: 'exampel description',
    stargazers_count: 10,
    owner: MOCK_OWNER as IOwner,
  },
];
