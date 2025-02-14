import axios from 'axios';

const BASE_URL = '/api';

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

    createRecipe: async (data) => {
        try {
            const { cotture, ...recipeData } = data;
            
            logApiCall('POST', '/ricette', recipeData);
            const recipe = await axios.post(`${BASE_URL}/ricette`, {
                ...recipeData,
                grammiPerPorzione: Number(recipeData.grammiPerPorzione),
                porzioni: Number(recipeData.porzioni)
            });

            if (cotture?.length > 0) {
                await axios.post(`${BASE_URL}/ricette/${recipe.data._id}/cooking/temp`, {
                    cotture: cotture
                });
            }

            logApiResponse(recipe);
            return recipe.data;
        } catch (error) {
            handleApiError(error, 'Errore nella creazione ricetta');
        }
    },

    updateRecipe: async (recipeId, data) => {
        try {
            // 1. Rimuoviamo completamente le cotture dal payload principale
            const { cotture, ...recipeBaseData } = data;
            
            // 2. Formattazione dati base della ricetta
            const formattedData = {
                ...recipeBaseData,
                grammiPerPorzione: Number(recipeBaseData.grammiPerPorzione),
                porzioni: Number(recipeBaseData.porzioni),
                categoria: recipeBaseData.categoria._id || recipeBaseData.categoria
            };
    
            // 3. Aggiorniamo la ricetta base
            logApiCall('PUT', `/ricette/${recipeId}`, formattedData);
            const response = await axios.put(`${BASE_URL}/ricette/${recipeId}`, formattedData);
            logApiResponse(response);
    
            // 4. Se ci sono cotture, le gestiamo separatamente
            if (cotture?.length > 0) {
                const formattedCotture = cotture.map(c => ({
                    tipoCottura: c.tipoCottura._id || c.tipoCottura,
                    temperatura: Number(c.temperatura) || 0,
                    tempoCottura: Number(c.tempoCottura) || 0,
                    note: c.note || '',
                    ordine: Number(c.ordine) || 0
                }));
    
                await axios.post(`${BASE_URL}/ricette/${recipeId}/cooking/temp`, {
                    cotture: formattedCotture
                });
            }
    
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento ricetta');
        }
    }
    
,

    deleteRecipe: async (recipeId) => {
        try {
            logApiCall('DELETE', `/ricette/${recipeId}`);
            const response = await axios.delete(`${BASE_URL}/ricette/${recipeId}`);
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione ricetta');
        }
    },

    saveRecipeIngredients: async (recipeId, ingredientsData) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/ingredienti/temp`, ingredientsData);
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/ingredienti/temp`,
                ingredientsData
            );
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio ingredienti');
        }
    },

    savePreparationPhases: async (recipeId, phasesData) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/fasi/temp`, phasesData);
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/fasi/temp`,
                { fasi: phasesData }
            );
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio fasi di preparazione');
        }
    },

    saveCookingPhases: async (recipeId, cookingData) => {
        try {
            logApiCall('POST', `/ricette/${recipeId}/cotture/temp`, cookingData);
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/cotture/temp`,
                { cotture: cookingData }
            );
            logApiResponse(response);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio fasi di cottura');
        }
    },

    saveTemporaryRecipe: async (recipeId, { ingredients, phases, cooking }) => {
        try {
            console.log('Inizio salvataggio temporaneo', { recipeId });
            
            const promises = [];

            if (ingredients?.length > 0) {
                promises.push(
                    recipeService.saveRecipeIngredients(recipeId, { ingredienti: ingredients })
                );
            }

            if (phases?.length > 0) {
                promises.push(
                    recipeService.savePreparationPhases(recipeId, phases)
                );
            }

            if (cooking?.length > 0) {
                promises.push(
                    recipeService.saveCookingPhases(recipeId, cooking)
                );
            }

            const results = await Promise.all(promises);
            console.log('Salvataggio temporaneo completato');
            return results;
        } catch (error) {
            console.error('Errore nel salvataggio temporaneo:', error);
            console.error('Dettagli errore:', {
                messaggio: error.message,
                stack: error.stack,
                risposta: error.response?.data
            });
            throw error;
        }
    }
};

export default recipeService;
