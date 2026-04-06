type RetryableError = {
  response?: {
    status?: number;
    headers?: Record<string, string | undefined>;
  };
};

export const uploadWithRetry = async (
  uploadFn: () => Promise<unknown>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<unknown> => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await uploadFn();
    } catch (error) {
      const requestError = error as RetryableError;
      attempt++;

      if (requestError.response?.status === 429) {
        const retryAfter = requestError.response.headers?.["retry-after"];
        const delayMs = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(baseDelay * Math.pow(2, attempt), 10000);
        const jitter = delayMs * 0.25 * (Math.random() - 0.5);
        const finalDelay = Math.max(delayMs + jitter, 500);

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, finalDelay));
          continue;
        }
      }

      throw error;
    }
  }
};
