export class TimeoutError extends Error {
  constructor() {
    super("REQUEST TIMEOUT");
    this.name = this.constructor.name;
  }
}
