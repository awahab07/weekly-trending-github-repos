export interface IApiListResponse<T> {
  incomplete_results: boolean;
  items: T[];
  total_count: number;
}
