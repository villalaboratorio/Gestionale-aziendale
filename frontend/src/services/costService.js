import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
const costsCache = new Map();

export const costService = {
    cache: costsCache,
    
    async getRecipeCosts(recipeId) {
        if (!recipeId) {
            console.log('RecipeId non fornito');
            return null;
        }

        // Controllo cache
        const cachedData = this.getFromCache(recipeId);
        if (cachedData) {
            console.log('Dati costi recuperati dalla cache');
            return cachedData;
        }

        try {
            console.log('Richiesta costi per ricetta:', recipeId);
            const response = await axios.get(`/api/ricette/${recipeId}/costs`);
            const costsData = response.data;

            // Salvataggio in cache
            this.saveToCache(recipeId, costsData);
            console.log('Dati costi salvati in cache');

            return costsData;
        } catch (error) {
            console.error('Errore nel recupero dei costi:', error);
            throw error;
        }
    },

    getFromCache(recipeId) {
        const cachedItem = this.cache.get(recipeId);
        if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_DURATION) {
            return cachedItem.data;
        }
        return null;
    },

    saveToCache(recipeId, data) {
        this.cache.set(recipeId, {
            data,
            timestamp: Date.now()
        });
    },

    clearCache() {
        this.cache.clear();
        console.log('Cache dei costi pulita');
    }
};
