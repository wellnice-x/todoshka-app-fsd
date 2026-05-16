export class UserNotFoundError extends Error {
  constructor() {
    super("USER NOT FOUND");
    this.name = this.constructor.name;
  }
}
