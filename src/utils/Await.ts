export const sleep = (ms: number | null): Promise<void> => {
  return new Promise((resolve) => { setTimeout(resolve, ms || 1000); });
};

export const emptyPromise = () => setTimeout(() => {}, 1);
