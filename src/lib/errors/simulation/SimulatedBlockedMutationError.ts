export class SimulatedBlockedMutationError extends Error {
  constructor() {
    super("SIMULATED BLOCKED MUTATION ERROR");
    this.name = this.constructor.name;
  }
}
