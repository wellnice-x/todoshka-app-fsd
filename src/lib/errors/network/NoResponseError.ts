export class NoResponseError extends Error {
  constructor() {
    super("NO RESPONSE ERROR");
    this.name = this.constructor.name;
  }
}
