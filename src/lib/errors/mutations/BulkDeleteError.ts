export class BulkDeleteError<T = unknown> extends Error {
  results: PromiseSettledResult<T>[];

  constructor(results: PromiseSettledResult<T>[]) {
    super("BULK DELETE ERROR");
    this.results = results;
  }
}
