import axios from 'axios';

const BASE_URL = '/api';

const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    throw error;
};

export const recipeService = {
    getRecipe: async (recipeId) => {
        try {
            console.group(`🌐 API Call: GET /ricette/${recipeId}`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}`);
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ricetta');
        }
    },

    updateRecipe: async (recipeId, data) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}`);
            console.log('Update Data:', data);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}`, data);
            console.log('Updated:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento ricetta');
        }
    },

    createRecipe: async (data) => {
        try {
            console.group('🌐 API Call: POST /ricette');
            console.log('Create Data:', data);
            const response = await axios.post(`${BASE_URL}/ricette`, data);
            console.log('Created:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione ricetta');
        }
    }
};

export const ingredientiService = {
    getAllIngredients: async () => {
        try {
            console.group('🌐 API Call: GET /ingredienti');
            const response = await axios.get(`${BASE_URL}/ingredienti`);
            console.log('Response:', response.data);
            console.groupEnd();
            return Array.isArray(response.data) ? response.data : response.data.ingredients || [];
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ingredienti');
            return [];
        }
    },

    getIngredientById: async (id) => {
        try {
            console.group(`🌐 API Call: GET /ingredienti/${id}`);
            const response = await axios.get(`${BASE_URL}/ingredienti/${id}`);
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero ingrediente');
        }
    },

    getRecipeIngredients: async (recipeId) => {
        try {
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/ingredienti`);
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Errore nel recupero ingredienti ricetta:', error);
            throw error;
        }
    }
    ,

    createIngredient: async (ingredientData, recipeId) => {
        try {
            console.group(`🌐 API Call: POST /ricette/${recipeId}/ingredienti`);
            console.log('Request Data:', ingredientData);
            const response = await axios.post(`${BASE_URL}/ricette/${recipeId}/ingredienti`, ingredientData);
            console.log('Created:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione ingrediente');
        }
    },

    updateIngredient: async (recipeId, ingredienteId, data) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}/ingredienti/${ingredienteId}`);
            console.log('Update Data:', data);
            const response = await axios.put(
                `${BASE_URL}/ricette/${recipeId}/ingredienti/${ingredienteId}`, 
                data
            );
            console.log('Updated:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento ingrediente');
        }
    
    
    
    },

    deleteIngredient: async (recipeId, index) => {
        try {
            console.group(`🌐 API Call: DELETE /ricette/${recipeId}/ingredienti/${index}`);
            const response = await axios.delete(`${BASE_URL}/ricette/${recipeId}/ingredienti/${index}`);
            console.log('Deleted:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione ingrediente');
        }
    },

    saveTempIngredienti: async (recipeId, ingredientsData) => {
        try {
            console.group('🌐 API Call: POST /ricette/ingredienti/temp');
            console.log('RecipeId:', recipeId);
            console.log('Payload:', ingredientsData);
    
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/ingredienti/temp`, 
                ingredientsData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log('Saved:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            console.group('Errore API saveTempIngredienti');
            console.log('RecipeId:', recipeId);
            console.log('Payload:', ingredientsData);
            console.log('Errore:', error.response?.data);
            console.groupEnd();
            throw error;
        }
    }
    
    ,

    getUnits: async () => {
        try {
            console.group('🌐 API Call: GET /units');
            const response = await axios.get(`${BASE_URL}/units`);
            console.log('Units:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero unità');
        }
    },

    searchIngredients: async (query) => {
        try {
            console.group('🌐 API Call: GET /ingredienti/search');
            const response = await axios.get(`${BASE_URL}/ingredienti/search`, { 
                params: { q: query }
            });
            console.log('Search Results:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella ricerca ingredienti');
        }
    },

    getNutritionByBarcode: async (barcode) => {
        try {
            console.group(`🌐 API Call: GET /ingredienti/nutrition/${barcode}`);
            const response = await axios.get(`${BASE_URL}/ingredienti/nutrition/${barcode}`);
            console.log('Nutrition Data:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero valori nutrizionali');
        }
    }
};

export const fasiService = {
    getFasi: async (recipeId) => {
        try {
            console.group(`🌐 API Call: GET /ricette/${recipeId}/fasi`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/fasi`);
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero fasi');
        }
    },

    createFase: async (recipeId, faseData) => {
        try {
            console.group(`🌐 API Call: POST /ricette/${recipeId}/fasi`);
            console.log('Request Data:', faseData);
            const response = await axios.post(`${BASE_URL}/ricette/${recipeId}/fasi`, faseData);
            console.log('Created:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione fase');
        }
    },

    updateFase: async (recipeId, index, data) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}/fasi/${index}`);
            console.log('Update Data:', data);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}/fasi/${index}`, data);
            console.log('Updated:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento fase');
        }
    },

    deleteFase: async (recipeId, index) => {
        try {
            console.group(`🌐 API Call: DELETE /ricette/${recipeId}/fasi/${index}`);
            const response = await axios.delete(`${BASE_URL}/ricette/${recipeId}/fasi/${index}`);
            console.log('Deleted:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione fase');
        }
    },

    reorderFasi: async (recipeId, newOrder) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}/fasi/reorder`);
            console.log('New Order:', newOrder);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}/fasi/reorder`, { newOrder });
            console.log('Reordered:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel riordinamento fasi');
        }
    }
};

const apiServices = {
    recipeService,
    ingredientiService,
    fasiService
};

export default apiServices;
