export class SimulatedNetworkLikeError extends Error {
  constructor() {
    super("SIMULATED NETWORK LIKE ERROR");
    this.name = this.constructor.name;
  }
}
