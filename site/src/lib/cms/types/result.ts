export interface ResultSuccess<T> {
  success: true;
  data: T;
}

export interface ResultError<E = string, ED = undefined> {
  success: false;
  error: E;
  data?: ED;
}

export type Result<T, E = string, ED = undefined> =
  | ResultSuccess<T>
  | ResultError<E, ED>;
