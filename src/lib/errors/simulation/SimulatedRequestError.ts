export class SimulatedRequestError extends Error {
  constructor() {
    super("SIMULATED REQUEST ERROR");
    this.name = this.constructor.name;
  }
}
