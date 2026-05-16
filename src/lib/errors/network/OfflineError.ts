export class OfflineError extends Error {
  constructor() {
    super("NO INTERNET CONNECTION");
    this.name = this.constructor.name;
  }
}
