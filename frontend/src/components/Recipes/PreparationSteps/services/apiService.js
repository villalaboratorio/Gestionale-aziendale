import axios from 'axios';

const BASE_URL = '/api';

const clearCache = () => {
    window.sessionStorage.clear(); // Pulizia completa della sessione
    localStorage.removeItem('ingredientiTemp');
    localStorage.removeItem('recipeIngredients');
};

const getCachedData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};
const handleApiError = (error, customMessage) => {
    console.error(`🔴 ${customMessage}:`, error);
    throw error;
};

const logApiCall = (method, endpoint, data = null) => {
    console.group(`🌐 API Call: ${method} ${endpoint}`);
    if (data) console.log('Request Data:', data);
};

const logApiResponse = (response) => {
    console.log('Response:', response.data);
    console.groupEnd();
};

export const recipeService = {
    getRecipe: async (recipeId) => {
        try {
            logApiCall('GET', `/ricette/${recipeId}`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ricetta');
        }
    },

    updateRecipe: async (recipeId, data) => {
        try {
            logApiCall('PUT', `/ricette/${recipeId}`, data);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}`, data);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento ricetta');
        }
    },

    createRecipe: async (data) => {
        try {
            logApiCall('POST', '/ricette', data);
            const response = await axios.post(`${BASE_URL}/ricette`, data);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione ricetta');
        }
    }
};

export const ingredientiService = {
    getAllIngredients: async () => {
        try {
            logApiCall('GET', '/ingredienti');
            const response = await axios.get(`${BASE_URL}/ingredienti`);
            logApiResponse(response);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ingredienti');
            return [];
        }
    },

    getIngredientById: async (id) => {
        try {
            logApiCall('GET', `/ingredienti/${id}`);
            const response = await axios.get(`${BASE_URL}/ingredienti/${id}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ingrediente');
        }
    },

    getRecipeIngredients: async (recipeId) => {
        try {
            const cachedData = getCachedData(`recipeIngredients_${recipeId}`);
            if (cachedData) return cachedData;
    
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/ingredienti`);
            setCachedData(`recipeIngredients_${recipeId}`, response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ingredienti ricetta');
        }
    },

    createIngredient: async (ingredientData, recipeId) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/ingredienti`, ingredientData);
            const response = await axios.post(`${BASE_URL}/ricette/${recipeId}/ingredienti`, ingredientData);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione ingrediente');
        }
    },

    updateIngredient: async (recipeId, ingredientId, data) => {
        try {
            logApiCall('PUT', `/ricette/${recipeId}/ingredienti/${ingredientId}`, data);
            const response = await axios.put(
                `${BASE_URL}/ricette/${recipeId}/ingredienti/${ingredientId}`, 
                data
            );
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento ingrediente');
        }
    },

    deleteIngredient: async (recipeId, index) => {
        try {
            logApiCall('DELETE', `/ricette/${recipeId}/ingredienti/${index}`);
            const response = await axios.delete(`${BASE_URL}/ricette/${recipeId}/ingredienti/${index}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione ingrediente');
        }
    },

    saveTempIngredienti: async (recipeId, ingredientsData) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/ingredienti/temp`, ingredientsData);
            
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/ingredienti/temp`,
                ingredientsData
            );
            
            clearCache(); // Pulizia cache dopo il salvataggio
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio ingredienti temporanei');
        }
    },    

    getUnits: async () => {
        try {
            logApiCall('GET', '/units');
            const response = await axios.get(`${BASE_URL}/units`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero unità');
            return [];
        }
    },

    searchIngredients: async (query) => {
        try {
            logApiCall('GET', '/ingredienti/search', { q: query });
            const response = await axios.get(`${BASE_URL}/ingredienti/search`, { 
                params: { q: query }
            });
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella ricerca ingredienti');
        }
    },

    getNutritionByBarcode: async (barcode) => {
        try {
            logApiCall('GET', `/ingredienti/nutrition/${barcode}`);
            const response = await axios.get(`${BASE_URL}/ingredienti/nutrition/${barcode}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero valori nutrizionali');
        }
    }
};

export const fasiService = {
    getFasi: async (recipeId) => {
        try {
            logApiCall('GET', `/ricette/${recipeId}/fasi`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/fasi`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero fasi');
        }
    },

    createFase: async (recipeId, faseData) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/fasi`, faseData);
            const response = await axios.post(`${BASE_URL}/ricette/${recipeId}/fasi`, faseData);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione fase');
        }
    },

    updateFase: async (recipeId, index, data) => {
        try {
            logApiCall('PUT', `/ricette/${recipeId}/fasi/${index}`, data);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}/fasi/${index}`, data);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento fase');
        }
    },

    deleteFase: async (recipeId, index) => {
        try {
            logApiCall('DELETE', `/ricette/${recipeId}/fasi/${index}`);
            const response = await axios.delete(`${BASE_URL}/ricette/${recipeId}/fasi/${index}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione fase');
        }
    },

    reorderFasi: async (recipeId, newOrder) => {
        try {
            logApiCall('PUT', `/ricette/${recipeId}/fasi/reorder`, { newOrder });
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}/fasi/reorder`, { newOrder });
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel riordinamento fasi');
        }
    },

    saveTempFasi: async (recipeId, data) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/fasi/temp`, data);
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/fasi/temp`,
                { fasi: Array.isArray(data) ? data : [data] }  // Ensure we're sending an array
            );
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio fasi temporanee');
        }
    }
};

const apiServices = {
    recipeService,
    ingredientiService,

};


export default apiServices;