export type RepositoryFilterKey = 'created' | 'language' | 'starred';

export interface IRepositoryFilter {
  key: RepositoryFilterKey;
  operator: '>' | '<' | '=';
  value: string;
}
