export class SessionRefreshFailedError extends Error {
  constructor() {
    super("SESSION REFRESH FAILED ERROR");
    this.name = this.constructor.name;
  }
}
