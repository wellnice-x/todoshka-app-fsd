import { TimeoutError } from "@/shared/lib/errors";

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError());
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};
