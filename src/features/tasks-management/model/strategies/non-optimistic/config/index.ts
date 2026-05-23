export const STRATEGY_NAME = "none" as const;
export const QUERY_KEY = ["tasks", STRATEGY_NAME] as const;

export const createMutationKey = (action: string) => [...QUERY_KEY, action] as const;
