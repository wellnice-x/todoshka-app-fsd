export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = this.constructor.name;
  }
}
