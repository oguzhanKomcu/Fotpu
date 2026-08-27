export type HttpStatusCode = number;

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface Result<T = any> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string | null;
  statusCode?: HttpStatusCode;
  value?: T | null;
}

export interface PagedList<T> {
  items: T[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface PagedListResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string | null;
  statusCode?: HttpStatusCode;
  value?: PagedList<T> | null;
}

export interface ListResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: string | null;
  statusCode?: HttpStatusCode;
  value?: T[] | null;
}
