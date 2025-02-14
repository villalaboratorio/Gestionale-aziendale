// Utility per gestire le richieste
export const RETRY_DELAY = 2000;
export const MAX_RETRIES = 3;

export const fetchWithRetry = async (fetchFn, retries = 0) => {
    try {
        return await fetchFn();
    } catch (error) {
        if (error.status === 429 && retries < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(fetchFn, retries + 1);
        }
        throw error;
    }
};
