export const STRATEGY_NAME = "patches" as const;
export const QUERY_KEY = ["tasks", STRATEGY_NAME] as const;

export const PATCHES_QUERY_KEY = ["tasksPatches"] as const;

export const createMutationKey = (action: string) => [...QUERY_KEY, action] as const;
