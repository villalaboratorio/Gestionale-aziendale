const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;
const RATE_LIMIT_DELAY = 1000; // 1 secondo tra le richieste

const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

class ApiService {
    constructor() {
        this.pendingRequests = new Map();
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.initializeService();
    }

    initializeService() {
        console.group('🚀 API Service Configuration');
        console.log('Base URL:', API_BASE_URL);
        console.log('Service Status: Initialized');
        console.groupEnd();
    }

    isCacheValid(key) {
        const timestamp = this.cacheTimestamps.get(key);
        return timestamp && (Date.now() - timestamp) < CACHE_DURATION;
    }

    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) return;
        
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0) {
            const { request, resolve, reject } = this.requestQueue.shift();
            try {
                await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY));
                const response = await request();
                resolve(response);
            } catch (error) {
                reject(error);
            }
        }
        
        this.isProcessingQueue = false;
    }

    async fetch(endpoint, options = {}, retries = 0) {
        const requestId = this.generateRequestId(options.method, endpoint);
        const cacheKey = this.generateRequestId(options.method, endpoint);

        if (this.cache.has(cacheKey) && !options.force) {
            return this.cache.get(cacheKey);
        }

        if (this.pendingRequests.has(requestId)) {
            return this.pendingRequests.get(requestId);
        }

        const executeRequest = () => fetch(this.buildUrl(endpoint), {
            ...options,
            headers: this.buildHeaders(options.headers)
        }).then(async response => {
            if (response.status === 429 && retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                return this.fetch(endpoint, options, retries + 1);
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        });

        const promise = new Promise((resolve, reject) => {
            this.requestQueue.push({ 
                request: executeRequest, 
                resolve, 
                reject 
            });
        });

        this.pendingRequests.set(requestId, promise);
        this.processQueue();

        try {
            const response = await promise;
            this.cache.set(cacheKey, response);
            return response;
        } finally {
            this.pendingRequests.delete(requestId);
        }
    }

    generateRequestId(method, endpoint) {
        return `${method || 'GET'}-${endpoint}-${Date.now()}`;
    }

    buildUrl(endpoint) {
        return `${API_BASE_URL}${endpoint}`;
    }

    buildHeaders(customHeaders = {}) {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders
        };
    }

    clearCache() {
        this.cache.clear();
    }

    handleError(error) {
        if (error.status === 429) {
            console.warn('Rate limit reached, retrying...');
            return;
        }
        console.error('API Error:', error);
    }

    async getLavorazione(id, options = {}) {
        console.group('📋 Chiamata getLavorazione');
        try {
            const response = await this.fetch(`/api/dettaglio-lavorazioni/${id}/informazioni-generali`, options);
            console.log('Risposta API:', response);
            return response;
        } catch (error) {
            this.handleError(error);
            throw error;
        } finally {
            console.groupEnd();
        }
    }

    async getCollections(options = {}) {
        console.group('📚 Analisi Dettagliata Collections');
        try {
            const response = await this.fetch('/api/dettaglio-lavorazioni/initial-data', options);
            const normalizedData = {
                clienti: response.data?.clienti || [],
                ricette: response.data?.ricette || [],
                tipiLavorazione: response.data?.tipiLavorazione || [],
                statiLavorazione: response.data?.statiLavorazione || []
            };
            console.log('Collections normalizzate:', normalizedData);
            return normalizedData;
        } catch (error) {
            this.handleError(error);
            throw error;
        } finally {
            console.groupEnd();
        }
    }

    async createLavorazione(data) {
        return this.fetch('/api/dettaglio-lavorazioni', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateLavorazione(id, data) {
        return this.fetch(`/api/dettaglio-lavorazioni/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async deleteLavorazione(id) {
        return this.fetch(`/api/dettaglio-lavorazioni/${id}`, {
            method: 'DELETE'
        });
    }

    async saveModifica(id, campo, valore) {
        console.group('💾 saveModifica');
        try {
            return await this.fetch(`/api/dettaglio-lavorazioni/${id}/modifica`, {
                method: 'PATCH',
                body: JSON.stringify({ campo, valore })
            });
        } finally {
            console.groupEnd();
        }
    }
}

export const apiService = new ApiService();
export default apiService;