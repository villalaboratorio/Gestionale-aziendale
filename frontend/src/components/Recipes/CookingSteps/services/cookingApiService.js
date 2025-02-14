import axios from 'axios';

const BASE_URL = '/api';

const handleApiError = (error, customMessage) => {
    console.error(customMessage, error);
    throw error;
};

export const cookingService = {
    getCotture: async (recipeId) => {
        try {
            console.group(`🌐 API Call: GET /ricette/${recipeId}/cooking`);
            const response = await axios.get(`${BASE_URL}/ricette/${recipeId}/cooking`);
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel recupero cotture');
        }
    },

    createCottura: async (recipeId, cotturaData) => {
        try {
            const payload = {
                tipoCottura: cotturaData.tipoCottura,
                temperatura: Number(cotturaData.temperatura),
                tempoCottura: Number(cotturaData.tempo),
                note: cotturaData.descrizione || '',
                ordine: cotturaData.ordine || 0
            };
    
            console.group(`🌐 API Call: POST /ricette/${recipeId}/cooking`);
            console.log('Payload:', payload);
    
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/cooking`,
                payload
            );
    
            console.log('Response:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            console.group('Error in createCottura');
            console.log('Request payload:', cotturaData);
            console.log('Error details:', error.response?.data);
            console.groupEnd();
            throw error;
        }
    },

    updateCottura: async (recipeId, cotturaId, data) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}/cotture/${cotturaId}`);
            console.log('Update Data:', data);
            const response = await axios.put(
                `${BASE_URL}/ricette/${recipeId}/cotture/${cotturaId}`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Updated:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nell\'aggiornamento cottura');
        }
    },

    deleteCottura: async (recipeId, cotturaId) => {
        try {
            console.group(`🌐 API Call: DELETE /ricette/${recipeId}/cotture/${cotturaId}`);
            const response = await axios.delete(
                `${BASE_URL}/ricette/${recipeId}/cotture/${cotturaId}`
            );
            console.log('Deleted:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nella cancellazione cottura');
        }
    },

    reorderCotture: async (recipeId, newOrder) => {
        try {
            console.group(`🌐 API Call: PUT /ricette/${recipeId}/cotture/reorder`);
            console.log('New Order:', newOrder);
            const response = await axios.put(
                `${BASE_URL}/ricette/${recipeId}/cotture/reorder`,
                { newOrder }
            );
            console.log('Reordered:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel riordinamento cotture');
        }
    },

    saveTempCotture: async (recipeId, cottureData) => {
        try {
            console.group(`🌐 API Call: POST /ricette/${recipeId}/cooking/temp`);
            
            // Ensure cotture array exists and has valid data
            if (!Array.isArray(cottureData)) {
                console.log('No cooking data to save');
                return [];
            }
    
            const payload = {
                cotture: cottureData.map(step => ({
                    tipoCottura: step.tipoCottura._id || step.tipoCottura,
                    temperatura: Number(step.temperatura) || 0,
                    tempoCottura: Number(step.tempoCottura) || 0,
                    note: step.note || '',
                    ordine: step.ordine || 0
                }))
            };
    
            console.log('Payload:', payload);
            
            const response = await axios.post(
                `${BASE_URL}/ricette/${recipeId}/cooking/temp`,
                payload
            );
            
            console.log('Saved Temp:', response.data);
            console.groupEnd();
            return response.data;
        } catch (error) {
            handleApiError(error, 'Errore nel salvataggio temporaneo cotture');
        }
    }
};

export default cookingService;
