import axios from 'axios';

const BASE_URL = '/api';

export const fasiService = {
    getFasi: async (recipeId) => {
        try {
            console.group(`🌐 API Call: GET /ricette/${recipeId}/fasi`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/fasi`);
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            console.error('Errore nel recupero fasi:', error);
            throw error;
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
            console.error('Errore nella creazione fase:', error);
            throw error;
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
            console.error('Errore nell\'aggiornamento fase:', error);
            throw error;
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
            console.error('Errore nella cancellazione fase:', error);
            throw error;
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
            console.error('Errore nel riordinamento fasi:', error);
            throw error;
        }
    },

    saveTempFasi: async (recipeId, data) => {
        try {
            console.group(`🌐 API Call: POST /ricette/${recipeId}/fasi/temp`);
            console.log('Payload:', data);
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/fasi/temp`,
                data,
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
            console.error('Errore nel salvataggio temporaneo delle fasi:', error);
            throw error;
        }
    }
};

export default fasiService;
