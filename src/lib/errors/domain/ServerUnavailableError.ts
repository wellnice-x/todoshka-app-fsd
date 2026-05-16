export class ServerUnreachableError extends Error {
  constructor() {
    super("SERVER IS UNREACHABLE");
    this.name = this.constructor.name;
  }
}
