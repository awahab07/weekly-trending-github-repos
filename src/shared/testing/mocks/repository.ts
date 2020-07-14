import { IOwner, IRepository } from '../../../models';
import { MOCK_OWNER } from './owner';

export const MOCK_REPOS: Partial<IRepository>[] = [
  {
    id: 1122,
    url: 'https://test-url.com',
    name: 'Test-Repo-Name',
    description: 'exampel description',
    stargazers_count: 10,
    owner: MOCK_OWNER as IOwner,
    extras: {
      starred: false
    }
  },
];
