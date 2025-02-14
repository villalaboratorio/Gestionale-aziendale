import axios from 'axios';

const BASE_URL = '/api/ricette';

export const fasiApi = {
    getFasi: async (recipeId) => {
        const response = await axios.get(`${BASE_URL}/${recipeId}/fasi`);
        return response.data;
    },

    createFase: async (recipeId, fase) => {
        const response = await axios.post(`${BASE_URL}/${recipeId}/fasi`, {
            ...fase,
            tipoLavorazione: fase.tipoLavorazione._id || fase.tipoLavorazione,
            metodo: fase.metodo._id || fase.metodo
        });
        return response.data;
    },

    updateFase: async (recipeId, faseId, fase) => {
        const response = await axios.put(`${BASE_URL}/${recipeId}/fasi/${faseId}`, {
            ...fase,
            tipoLavorazione: fase.tipoLavorazione._id || fase.tipoLavorazione,
            metodo: fase.metodo._id || fase.metodo
        });
        return response.data;
    },

    deleteFase: async (recipeId, faseId) => {
        await axios.delete(`${BASE_URL}/${recipeId}/fasi/${faseId}`);
    },

    reorderFasi: async (recipeId, { sourceIndex, destinationIndex, fasi }) => {
        const response = await axios.put(`${BASE_URL}/${recipeId}/fasi/reorder`, {
            sourceIndex,
            destinationIndex,
            fasi: fasi.map(fase => ({
                ...fase,
                tipoLavorazione: fase.tipoLavorazione._id || fase.tipoLavorazione,
                metodo: fase.metodo._id || fase.metodo
            }))
        });
        return response.data;
    }
};
