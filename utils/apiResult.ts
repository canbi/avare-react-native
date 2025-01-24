class APIResult<T> {
  private constructor(public readonly isSuccess: boolean, public readonly value?: T, public readonly error?: Error) {}

  static success<T>(data?: T): APIResult<T> {
    return new APIResult<T>(true, data);
  }

  static failure<T>(error: unknown): APIResult<T> {
    const normalizedError =
      error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'An unknown error occurred');
    return new APIResult<T>(false, undefined, normalizedError);
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from a failed result');
    }
    return this.value!;
  }

  getError(): Error {
    if (this.isSuccess) {
      throw new Error('Cannot get error from a successful result');
    }
    return this.error!;
  }
}

export default APIResult;
