let handler: (() => Promise<void>) | null = null;

export const setUnauthorizedHandler = (func: () => Promise<void>) => {
  handler = func;
};

export const handleUnauthorizedGlobal = async () => {
  if (!handler) {
    throw new Error("Unauthorized handler is not set");
  }

  await handler();
};